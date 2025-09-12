from flask import Flask, request, jsonify
import requests
from config import config, SessionLocal, engine, update_config, get_db # Import from config.py
from config import config, update_config, get_db
# import psycopg2
from sqlalchemy.sql import text
from langchain.text_splitter import RecursiveCharacterTextSplitter
app = Flask(__name__)


SYSTEM_PROMPT = """You are Spark AI, an advanced medical assistant chatbot.  
Your purpose is:
1. Understand users' symptoms and ask clarifying questions if needed.  
2. Provide **pre-treatment advice only** (self-care, over-the-counter options, lifestyle tips).  
3. Never give prescriptions or replace professional medical diagnosis. Always include a safety disclaimer.  
4. Use contextual data fed into the conversation (user profile: age, sex, history; local region info: weather, current outbreaks) to tailor your responses.  
5. Respond in a clear, empathetic, and concise tone suitable for non-medical users.  
6. If information is missing, politely ask the user to provide it.  
7. Stay strictly within the scope of symptoms, first-aid, and health awareness. Do not answer unrelated topics.  

Always end with when a treatment is suggested:  
*"This is pre-treatment guidance only. Please consult a licensed doctor for a professional opinion."*
"""

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
        
        search_sql = text(
            "SELECT content FROM medicalData ORDER BY embedding <-> (:embedding)::vector LIMIT 3;"
        )
        result = db_session.execute(search_sql, {"embedding": embedding})
        
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
    user_info = data['info']
    

    # Retrieve relevant medical data using the query_and_embed function
    retrieved_content = query_and_embed(user_query)
    

    # prompt = f"{SYSTEM_PROMPT}\n\nContext:\nplace holder for retrieved content\n\nUser Query:\n{user_query}"
    prompt = f"Context:\n{retrieved_content}\n\nAdditional Information:\n{user_info}\n\nUser Query:\n{user_query}"

    try:
        payload = {
            "model": config.OLLAMA_MODEL,  # 'qwen3:0.6b-fp16' as per config
            "prompt": prompt,
            "stream": False,
            "system": SYSTEM_PROMPT,
            "think": False,
            "temperature": 0.3,      
            "top_p": 0.9,            
            "top_k": 40,             
            # "num_ctx": 8192,       
            "repeat_penalty": 1.1,   
            "presence_penalty": 0.0, 
            "frequency_penalty": 0.0 
        }
        
        r = requests.post(config.OLLAMA_URL + "/api/generate", json=payload, timeout=30)

        if r.status_code != 200:
            return jsonify({"error": f"Qwen model API error: {r.status_code} {r.text}"}), 502

        resp = r.json()
        generated_text = resp.get("response")

        if generated_text is None:
            return jsonify({"error": f"No response generated by Qwen model: {resp}"}), 502

        return jsonify({"response": generated_text}), 200

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred during Qwen model generation: {e}"}), 500


if __name__ == '__main__':

    app.run(host='0.0.0.0', port=5000, debug=True)
