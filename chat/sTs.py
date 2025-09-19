import requests
from semantic_text_splitter import TextSplitter
from sqlalchemy import create_engine, Column, Integer, String, MetaData, Table, JSON
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL") 
if not DATABASE_URL:
    print("DATABASE_URL not found in environment variables. Using default value.")
    os._exit
print("DATABASE_URL: ", DATABASE_URL)

# Ollama API Settings
OLLAMA_URL = "http://localhost:11434/api/embeddings"
EMBEDDING_MODEL = "mxbai-embed-large:latest" # Using the model specified in .env

# SQLAlchemy Setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

metadata = MetaData()

# Function to generate embeddings
def generate_embedding(text: str) -> list[float]:
    try:
        response = requests.post(OLLAMA_URL, json={"model": EMBEDDING_MODEL, "prompt": text}, timeout=30)
        response.raise_for_status()
        data = response.json()
        # Ollama embeddings API returns a list of floats in 'embedding' key
        return data.get('embedding', [])
    except Exception as e:
        print(f"Ollama embedding generation error: {e}")
        return [] # Return empty list on error

def ollama_word_count(text: str) -> int:
    return len(text.split())


# Function to fetch data from medicalData2
def fetch_medical_data(db_session) -> list[dict]:
    result = db_session.execute(text("SELECT content FROM medicaldata;")).fetchall()
    # Convert RowProxy to dictionary
    print("Success: " ,type(result))
    print(result[:5][0])
    return result

splitter = TextSplitter.from_callback(ollama_word_count, 250) # Split based on ~200 words
# Function to insert data into medicalData2
def insert_chunks(db_session, chunks_with_embeddings):
    # Assuming we are appending new chunks
    insert_statements = []
    for item in chunks_with_embeddings:
        insert_statements.append({
            "content": item["content"],
            "embedding": item["embedding"]
        })
    
    if insert_statements:
        for item in insert_statements:
            db_session.execute(text("INSERT INTO medicalData2 (content, embedding) VALUES (:content, :embedding)"), item)
            print(f"Inserted chunk: {item['content'][:50]}...{item['content'][-50:]}")
        db_session.commit()
# Main processing logic
def process_data():
    db_session = SessionLocal()
    try:
        # Fetch existing data
        existing_data = fetch_medical_data(db_session)
        print(f"Retrieved {len(existing_data)} records from medicalData.")
        # Concatenate text from existing data
        long_text = ""
        for record in existing_data:
            long_text += record[0]+" "
        if long_text:
            print(f"Concatenated text from {len(existing_data)} records: {long_text[:100]}...{long_text[-100:]}")
            # with open("concatenated_text.txt", "w", encoding="utf-8") as f:
            #     f.write(long_text)
        if not long_text.strip():
            print("No text found in medicalData to process.")
            return
        # Split the text into chunks
        chunks = splitter.chunks(long_text)

        # Generate embeddings and prepare for insertion
        chunks_with_embeddings = []
        for chunk_text in chunks:
            embedding = generate_embedding(chunk_text)
            print(f"Embedding generated for chunk: {len(chunks_with_embeddings) + 1}")
            # if embedding: # Only add if embedding was successfully generated
            #     chunks_with_embeddings.append({
            #         "content": chunk_text,
            #         "embedding": embedding
            #     })
            
            #### Testing
            if embedding:
                db_session.execute(text("INSERT INTO medicaldata2 (content, embedding) VALUES (:content, :embedding)"), {"content": chunk_text, "embedding": embedding})
                print(f"Inserted chunk: {chunk_text[:50]}...{chunk_text[-50:]}")
        
        db_session.commit()
        print(f"Generated embeddings for {len(chunks_with_embeddings)} chunks.")
        # print(chunks_with_embeddings[:5])
        # Insert new chunks and embeddings
        # if chunks_with_embeddings:
        #     insert_chunks(db_session, chunks_with_embeddings)
        #     print(f"Successfully processed and inserted {len(chunks_with_embeddings)} chunks.")
        # else:
        #     print("No embeddings generated or no chunks to insert.")

    except Exception as e:
        db_session.rollback()
        print(f"An error occurred during data processing: {e}")
    finally:
        db_session.close()

if __name__ == "__main__":
    process_data()
    print("Data processing completed.")
