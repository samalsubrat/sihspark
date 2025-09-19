from config import get_db_main
from flask import Flask, request, jsonify
import requests
from config import config, SessionLocal, engine, update_config, get_db, main_engine, MainSessionLocal
# import psycopg2
from sqlalchemy.sql import text
from langchain.text_splitter import RecursiveCharacterTextSplitter
app = Flask(__name__)


SYSTEM_PROMPT = """
You are Spark AI, an advanced medical assistant chatbot. 

Your responsibilities:
1. Greet the user by their name if available (from user data).
2. Understand the user’s symptoms or query. If unclear, ask polite clarifying questions.
3. Use the provided context sources:
    - Context: retrieved medical knowledge (retrieved_content)
    - User Data: personal info, region, water quality, alerts, reports
    to give tailored, empathetic, and concise advice.
4. Provide only **pre-treatment guidance**: lifestyle tips, self-care, safe over-the-counter options, and awareness of environmental/local risks (e.g., water quality, global alerts).
5. Never give prescriptions or professional diagnoses. Always include:
    "This is pre-treatment guidance only. Please consult a licensed doctor for a professional opinion."
6. If important info is missing (age, sex, symptoms), ask politely.
7. Stay strictly within the scope of symptoms, first-aid, and health awareness. Do not answer unrelated topics.
"""

def get_user_info(user_id):
    
    try:
        if not user_id:
            return "No user ID provided."
        
        db_session_main = next(get_db_main()) 
        query = text("""
        SELECT 
        user_name as name, user_role as role, story_titles as program_tile,story_contents as program_content, 
        user_hotspot_locations as location, user_hotspot_names as region, user_hotspot_descriptions as news, 
        watertest_notes as water_test_note, water_qualities as water_quality, waterbody_names as water_body_name, has_global_alert as global_alert, recent_reports as recent_report
        FROM rag_data_view
        WHERE user_id = :uid
        """)
        user_info = db_session_main.execute(query,  {"uid": user_id}).mappings().fetchone()
        # print(user_info)
        return user_info
    except Exception as e:
        # Rollback session if an error occurs
        if 'db_session_main' in locals() and db_session:
            db_session_main.rollback()
        return f"An unexpected error occurred during query and embedding: {e}"

def query_and_embed(query: str):
    """
    Chunks a query, generates embeddings, performs a similarity search,
    and returns the content of the most similar medical data entries.
    """
    try:
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = text_splitter.split_text(query)
        
        if not chunks:
            return "No content to process."

        payload = {"model": config.EMBEDDING_MODEL, "prompt": chunks[0]}
        # print("payload::::: ",payload)
        r = requests.post(config.OLLAMA_URL + "/api/embeddings", json=payload, timeout=30)
        if r.status_code != 200:
            return f"Embedding API error: {r.status_code} {r.text}"

        resp = r.json()
        # print("resp::::: ",resp)
        embedding = resp.get("embedding")
        if embedding is None:
            return f"No embedding returned: {resp}"

        if not isinstance(embedding, list):
            embedding = list(embedding)

        db_session = next(get_db()) # Get a database session
        
        # first method
        # search_sql = text(
        #     "SELECT content FROM medicalData WHERE to_tsvector('english', content) @@ plainto_tsquery(:query) ORDER BY embedding <-> (:embedding)::vector LIMIT 3;"
        # )
        # second method
        search_sql = text(
            "SELECT content FROM medicaldata2 ORDER BY embedding <-> (:embedding)::vector LIMIT 3;"
        )
        result = db_session.execute(search_sql, {"embedding": embedding})
        # third method
        # search_sql = text(
        #     "SELECT content FROM medicalData WHERE to_tsvector('english', content) @@ websearch_to_tsquery(:query) ORDER BY embedding <-> (:embedding)::vector LIMIT 3;"
        # )
        # result = db_session.execute(search_sql, {"embedding": embedding, "query": query})
        
        rows = result.fetchall()
        
        # Extract content from rows
        retrieved_content = "\n".join([row[0] for row in rows]) if rows else "No relevant medical data found."
        
        return retrieved_content

    except ImportError:
        return "Required libraries (langchain, pgvector) not found. Please install them."
    except Exception as e:
        # Rollback session if an error occurs
        if 'db_session' in locals() and db_session:
            db_session.rollback()
        return f"An unexpected error occurred during query and embedding: {e}"


@app.route('/api/config/get', methods=['GET'])
def get_config():
    """API endpoint to retrieve application configuration."""
    return jsonify(config.__dict__), 200

