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
    - Integrate libraries for text chunking (semantic chunking).
    - Implement embedding generation for the text chunks.
    - Store the text chunks and their embeddings in PostgreSQL with pgvector enabled.
- [X] **Response Generation API**
    - Provide the query and user_id in request body as json.
    - Query will be used to retrieve related info from vector database.
    - `user_id` will be used to fetch all user related info from another database.
    - Response will be providing answering the query with being fully context aware.
    - Return the context retrieved from the vector database as well as more closer to the context of the user query.

## Ollama Integration
- [X] **Enhance Ollama API Interaction**:
    - Allow selection of different Ollama models.
    - Support custom parameters for Ollama API calls.
    - Implement logic for both 'generate' and 'conversational' prompt types.

## Micseallenous
- [X] **Error Handling and Logging**: Implement robust error handling and logging mechanisms for all API endpoints and external service interactions.
- [X] **Database Schema Management**: If tables are not already present, consider using an ORM or migration tool to manage database schema.
- [ ] **Asynchronous Operations**: For long-running tasks like embedding generation, consider using asynchronous processing to avoid blocking the main Flask application.
- [X] **Testing**: Write unit and integration tests for all implemented features.
- [X] **Configuration Management**: Centralize configuration settings (e.g., using a config file or environment variables) for easier management.
- [X] **Implement query_and_embed function**
- [X] **Implement /api/generate_response endpoint**
- [X] **Semantic chunking**: Integrate libraries for semantic chunking (e.g., spaCy, Stanford CoreNLP) to improve the quality of generated embeddings.
- [X] **context retrieval**: Implement a mechanism to retrieve the context from the vector database that is closer to the user query.

