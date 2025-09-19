import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report, make_scorer, recall_score
import joblib
import os

print("🚀 Starting FINAL model training with Hyperparameter Tuning...")

# --- Configuration ---
DATA_FILE = 'data/historical_data.csv'
MODEL_OUTPUT_FILE = 'model/outbreak_predictor.pkl'

# --- 1. Load Data ---
df = pd.read_csv(DATA_FILE, parse_dates=['date'])

# --- 2. Feature Engineering ---
print("Step 2: Performing feature engineering...")
df = df.sort_values(by=['village_id', 'date']).reset_index(drop=True)
df['cases_7_day_avg'] = df.groupby('village_id')['reported_cases'].transform(lambda x: x.rolling(7).mean())
df['rainfall_3_day_sum'] = df.groupby('village_id')['rainfall_mm'].transform(lambda x: x.rolling(3).sum())
df['cases_7_days_ago'] = df.groupby('village_id')['reported_cases'].shift(7)

# --- 3. Create Target Variable ---
df['max_cases_next_7_days'] = df.groupby('village_id')['reported_cases'].transform(lambda x: x.rolling(7).max().shift(-7))
OUTBREAK_THRESHOLD = 15
df['outbreak_in_next_7_days'] = (df['max_cases_next_7_days'] > OUTBREAK_THRESHOLD).astype(int)
df = df.dropna().reset_index(drop=True)

# --- 4. Model Training Setup ---
features = [
    'reported_cases', 'turbidity_ntu', 'ph_level', 'rainfall_mm',
    'e_coli_present', 'population_density', 'proximity_to_river',
    'cases_7_day_avg', 'rainfall_3_day_sum', 'cases_7_days_ago'
]
target = 'outbreak_in_next_7_days'

X = df[features]
y = df[target]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

# --- 5. Hyperparameter Tuning with GridSearchCV ---
print("Step 5: Searching for best hyperparameters to maximize RECALL...")
scale_pos_weight = y_train.value_counts()[0] / y_train.value_counts()[1]

# Define the parameter grid to search
param_grid = {
    'max_depth': [5, 6],
    'n_estimators': [300, 400],
    'learning_rate': [0.05, 0.1],
    'scale_pos_weight': [scale_pos_weight, scale_pos_weight * 1.2] # Try giving even more weight
}

# Define the model and the scorer
xgb_model = xgb.XGBClassifier(objective='binary:logistic', base_score=0.5, subsample=0.8, colsample_bytree=0.8)
recall_scorer = make_scorer(recall_score)

grid_search = GridSearchCV(
    estimator=xgb_model,
    param_grid=param_grid,
    scoring=recall_scorer, # <-- Optimize for recall!
    cv=3, # 3-fold cross-validation
    verbose=1 # Shows progress
)

grid_search.fit(X_train, y_train)
print("Best parameters found: ", grid_search.best_params_)

# Use the best estimator found by the search
best_model = grid_search.best_estimator_

# --- 6. Evaluate the Final Model ---
print("\nStep 6: Evaluating the FINAL optimized model...")
y_pred = best_model.predict(X_test)
print(classification_report(y_test, y_pred))

# --- 7. Save the Final Model ---
os.makedirs('model', exist_ok=True)
joblib.dump(best_model, MODEL_OUTPUT_FILE)
print(f"\n✅ Final optimized model saved to '{MODEL_OUTPUT_FILE}'!")