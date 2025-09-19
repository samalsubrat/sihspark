from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np

# Initialize the Flask application 🚀
app = Flask(__name__)

# --- Step 1: Load the Trained Model ---
print("Loading the trained model...")
try:
    model = joblib.load('model/outbreak_predictor.pkl')
    print("Model loaded successfully.")
except FileNotFoundError:
    print("Error: Model file not found. Please run train_model.py first.")
    model = None

# --- Step 2: Define Feature Engineering Function ---
def create_features_for_prediction(data):
    """
    Creates features for the input data for a single prediction.
    'data' is expected to be a dictionary of the latest readings.
    """
    df = pd.DataFrame([data])
    df['cases_7_day_avg'] = data.get('cases_7_day_avg', df['reported_cases'])
    df['rainfall_3_day_sum'] = data.get('rainfall_3_day_sum', df['rainfall_mm'])
    
    features_ordered = [
        'reported_cases', 'turbidity_ntu', 'ph_level', 'rainfall_mm',
        'e_coli_present', 'population_density', 'proximity_to_river',
        'cases_7_day_avg', 'rainfall_3_day_sum', 'cases_7_days_ago'
    ]
    
    for col in features_ordered:
        if col not in df.columns:
            df[col] = 0
    return df[features_ordered]

# --- Step 3: Create Prediction Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded. Cannot make predictions.'}), 500

    try:
        json_data = request.get_json()
        features_df = create_features_for_prediction(json_data)
        prediction_probability = model.predict_proba(features_df)
        outbreak_risk = prediction_probability[0][1]
        
        # Prepare the response WITHOUT village_id
        response = {
            'outbreak_risk_probability': float(outbreak_risk),
            'timestamp': pd.Timestamp.now(tz='Asia/Kolkata').isoformat()
        }
        
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# --- Health Check Endpoint ---
@app.route('/', methods=['GET'])
def health_check():
    return "AI Prediction Server is running!"

# --- Step 4: Run the Flask App ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)