@app.route('/api/config/set', methods=['POST'])
def set_config():
    """API endpoint to update application configuration."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    try:
        update_config(
            new_db_user=data.get('db_user'),
            new_db_password=data.get('db_password'),
            new_db_host=data.get('db_host'),
            new_db_port=data.get('db_port'),
            new_db_name=data.get('db_name'),
            new_ollama_url=data.get('ollama_url'),
            new_ollama_model=data.get('ollama_model'),
            new_embedding_model=data.get('embedding_model')
        )
        return jsonify({"message": "Configuration updated successfully"}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred during configuration update: {e}"}), 500


@app.route('/api/add_data', methods=['POST'])
def process_text():
    """API endpoint to process text, generate embeddings, and store in the database."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "empty request"}), 400

    try:
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        
        chunks = text_splitter.split_text(data.get('data'))
        
        db_session = next(get_db()) # Get a database session
        inserted = 0
        for i, chunk in enumerate(chunks, start=1):
        
            payload = {"model": config.EMBEDDING_MODEL, "prompt": chunk}
            r = requests.post(config.OLLAMA_URL + "/api/embeddings", json=payload, timeout=30)

            if r.status_code != 200:
                db_session.rollback()
                return jsonify({"error": f"Embedding API error for chunk {i}: {r.status_code} {r.text}"}), 502

            resp = r.json()
            embedding = resp.get("embedding")
            if embedding is None:
                db_session.rollback()
                return jsonify({"error": f"No embedding returned for chunk {i}: {resp}"}), 502

            if not isinstance(embedding, list):
                embedding = list(embedding)

            insert_sql = text(
                "INSERT INTO medicalData (content, embedding) VALUES (:content, :embedding)"
            )
            db_session.execute(insert_sql, {"content": chunk, "embedding": embedding})
            inserted += 1
            print(f"Inserted chunk {inserted} of {len(chunks)}")
        db_session.commit()
        return jsonify({"message": f"Inserted {inserted} chunks"}), 200


    except ImportError:
        return jsonify({"error": "Required libraries (langchain, pgvector) not found. Please install them."}), 500
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        # Rollback session if an error occurs 
        if 'db_session' in locals() and db_session:
            db_session.rollback()
        return jsonify({"error": f"An unexpected error occurred during text processing: {e}"}), 500


@app.route('/api/generate_response', methods=['POST'])
def generate_response_endpoint():
    """
    API endpoint to receive a query, retrieve relevant medical data,
    and generate a response using the Qwen model.
    """
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({"error": "Missing 'query' in request body"}), 400

    user_query = data['query']
    user_id = data['user_id']
    print("query: ", user_query)
    print("user_id: ", user_id)
    

    # Retrieve relevant medical data using the query_and_embed function
    retrieved_content = query_and_embed(user_query)
    if retrieved_content:
        print("Medical Data retrieved.")
    # Retrieve user information
    user_data = get_user_info(user_id)
    if user_data:
        print("User Data retrieved.")
        print(user_data)
###########################################
    # return jsonify(user_data), 200
###########################################

    # prompt = f"{SYSTEM_PROMPT}\n\nContext:\nplace holder for retrieved content\n\nUser Query:\n{user_query}"
    prompt = f"""
                Context:\n{retrieved_content}\n\n
                Additional Information:\n{user_data}\n\n
                User Query:\n{user_query}
                \n
                Answer the query using the context + user data. 
                Start by greeting the user with their name (if provided). 
                If their region has risks (e.g., low water quality, global alerts), include it only if relevant. 
                Give empathetic pre-treatment guidance, ask for clarifications if needed, and always end with the safety disclaimer if advice is provided.
            """
    # print("Additional Information:\n{user_data}\n\nUser Query:\n{user_query}")
    # return  prompt, 200

    try:
        payload = {
            "model": config.OLLAMA_MODEL,  # 'qwen3:0.6b-fp16' as per config
            "prompt": prompt,
            "stream": False,
            "system": SYSTEM_PROMPT,
            "think": False,
            "temperature": 0.2,
            "top_p": 0.9,
            "top_k": 50,
            "repeat_penalty": 1.05,
            "presence_penalty": 0.0,
            "frequency_penalty": 0.0,
            "num_ctx": 12000     
        }
        print("Querying LLM begin.")
        r = requests.post(config.OLLAMA_URL + "/api/generate", json=payload, timeout=30)

        if r.status_code != 200:
            return jsonify({"error": f"Qwen model API error: {r.status_code} {r.text}"}), 502
        print("LLM responsended.")
        resp = r.json()
        generated_text = resp.get("response")
        print(generated_text)

        if generated_text is None:
            return jsonify({"error": f"No response generated by Qwen model: {resp}"}), 502

        return jsonify({"response": generated_text}), 200

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred during Qwen model generation: {e}"}), 500


if __name__ == '__main__':

    app.run(host='0.0.0.0', port=5000, debug=True)
