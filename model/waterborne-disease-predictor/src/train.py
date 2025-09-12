# src/train.py
import argparse
import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report


def main(args):
    print(f"📂 Loading data from {args.data}...")
    df = pd.read_csv(args.data)
    df = df.dropna(how="all")

    # -------------------------
    # Symptom Features
    # -------------------------
    feature_cols = [
        "Diarrhea", "Dehydration", "Abdominal_Pain", "Watery_Diarrhea",
        "Vomiting", "Fatigue", "Nausea", "Fever", "Jaundice",
        "Loss_of_Appetite", "Headache", "Muscle_Pain"
    ]

    # ✅ Check dataset has all required columns
    missing = [c for c in feature_cols if c not in df.columns]
    if missing:
        raise ValueError(f"❌ Input CSV missing required columns: {missing}")

    if "disease_label" not in df.columns:
        raise ValueError("❌ Dataset must contain a 'disease_label' column.")

    X = df[feature_cols].fillna(0)

    # -------------------------
    # Encode target labels
    # -------------------------
    le = LabelEncoder()
    y = le.fit_transform(df["disease_label"])

    # -------------------------
    # Train-test split
    # -------------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # -------------------------
    # Pipeline with XGBoost
    # -------------------------
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", XGBClassifier(
            n_estimators=200,
            learning_rate=0.1,
            max_depth=5,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            n_jobs=-1,
            objective="multi:softprob"
        ))
    ])

    print("🚀 Training model...")
    pipeline.fit(X_train, y_train)

    # -------------------------
    # Evaluate
    # -------------------------
    preds = pipeline.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"✅ Accuracy: {acc:.4f}")
    print(classification_report(y_test, preds, target_names=le.classes_))

    # -------------------------
    # Save model + encoder
    # -------------------------
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    joblib.dump(pipeline, args.out)

    encoder_path = os.path.join(os.path.dirname(args.out), "label_encoder.pkl")
    joblib.dump(le, encoder_path)

    print(f"💾 Pipeline saved to {args.out}")
    print(f"💾 Label encoder saved to {encoder_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=str, required=True, help="Path to CSV dataset")
    parser.add_argument("--out", type=str, required=True, help="Path to save model.pkl")
    args = parser.parse_args()
    main(args)
