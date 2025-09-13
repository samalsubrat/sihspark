# 🚀 Render Deployment Guide

## Prerequisites
1. Your code is in a GitHub repository
2. Your chatbot code is in a folder (e.g., `geminichatbot/`)
3. You have a Gemini API key

## Step-by-Step Deployment

### 1. **Prepare Your Repository**

Make sure your folder structure looks like this:
```
your-repository/
├── geminichatbot/           # Your Flask app folder
│   ├── app.py              ✅ Main Flask application
│   ├── requirements.txt    ✅ Python dependencies
│   ├── Procfile           ✅ Render process file
│   ├── build.sh           ✅ Build script
│   ├── runtime.txt        ✅ Python version
│   ├── .env               ⚠️  DO NOT commit this
│   └── README.md          ✅ Documentation
└── other-folders/          # Other projects
```

### 2. **Sign up on Render**
- Go to [render.com](https://render.com)
- Sign up with your GitHub account
- Connect your GitHub repository

### 3. **Create a New Web Service**

1. **Click "New +"** → **"Web Service"**

2. **Connect Repository:**
   - Select your GitHub repository
   - Choose the repository containing your chatbot

3. **Configure Service:**
   ```
   Name: spark-ai-chatbot
   Environment: Python 3
   Region: Choose closest to your users
   Branch: main (or your default branch)
   ```

4. **Important Settings:**
   ```
   Root Directory: geminichatbot
   Build Command: chmod +x build.sh && ./build.sh
   Start Command: gunicorn app:app
   ```

   **Alternative if above doesn't work:**
   ```
   Root Directory: geminichatbot
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app --host 0.0.0.0 --port $PORT
   ```

### 4. **Environment Variables**
In Render dashboard, add these environment variables:

```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
FLASK_ENV=production
PORT=10000
PYTHON_VERSION=3.11.0
```

**⚠️ IMPORTANT:** 
- Never commit your `.env` file with real API keys
- Add `.env` to your `.gitignore` file
- Set the `GEMINI_API_KEY` in Render's environment variables

### 5. **Deploy**
- Click **"Create Web Service"**
- Render will automatically build and deploy your app
- Wait for the build to complete (usually 2-5 minutes)

### 6. **Your API Endpoints**
Once deployed, your API will be available at:
```
https://your-service-name.onrender.com/health
https://your-service-name.onrender.com/languages  
https://your-service-name.onrender.com/chat
```

## 🔧 **Troubleshooting**

### Common Issues:

1. **Build Fails - "No module named 'app'"**
   - Make sure `Root Directory` is set to `geminichatbot`
   - Verify `app.py` is in the correct folder

2. **Build Fails - "Requirements not found"**
   - Ensure `requirements.txt` is in the `geminichatbot` folder
   - Check the `Root Directory` setting

3. **App Crashes - "GEMINI_API_KEY not found"**
   - Add `GEMINI_API_KEY` to Render environment variables
   - Don't include quotes around the API key

4. **Port Issues**
   - Render automatically sets the `PORT` environment variable
   - Our app reads from `os.environ.get('PORT', 5000)`

### Check Logs:
- Go to your service dashboard on Render
- Click on "Logs" to see build and runtime logs
- Look for error messages and fix accordingly

## 🌍 **Testing Your Deployed API**

### Health Check:
```bash
curl https://your-service-name.onrender.com/health
```

### Chat Test:
```bash
curl -X POST https://your-service-name.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is cholera?",
    "language": "English"
  }'
```

### Hindi Test:
```bash
curl -X POST https://your-service-name.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "हैजा क्या है?",
    "language": "Hindi (हिंदी)"
  }'
```

## 🔒 **Security Best Practices**

1. **Never commit API keys**
   ```bash
   # Add to .gitignore
   .env
   *.env
   .env.local
   .env.production
   ```

2. **Use environment variables**
   - Set `GEMINI_API_KEY` in Render dashboard
   - Use `os.environ.get()` in your code

3. **Enable CORS properly**
   - Current setting allows all origins (`*`)
   - For production, specify your frontend domain:
   ```python
   CORS(app, resources={
       r"/chat": {"origins": ["https://your-frontend-domain.com"]},
       r"/languages": {"origins": ["https://your-frontend-domain.com"]}, 
       r"/health": {"origins": ["https://your-frontend-domain.com"]}
   })
   ```

## 📈 **Scaling & Performance**

- **Free Tier**: Your app will sleep after 15 minutes of inactivity
- **Paid Plans**: Always-on, better performance, custom domains
- **Auto-scaling**: Render automatically handles traffic spikes

## 🚀 **Next.js Integration**

Update your Next.js environment variables:
```bash
# .env.local in your Next.js project
NEXT_PUBLIC_CHATBOT_API_URL=https://your-service-name.onrender.com
```

Then use in your components:
```javascript
const API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL;
const response = await fetch(`${API_URL}/chat`, { ... });
```

## 🎉 **Success!**

Your multilingual waterborne disease chatbot API is now deployed and ready to serve users worldwide!

**Live API Endpoints:**
- Health: `https://your-service-name.onrender.com/health`
- Languages: `https://your-service-name.onrender.com/languages`
- Chat: `https://your-service-name.onrender.com/chat`

---

**Need Help?**
- Check Render's documentation: [docs.render.com](https://docs.render.com)
- Review the logs in your Render dashboard
- Ensure all environment variables are set correctly
