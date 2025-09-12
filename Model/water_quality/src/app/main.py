# src/app/main.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import os

# Path to the model relative to this file
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../models/model.pkl")

app = FastAPI()

# Load model (and optionally scaler)
with open(MODEL_PATH, "rb") as f:
    data = joblib.load(f)

# Check if data is a dict with model & scaler
if isinstance(data, dict) and "model" in data and "scaler" in data:
    model = data["model"]
    scaler = data["scaler"]
else:
    model = data
    scaler = None  # no scaler saved

# Pydantic model with 10 features
class SampleInput(BaseModel):
    ph: float
    Hardness: float
    Solids: float
    Chloramines: float
    Sulfate: float
    Conductivity: float
    Organic_carbon: float
    Trihalomethanes: float
    Turbidity: float
    Temperature: float

features = [
    "ph","Hardness","Solids","Chloramines","Sulfate",
    "Conductivity","Organic_carbon","Trihalomethanes","Turbidity",
    "Temperature"
]
@app.post("/predict")
def predict(input: SampleInput):
    try:
        # Prepare input array
        x = np.array([[getattr(input, f) for f in features]])

        # Apply scaler if available
        if scaler is not None:
            x = scaler.transform(x)

        # Predict
        pred = model.predict(x)[0]
        return {"prediction": int(pred)}

    except Exception as e:
        # Return error message instead of 500
        return {"error": str(e)}

