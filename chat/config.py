import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv()

class Config:

    #psql here
    DB_USER = os.getenv("DB_USER", "your_db_user")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "your_db_password")
    DB_HOST = os.getenv("DB_HOST", "localhost:5432")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_NAME = os.getenv("DB_NAME", "your_db_name")
    DATABASE_URL = os.getenv("DATABASE_URL", f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}?sslmode=require&channel_binding=require")
    print("DATABASE_URL:", DATABASE_URL)
    #ollama here
    OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen3:0.6b-fp16")
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "mxbai-embed-large:latest")
    MAIN_DATABASE_URL = os.getenv("MAIN_DATABASE_URL")
    print("MAIN_DATABASE_URL:", MAIN_DATABASE_URL)


config = Config()

engine = create_engine(config.DATABASE_URL)
main_engine = create_engine(config.MAIN_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
MainSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=main_engine)

def update_config(new_db_url=None, new_db_user=None, new_db_password=None, new_db_host=None, new_db_port=None, new_db_name=None, new_ollama_url=None, new_ollama_model=None, new_main_database_url=None):

    global config, engine, SessionLocal, main_engine, MainSessionLocal
    # global config
    if new_main_database_url:
        config.MAIN_DATABASE_URL = new_main_database_url
    if new_db_url:
        config.DATABASE_URL = new_db_url
    if new_db_user:
        config.DB_USER = new_db_user
    if new_db_password:
        config.DB_PASSWORD = new_db_password
    if new_db_host:
        config.DB_HOST = new_db_host
    if new_db_port:
        config.DB_PORT = new_db_port
    if new_db_name:
        config.DB_NAME = new_db_name
    if new_ollama_url:
        config.OLLAMA_URL = new_ollama_url
    if new_ollama_model:
        config.OLLAMA_MODEL = new_ollama_model

    # if any params changes this will create a new DATABASE_URL
    if any([new_db_user, new_db_password, new_db_host, new_db_port, new_db_name]):
        config.DATABASE_URL = f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}/{config.DB_NAME}?sslmode=require&channel_binding=require"
    if (new_main_database_url):
        config.MAIN_DATABASE_URL = new_main_database_url
    # Its jjust re-initializing the engine and session factory
    engine = create_engine(config.DATABASE_URL)
    main_engine = create_engine(config.MAIN_DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    MainSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=main_engine)
    print("Configuration updated and database engine re-initialized.")
    print("DATABASE_URL:", config.DATABASE_URL)
    print("Main Database_URL:", config.MAIN_DATABASE_URL)
    print("New OLLAMA_URL:", config.OLLAMA_URL)
    print("New OLLAMA_MODEL:", config.OLLAMA_MODEL)

def get_db():
    """Dependency to get a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
def get_db_main():
    db = MainSessionLocal()
    try:
        yield db
    finally:
        db.close()
