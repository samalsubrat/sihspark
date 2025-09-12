# Ollama API Wrapper for RAG

This project provides an API wrapper for using Ollama with a Retrieval-Augmented Generation (RAG) approach, specifically tailored for medical assistance.

## API Endpoints

### Configuration Endpoints

*   **/api/config/get** (GET)
    *   **Description:** Retrieves the current application configuration.
    *   **Response:** JSON object containing configuration parameters.

*   **/api/config/set** (POST)
    *   **Description:** Updates the application configuration.
    *   **Request Body:** JSON object with the following optional parameters:
        *   `db_user`: Database username.
        *   `db_password`: Database password.
        *   `db_host`: Database host.
        *   `db_port`: Database port.
        *   `db_name`: Database name.
        *   `ollama_url`: URL of the Ollama instance.
        *   `ollama_model`: Name of the Ollama model to use for generation.
        *   `embedding_model`: Name of the Ollama model to use for embeddings.
    *   **Response:** JSON object with a success message or error.

### Data Management Endpoints

*   **/api/add_data** (POST)
    *   **Description:** Processes text data, generates embeddings, and stores them in the database.
    *   **Request Body:** JSON object with a `data` field containing the text to be processed.
    *   **Process:**
        1.  The input text is split into chunks using `RecursiveCharacterTextSplitter`.
        2.  For each chunk, embeddings are generated using the configured embedding model via the Ollama API.
        3.  The content and its corresponding embedding are inserted into the `medicalData` table.
    *   **Response:** JSON object indicating the number of chunks inserted or an error message.

### Generation Endpoint

*   **/api/generate_response** (POST)
    *   **Description:** Receives a user query, retrieves relevant medical data, and generates a response using the configured Ollama model.
    *   **Request Body:** JSON object with the following fields:
        *   `query`: The user's medical query.
        *   `info`: Additional contextual information (e.g., user profile, regional data).
    *   **Process:**
        1.  The `query_and_embed` function is called to retrieve relevant medical data based on the user's query.
        2.  A prompt is constructed including the system prompt, retrieved context, additional information, and the user's query.
        3.  The configured Ollama model is called to generate a response.
    *   **Response:** JSON object containing the generated `response` or an error message.

## System Prompt

The chatbot operates with the following system prompt:
```
You are Spark AI, an advanced medical assistant chatbot.  
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
