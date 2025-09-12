import argparse
import os
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report

# -----------------------------
# Simulate disease risk labels
# -----------------------------
def simulate_risk_labels(df: pd.DataFrame) -> pd.Series:
    """
    Simulate disease risk labels from water quality features.
    """
    sc = df.mean(axis=1, skipna=True)
    sc = (sc - sc.min()) / (sc.max() - sc.min() + 1e-9)
    labels = pd.cut(sc, bins=[-1, 0.33, 0.66, 1.0], labels=[0, 1, 2])
    return labels.astype(int)

def main(args):
    print(f"Loading data from {args.data}...")
    df = pd.read_csv(args.data)

    # Drop rows with all NaNs
    df = df.dropna(how="all")

    # Define the exact features expected by the API (training order must match serving)
    feature_cols = [
        "ph",
        "Hardness",
        "Solids",
        "Chloramines",
        "Sulfate",
        "Conductivity",
        "Organic_carbon",
        "Trihalomethanes",
        "Turbidity",
    ]

    # Ensure required columns exist
    missing = [c for c in feature_cols if c not in df.columns]
    if missing:
        raise ValueError(f"Input CSV missing required columns: {missing}")

    # Simulate disease risk labels strictly from these features
    df["disease_risk"] = simulate_risk_labels(df[feature_cols])

    # Features and target
    X = df[feature_cols].copy()
    y = df["disease_risk"].copy()

    # Fill remaining NaNs in features with column means (training-time imputation)
    X = X.fillna(X.mean(numeric_only=True))

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Build a single pipeline to keep preprocessing aligned between train and serve
    pipeline = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            ("clf", XGBClassifier(
                n_estimators=200,
                learning_rate=0.1,
                max_depth=5,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42,
                n_jobs=-1,
                objective="multi:softprob",  # ensures predict_proba behaves as expected
                num_class=3
            )),
        ]
    )

    # Fit
    pipeline.fit(X_train, y_train)

    # Evaluate
    preds = pipeline.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"✅ Accuracy: {acc:.4f}")
    print("Classification Report:\n", classification_report(y_test, preds))

    # Persist the single pipeline (contains both scaler and model)
    out_dir = os.path.dirname(args.out)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    joblib.dump(pipeline, args.out)
    print(f"Pipeline saved to {args.out}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=str, required=True, help="Path to CSV dataset")
    parser.add_argument("--out", type=str, required=True, help="Path to save model.pkl (pipeline)")
    args = parser.parse_args()
    main(args)
