# TODO List for Ollama API Handler

## Core Setup & Configuration
- [X] **Initialize Flask App**: Refactor the existing Flask app to accommodate new features and improve structure.
- [X] **Install SQLAlchemy and pgvector**: Set up the necessary libraries for PostgreSQL integration.
- [X] **Add Credentials**: Securely manage API keys, database credentials (username, password, host, port, database name), and any other sensitive information. Consider using environment variables or a configuration file.

## API Endpoints
- [X] **Set Parameters API**:
    - Create an API endpoint to dynamically modify database connection details (SQL link, password, username, database name).
    - Create an API endpoint to configure Ollama API settings (model name, custom parameters, prompt type - generate/conversational).
- [X] **Text Processing and Embedding API**:
    - Implement an API endpoint that accepts raw text.
    - Integrate libraries for text chunking.
    - Implement embedding generation for the text chunks.
    - Store the text chunks and their embeddings in PostgreSQL with pgvector enabled.

## Ollama Integration
- [X] **Enhance Ollama API Interaction**:
    - Allow selection of different Ollama models.
    - Support custom parameters for Ollama API calls.
    - Implement logic for both 'generate' and 'conversational' prompt types.

## Suggestions
- [X] **Error Handling and Logging**: Implement robust error handling and logging mechanisms for all API endpoints and external service interactions.
- [X] **Database Schema Management**: If tables are not already present, consider using an ORM or migration tool to manage database schema.
- [ ] **Asynchronous Operations**: For long-running tasks like embedding generation, consider using asynchronous processing to avoid blocking the main Flask application.
- [X] **Testing**: Write unit and integration tests for all implemented features.
- [X] **Configuration Management**: Centralize configuration settings (e.g., using a config file or environment variables) for easier management.
- [X] **Implement query_and_embed function**
- [X] **Implement /api/generate_response endpoint**
