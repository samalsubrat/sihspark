# src/app.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import os

# -------------------------
# Load trained model + encoder
# -------------------------
model_path = os.path.join(os.path.dirname(__file__), "..", "models", "disease_model.pkl")
encoder_path = os.path.join(os.path.dirname(__file__), "..", "models", "label_encoder.pkl")

model = joblib.load(model_path)
label_encoder = joblib.load(encoder_path)

# -------------------------
# FastAPI App
# -------------------------
app = FastAPI(title="💧 Waterborne Disease Predictor API")

# Input data model
class PatientSymptoms(BaseModel):
    Diarrhea: int = 0
    Dehydration: int = 0
    Abdominal_Pain: int = 0
    Watery_Diarrhea: int = 0
    Vomiting: int = 0
    Fatigue: int = 0
    Nausea: int = 0
    Fever: int = 0
    Jaundice: int = 0
    Loss_of_Appetite: int = 0
    Headache: int = 0
    Muscle_Pain: int = 0


@app.get("/")
def home():
    return {"message": "🌍 Waterborne Disease Predictor API is running!"}


@app.post("/predict")
def predict_disease(symptoms: PatientSymptoms):
    # Convert input to DataFrame
    input_data = pd.DataFrame([symptoms.dict()])

    # Predict class
    pred_class = model.predict(input_data)[0]
    pred_disease = label_encoder.inverse_transform([pred_class])[0]

    return {"predicted_disease": pred_disease}
