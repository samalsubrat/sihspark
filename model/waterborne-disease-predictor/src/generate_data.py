import pandas as pd
import random
import os

# Define diseases and associated symptoms
diseases = {
    "Acute Diarrheal Disease": ["Diarrhea", "Dehydration", "Abdominal_Pain"],
    "Cholera": ["Watery_Diarrhea", "Vomiting", "Dehydration"],
    "Hepatitis A": ["Fatigue", "Nausea", "Fever", "Jaundice"],
    "Hepatitis E": ["Fever", "Fatigue", "Loss_of_Appetite", "Jaundice"],
    "Leptospirosis": ["Fever", "Headache", "Muscle_Pain", "Vomiting"]
}

# ✅ Collect all unique symptoms
all_symptoms = sorted({s for symptoms in diseases.values() for s in symptoms})

data = []
num_samples = 1000

for _ in range(num_samples):
    # Weighted random disease choice
    disease = random.choices(
        list(diseases.keys()), 
        weights=[100, 5, 20, 10, 15]  # bias: more Acute Diarrheal Disease
    )[0]
    symptoms_for_disease = diseases[disease]

    # Create row with all symptoms = 0
    row = {symptom: 0 for symptom in all_symptoms}

    # Mark disease-related symptoms as 1 (with some randomness for realism)
    for symptom in symptoms_for_disease:
        row[symptom] = random.choice([0, 1])

    # Assign target label
    row["disease_label"] = disease
    data.append(row)

# Create DataFrame
df = pd.DataFrame(data)

# Save dataset
os.makedirs("data", exist_ok=True)
df.to_csv("data/synthetic_data.csv", index=False)
print("✅ Synthetic dataset created at data/synthetic_data.csv")
print("Columns:", df.columns.tolist())
