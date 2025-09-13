import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
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

LANGUAGE SUPPORT:
You can communicate in the following Indian languages:
- Hindi (हिंदी)
- Bengali (বাংলা) 
- Telugu (తెలుగు)
- Marathi (मराठी)
- Tamil (தமிழ்)
- Gujarati (ગુજરાતી)
- Urdu (اردو)
- Kannada (ಕನ್ನಡ)
- Odia (ଓଡ଼ିଆ)
- Malayalam (മലയാളം)
- Punjabi (ਪੰਜਾਬੀ)
- Assamese (অসমীয়া)
- Sanskrit (संस्कृत)
- Sindhi (سندھی)
- Nepali (नेपाली)
- Konkani (कोंकणी)
- Manipuri (মৈতৈলোন্)
- Bodo (बर')
- Santhali (ᱥᱟᱱᱛᱟᱲᱤ)
- Maithili (मैथिली)
- Dogri (डोगरी)
- Kashmiri (कॉशुर)
- English

CRITICAL LANGUAGE IDENTIFICATION RULES:
1. NEVER confuse languages or identify them incorrectly
2. If you see Devanagari script (मुझे, आपको, बुखार, etc.), it is HINDI - respond in HINDI
3. Do NOT say "यह ओडिया भाषा में लिखा है" for Hindi text
4. Be 100% accurate in language detection
5. When in doubt, assume Hindi for Devanagari script

RESPONSE GUIDELINES:
1. CRITICALLY IMPORTANT: ALWAYS respond in the EXACT SAME LANGUAGE as the user's input
2. If user writes "Mujhe bukhar hai" (Roman Hindi), respond in Hindi: "आपको बुखार है..."
3. If user writes in Hinglish, respond in Hindi or Hinglish style
4. If user writes in Bengali script, respond in Bengali script
5. If user writes in English, respond in English
6. NEVER default to English unless user specifically used English
7. You must strictly stay on the topic of waterborne diseases, their causes, symptoms, prevention, and treatment
8. If a user asks a question unrelated to this topic, politely decline in their language and guide them back to the topic
9. Provide answers in a concise and easy-to-understand manner in the user's language
10. Use lists when explaining steps for prevention or symptoms

LANGUAGE MATCHING EXAMPLES:
- User: "Mujhe bukhar hai" → Respond: "आपको बुखार है। यह जल-जनित रोगों का लक्षण हो सकता है..."
- User: "What is cholera?" → Respond: "Cholera is a waterborne disease..."
- User: "কলেরা কি?" → Respond: "কলেরা একটি জলবাহিত রোগ..."
- User: "मुझे डायरिया हो रहा है" → Respond: "आपको डायरिया हो रहा है। यह जल-जनित संक्रमण का संकेत..."

REDIRECTION EXAMPLES:
- English: "My expertise is focused on waterborne diseases. How can I help you with that topic?"
- Hindi: "मेरी विशेषज्ञता जल-जनित रोगों पर केंद्रित है। मैं इस विषय में आपकी कैसे सहायता कर सकता हूँ?"
- Bengali: "আমার দক্ষতা জল-বাহিত রোগের উপর কেন্দ্রীভূত। এই বিষয়ে আমি কীভাবে আপনাকে সাহায্য করতে পারি?"
"""

# --- Chat Model Initialization ---
# We initialize the model with the system prompt to set its persona.
model = genai.GenerativeModel(
    model_name='gemini-1.5-flash',
    system_instruction=SYSTEM_PROMPT
)

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

def detect_language_hint(text):
    """
    Enhanced language detection for better Hindi/Hinglish support.
    Returns a hint for the AI about the likely language.
    """
    text_lower = text.lower()
    
    # Check for Roman Hindi/Hinglish words first
    hindi_roman_words = [
        'mujhe', 'mera', 'tera', 'uska', 'hai', 'hoon', 'hain', 'kya', 'kaise', 'kahan', 
        'kyun', 'kaun', 'kab', 'kitna', 'bahut', 'thoda', 'acha', 'bura', 'paani', 
        'bukhar', 'diarrhea', 'pet', 'sir', 'dard', 'bimar', 'dawai', 'doctor',
        'cholera', 'typhoid', 'hepatitis', 'jaundice', 'vomiting', 'nausea',
        'maine', 'humne', 'tumne', 'usne', 'karna', 'hona', 'jana', 'aana',
        'ghar', 'hospital', 'clinic', 'medicine', 'treatment', 'illness'
    ]
    
    # Check if text contains Roman Hindi words
    if any(word in text_lower for word in hindi_roman_words):
        return "User is asking in Roman Hindi (Hinglish). RESPOND IN HINDI SCRIPT."
    
    # Check for Devanagari script - Most common for Hindi
    if any('\u0900' <= char <= '\u097F' for char in text):
        return "User is asking in HINDI language using Devanagari script. RESPOND IN HINDI ONLY."
    
    # Check for Bengali script
    elif any('\u0980' <= char <= '\u09FF' for char in text):
        return "User is asking in Bengali. RESPOND IN BENGALI SCRIPT."
    
    # Check for Telugu script
    elif any('\u0C00' <= char <= '\u0C7F' for char in text):
        return "User is asking in Telugu. RESPOND IN TELUGU SCRIPT."
    
    # Check for Tamil script
    elif any('\u0B80' <= char <= '\u0BFF' for char in text):
        return "User is asking in Tamil. RESPOND IN TAMIL SCRIPT."
    
    # Check for Gujarati script
    elif any('\u0A80' <= char <= '\u0AFF' for char in text):
        return "User is asking in Gujarati. RESPOND IN GUJARATI SCRIPT."
    
    # Check for Kannada script
    elif any('\u0C80' <= char <= '\u0CFF' for char in text):
        return "User is asking in Kannada. RESPOND IN KANNADA SCRIPT."
    
    # Check for Malayalam script
    elif any('\u0D00' <= char <= '\u0D7F' for char in text):
        return "User is asking in Malayalam. RESPOND IN MALAYALAM SCRIPT."
    
    # Check for Odia script
    elif any('\u0B00' <= char <= '\u0B7F' for char in text):
        return "User is asking in Odia. RESPOND IN ODIA SCRIPT."
    
    # Check for Punjabi script (Gurmukhi)
    elif any('\u0A00' <= char <= '\u0A7F' for char in text):
        return "User is asking in Punjabi. RESPOND IN PUNJABI SCRIPT."
    
    # Check for Urdu/Arabic script
    elif any('\u0600' <= char <= '\u06FF' for char in text):
        return "User is asking in Urdu. RESPOND IN URDU SCRIPT."
    
    # Default to English - but check for common English words to be sure
    else:
        english_words = ['what', 'how', 'when', 'where', 'why', 'who', 'is', 'are', 'the', 'and', 'or']
        if any(word in text_lower for word in english_words):
            return "User is asking in English. RESPOND IN ENGLISH."
        else:
            # Might be Roman Hindi if no English indicators
            return "User might be using Roman Hindi. RESPOND IN HINDI SCRIPT IF HEALTH-RELATED."

@app.route('/chat', methods=['POST'])
def chat():
    """
    Handles chat requests from the frontend with multilingual support.
    """
    data = request.json
    user_message = data.get('message')
    history_raw = data.get('history', [])

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Detect the language of the user's message
        language_hint = detect_language_hint(user_message)
        
        # Create an enhanced message with strong language matching instructions
        enhanced_message = f"""
CRITICAL INSTRUCTION: {language_hint}

Original User Message: {user_message}

MANDATORY RESPONSE RULES:
1. You MUST respond in the EXACT same language as the user's message
2. If user wrote "Mujhe bukhar hai" (Roman Hindi), you MUST respond in Hindi script (Devanagari)
3. DO NOT respond in English unless the user specifically wrote in English
4. Match the user's language style (formal/informal, script type)

Now answer the user's question about their health concern, focusing on waterborne diseases if relevant. If it's related to fever, diarrhea, stomach issues, or other symptoms, explain possible waterborne disease connections.
"""

        # Reconstruct the chat history in the format the API expects
        # The history alternates between 'user' and 'model' roles.
        chat_session = model.start_chat(history=history_raw)

        # Send the enhanced message to the model
        response = chat_session.send_message(enhanced_message)

        # The chat_session.history now includes the latest user message and the model's response
        updated_history = chat_session.history

        # Convert the history to a JSON-serializable format for the frontend
        # Only store the original user message in history, not the enhanced version
        serializable_history = []
        for msg in updated_history:
            if msg.role == 'user':
                # Store only the original user message, not the enhanced prompt
                serializable_history.append({
                    "role": msg.role, 
                    "parts": [user_message]
                })
            else:
                serializable_history.append({
                    "role": msg.role, 
                    "parts": [part.text for part in msg.parts]
                })

        return jsonify({
            "response": response.text,
            "history": serializable_history,
            "detected_language": language_hint
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
            "supported_languages_count": len(SUPPORTED_LANGUAGES),
            "focus": "Waterborne diseases information"
        }
    }), 200

if __name__ == '__main__':
    # Runs the Flask server
    app.run(host='0.0.0.0', port=5000, debug=True)