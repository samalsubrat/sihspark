# app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import traceback
import numpy as np
import joblib   # or use pickle
import os

# --- Config ---
MODEL_PATH = "water_quality_model_xgb_classifier.pkl"

# --- App ---
app = FastAPI(title="Model API")

# --- Example input schema ---
# Adjust fields/shape to match your model input.
class PredictRequest(BaseModel):
    # Example: features is a list of numeric features for a single sample
    features: list[float]

class PredictResponse(BaseModel):
    prediction: float
    # include more fields if needed (probabilities, metadata)

# --- Load model once at startup ---
model = None

def load_model(path=MODEL_PATH):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found at {path}")
    # If you used joblib.dump / load
    return joblib.load(path)

@app.on_event("startup")
def startup_event():
    global model
    try:
        model = load_model(MODEL_PATH)
        print("Model loaded successfully.")
    except Exception as e:
        print("Failed to load model:", e)
        # Let server start — but endpoints will return 500 if model missing

# --- Health check ---
@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}

# --- Predict endpoint ---
@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    try:
        # Convert to numpy array and ensure shape (1, n_features)
        features = np.array(req.features, dtype=float)
        if features.ndim == 1:
            features = features.reshape(1, -1)

        # If your model expects a DataFrame, change accordingly
        pred = model.predict(features)

        # If model returns array, extract scalar
        if hasattr(pred, "__len__"):
            pred_value = float(pred[0])
        else:
            pred_value = float(pred)

        return {"prediction": pred_value}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))