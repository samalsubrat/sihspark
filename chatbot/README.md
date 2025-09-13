# Spark AI Chatbot 🤖🇮🇳

A Flask-based multilingual chatbot powered by Google's Gemini AI, specialized in waterborne diseases information with support for all major Indian languages.

## Features

- 🧠 **AI-Powered**: Uses Google Gemini 1.5 Flash model
- 🌍 **Multilingual**: Supports 23 Indian languages + English
- 🎯 **Specialized**: Focused on waterborne diseases information
- 💬 **Chat History**: Maintains conversation context
- 🔍 **Language Detection**: Automatically detects user's language
- 🌐 **CORS Enabled**: Can be called from web browsers
- 🐳 **Docker Ready**: Easy deployment with Docker
- 🏥 **Health Checks**: Built-in health monitoring

## Supported Languages 🗣️

### Indian Languages:
- **Hindi** (हिंदी)
- **Bengali** (বাংলা)
- **Telugu** (తెలుగు)
- **Marathi** (मराठी)
- **Tamil** (தமிழ்)
- **Gujarati** (ગુજરાતી)
- **Urdu** (اردو)
- **Kannada** (ಕನ್ನಡ)
- **Odia** (ଓଡ଼ିଆ)
- **Malayalam** (മലയാളം)
- **Punjabi** (ਪੰਜਾਬੀ)
- **Assamese** (অসমীয়া)
- **Sanskrit** (संस्कृत)
- **Sindhi** (سندھی)
- **Nepali** (नेपाली)
- **Konkani** (कोंकणी)
- **Manipuri** (মৈতৈলোন্)
- **Bodo** (बर')
- **Santhali** (ᱥᱟᱱᱛᱟᱲᱤ)
- **Maithili** (मैथिली)
- **Dogri** (डोगरी)
- **Kashmiri** (कॉशुर)
- **English**

## Quick Start

### Local Development

1. **Clone and Navigate**
   ```bash
   cd geminichatbot
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up Environment**
   - Copy `.env.example` to `.env` (if available)
   - Add your Gemini API key to `.env`:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. **Run the Application**
   ```bash
   python app.py
   ```

5. **Access the API**
   - API: http://localhost:5000
   - Health Check: http://localhost:5000/health

### Docker Deployment

#### Using Docker

1. **Build the Image**
   ```bash
   docker build -t spark-ai-chatbot .
   ```

2. **Run the Container**
   ```bash
   docker run -p 5000:5000 --env-file .env spark-ai-chatbot
   ```

#### Using Docker Compose

1. **Start the Service**
   ```bash
   docker-compose up -d
   ```

2. **Check Status**
   ```bash
   docker-compose ps
   ```

3. **View Logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop the Service**
   ```bash
   docker-compose down
   ```

## API Usage

### Chat Endpoint

**POST** `/chat`

**Request Body:**
```json
{
  "message": "What are waterborne diseases?",
  "history": []
}
```

**Example in Hindi:**
```json
{
  "message": "जल-जनित रोग क्या हैं?",
  "history": []
}
```

**Response:**
```json
{
  "response": "Waterborne diseases are illnesses caused by pathogenic microorganisms...",
  "history": [
    {
      "role": "user",
      "parts": ["What are waterborne diseases?"]
    },
    {
      "role": "model", 
      "parts": ["Waterborne diseases are illnesses caused by pathogenic microorganisms..."]
    }
  ],
  "detected_language": "User is asking in English."
}
```

**Response in Hindi:**
```json
{
  "response": "जल-जनित रोग वे बीमारियां हैं जो रोगजनक सूक्ष्मजीवों के कारण होती हैं...",
  "history": [...],
  "detected_language": "User is asking in a Devanagari script language (Hindi/Marathi/Sanskrit/Nepali)."
}
```

### Languages Endpoint

**GET** `/languages`

**Response:**
```json
{
  "supported_languages": {
    "hi": "Hindi (हिंदी)",
    "bn": "Bengali (বাংলা)",
    "te": "Telugu (తెలుగు)",
    "mr": "Marathi (मराठी)",
    "ta": "Tamil (தமிழ்)",
    "gu": "Gujarati (ગુજરાતી)",
    "ur": "Urdu (اردو)",
    "kn": "Kannada (ಕನ್ನಡ)",
    "or": "Odia (ଓଡ଼ିଆ)",
    "ml": "Malayalam (മലയാളം)",
    "pa": "Punjabi (ਪੰਜਾਬੀ)",
    "as": "Assamese (অসমীয়া)",
    "sa": "Sanskrit (संस्कृत)",
    "sd": "Sindhi (سندھی)",
    "ne": "Nepali (नेपाली)",
    "kok": "Konkani (कोंकणी)",
    "mni": "Manipuri (মৈতৈলোন্)",
    "brx": "Bodo (बर')",
    "sat": "Santhali (ᱥᱟᱱᱛᱟᱲᱤ)",
    "mai": "Maithili (मैथिली)",
    "doi": "Dogri (डोगरी)",
    "ks": "Kashmiri (कॉशुर)",
    "en": "English"
  },
  "total_languages": 23,
  "message": "Spark AI supports all major Indian languages plus English"
}
```

### Health Check Endpoint

**GET** `/health`

**Response:**
```json
{
  "status": "healthy",
  "service": "Spark AI Chatbot",
  "features": {
    "multilingual_support": true,
    "supported_languages_count": 23,
    "focus": "Waterborne diseases information"
  }
}
```

## Testing with curl

### English Example:
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What causes cholera?"}'
```

### Hindi Example:
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "हैजा के कारण क्या हैं?"}'
```

### Bengali Example:
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "কলেরার কারণ কী?"}'
```

### Check Supported Languages:
```bash
curl -X GET http://localhost:5000/languages
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |
| `FLASK_ENV` | Flask environment (development/production) | No |

## Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

## Project Structure

```
geminichatbot/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
├── .dockerignore         # Docker ignore file
├── .env                  # Environment variables
└── README.md            # This file
```

## Production Deployment

For production deployment, consider:

1. **Use a reverse proxy** (nginx, traefik)
2. **Set up SSL/TLS** certificates
3. **Configure logging** and monitoring
4. **Set resource limits** in Docker
5. **Use secrets management** for API keys

## Troubleshooting

### Common Issues

1. **Missing API Key**
   - Ensure `GEMINI_API_KEY` is set in `.env`
   - Verify the API key is valid

2. **Port Already in Use**
   - Change the port in `app.py` or Docker configuration
   - Kill existing processes using the port

3. **Docker Build Fails**
   - Check Docker is running
   - Ensure `.env` file exists

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
