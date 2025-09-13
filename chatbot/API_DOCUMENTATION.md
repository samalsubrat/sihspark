# Spark AI Chatbot API Documentation 🚀

## Base URL
```
http://localhost:5000
```

## Endpoints

### 1. 💬 Chat Endpoint
**POST** `/chat`

Send a message to the AI chatbot with language selection.

#### Request Body:
```json
{
  "message": "string (required)",
  "language": "string (optional, default: 'English')",
  "history": "array (optional, default: [])"
}
```

#### Example Request:
```javascript
// Next.js fetch example
const response = await fetch('http://localhost:5000/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: "मुझे बुखार है",
    language: "Hindi (हिंदी)",
    history: []
  })
});

const data = await response.json();
```

#### Response:
```json
{
  "response": "आपको बुखार है। यह जल-जनित रोगों का लक्षण हो सकता है...",
  "history": [
    {
      "role": "user",
      "parts": ["मुझे बुखार है"]
    },
    {
      "role": "model",
      "parts": ["आपको बुखार है। यह जल-जनित रोगों का लक्षण हो सकता है..."]
    }
  ],
  "selected_language": "Hindi (हिंदी)"
}
```

### 2. 🌍 Languages Endpoint
**GET** `/languages`

Get list of all supported languages.

#### Example Request:
```javascript
const response = await fetch('http://localhost:5000/languages');
const data = await response.json();
```

#### Response:
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
    "brx": "Bodo (बর')",
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

### 3. 🏥 Health Check Endpoint
**GET** `/health`

Check API health and features.

#### Example Request:
```javascript
const response = await fetch('http://localhost:5000/health');
const data = await response.json();
```

#### Response:
```json
{
  "status": "healthy",
  "service": "Spark AI Chatbot",
  "features": {
    "multilingual_support": true,
    "language_selection": true,
    "supported_languages_count": 23,
    "focus": "Waterborne diseases information"
  }
}
```

## Next.js Integration Examples

### 1. Basic Chat Component
```javascript
import { useState } from 'react';

export default function ChatComponent() {
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('English');
  const [history, setHistory] = useState([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          language,
          history
        })
      });
      
      const data = await res.json();
      setResponse(data.response);
      setHistory(data.history);
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="English">English</option>
        <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
        <option value="Bengali (বাংলা)">Bengali (বাংলা)</option>
        {/* Add more languages */}
      </select>
      
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about waterborne diseases..."
      />
      
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
      
      {response && (
        <div>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
```

### 2. Language Selector Hook
```javascript
import { useState, useEffect } from 'react';

export function useLanguages() {
  const [languages, setLanguages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('http://localhost:5000/languages');
        const data = await response.json();
        setLanguages(data.supported_languages);
      } catch (error) {
        console.error('Error fetching languages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return { languages, loading };
}
```

### 3. API Service
```javascript
class ChatbotAPI {
  constructor(baseURL = 'http://localhost:5000') {
    this.baseURL = baseURL;
  }

  async sendMessage(message, language = 'English', history = []) {
    const response = await fetch(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        language,
        history
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getLanguages() {
    const response = await fetch(`${this.baseURL}/languages`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async healthCheck() {
    const response = await fetch(`${this.baseURL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
}

export default ChatbotAPI;
```

## Error Handling

### Common Error Responses:
```json
// Missing message
{
  "error": "No message provided"
}

// API error
{
  "error": "Failed to get response from Gemini API"
}
```

### Next.js Error Handling:
```javascript
try {
  const response = await fetch('http://localhost:5000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language, history })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
} catch (error) {
  console.error('Chat API error:', error);
  // Handle error in UI
}
```

## Environment Variables for Next.js

Create a `.env.local` file in your Next.js project:
```
NEXT_PUBLIC_CHATBOT_API_URL=http://localhost:5000
```

Then use it in your components:
```javascript
const API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL;
```

## CORS Configuration
The API is configured with CORS to allow requests from any origin (`*`). For production, you should restrict this to your specific domain.

## Notes
- The API supports 23 Indian languages plus English
- All responses are focused on waterborne diseases
- The AI will politely redirect off-topic questions back to waterborne diseases
- Conversation history is maintained for context
- Language selection overrides any automatic detection

Your API is now ready for integration with your Next.js frontend! 🎉
