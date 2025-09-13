import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for all endpoints to work with Next.js frontend
CORS(app, resources={
    r"/chat": {"origins": "*"},
    r"/languages": {"origins": "*"}, 
    r"/health": {"origins": "*"}
})
# Allow requests from the HTML file's origin (null for local files)
CORS(app, resources={r"/chat": {"origins": "*"}})

# --- Gemini API Configuration ---
try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in .env file or environment variables.")
    genai.configure(api_key=gemini_api_key)
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    # Exit if the API key is not configured, as the app cannot function.
    exit()

# --- Dynamic System Prompt Function ---
def create_system_prompt(selected_language="English"):
    """
    Creates a dynamic system prompt based on selected language.
    """
    return f"""You are "Spark AI", a friendly and knowledgeable virtual assistant.
Your sole purpose is to provide clear, accurate, and helpful information about waterborne diseases.
You must strictly stay on the topic of waterborne diseases, their causes, symptoms, prevention, and treatment.
If a user asks a question unrelated to this topic, you must politely decline and guide them back to the topic by saying: "My expertise is focused on waterborne diseases. How can I help you with that topic?"
Provide answers in a concise and easy-to-understand manner. Use lists when explaining steps for prevention or symptoms.
Do not engage in casual conversation outside of your designated topic.
IMPORTANT: You MUST respond ONLY in the selected language: {selected_language}. Every part of your response, including any refusal to answer an off-topic question, must be in {selected_language}."""

# --- Supported Indian Languages ---
SUPPORTED_LANGUAGES = {
    'hi': 'Hindi (हिंदी)',
    'bn': 'Bengali (বাংলা)',
    'te': 'Telugu (తెలుగు)',
    'mr': 'Marathi (मराठी)',
    'ta': 'Tamil (தமிழ்)',
    'gu': 'Gujarati (ગુજરાતી)',
    'ur': 'Urdu (اردو)',
    'kn': 'Kannada (ಕನ್ನಡ)',
    'or': 'Odia (ଓଡ଼ିଆ)',
    'ml': 'Malayalam (മലയാളം)',
    'pa': 'Punjabi (ਪੰਜਾਬੀ)',
    'as': 'Assamese (অসমীয়া)',
    'sa': 'Sanskrit (संस्कृत)',
    'sd': 'Sindhi (سندھی)',
    'ne': 'Nepali (नेपाली)',
    'kok': 'Konkani (कोंकणी)',
    'mni': 'Manipuri (মৈতৈলোন্)',
    'brx': 'Bodo (बर\')',
    'sat': 'Santhali (ᱥᱟᱱᱛᱟᱲᱤ)',
    'mai': 'Maithili (मैथिली)',
    'doi': 'Dogri (डोगरी)',
    'ks': 'Kashmiri (कॉशुर)',
    'en': 'English'
}

@app.route('/chat', methods=['POST'])
def chat():
    """
    Handles chat requests from the frontend with language selection support.
    """
    data = request.json
    user_message = data.get('message')
    selected_language = data.get('language', 'English')  # Default to English
    history_raw = data.get('history', [])

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Create system prompt with selected language
        system_prompt = create_system_prompt(selected_language)
        
        # Initialize model with dynamic system prompt
        model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            system_instruction=system_prompt
        )
        
        # Start chat session with history
        chat_session = model.start_chat(history=history_raw)

        # Send the user's message to the model
        response = chat_session.send_message(user_message)

        # Get updated history
        updated_history = chat_session.history

        # Convert the history to a JSON-serializable format for the frontend
        serializable_history = [
            {"role": msg.role, "parts": [part.text for part in msg.parts]}
            for msg in updated_history
        ]

        return jsonify({
            "response": response.text,
            "history": serializable_history,
            "selected_language": selected_language
        })

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "Failed to get response from Gemini API"}), 500

@app.route('/languages', methods=['GET'])
def get_supported_languages():
    """
    Returns the list of supported Indian languages.
    """
    return jsonify({
        "supported_languages": SUPPORTED_LANGUAGES,
        "total_languages": len(SUPPORTED_LANGUAGES),
        "message": "Spark AI supports all major Indian languages plus English"
    })

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for Docker and monitoring.
    """
    return jsonify({
        "status": "healthy", 
        "service": "Spark AI Chatbot",
        "features": {
            "multilingual_support": True,
            "language_selection": True,
            "supported_languages_count": len(SUPPORTED_LANGUAGES),
            "focus": "Waterborne diseases information"
        }
    }), 200

if __name__ == '__main__':
    # Get port from environment variable for deployment platforms
    port = int(os.environ.get('PORT', 5000))
    # Disable debug in production
    debug_mode = os.environ.get('FLASK_ENV', 'production') == 'development'
    # Runs the Flask server
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
