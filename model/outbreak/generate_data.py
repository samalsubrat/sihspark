import pandas as pd
import numpy as np
import os

print("🚀 Starting FINAL synthetic data generation with advanced features...")

# --- Configuration ---
NUM_VILLAGES = 20
START_DATE = '2024-01-01'
END_DATE = '2024-12-31'
OUTPUT_FOLDER = 'data'
OUTPUT_FILE = os.path.join(OUTPUT_FOLDER, 'historical_data.csv')

# --- Create Village-specific static features ---
villages_data = {
    'village_id': [f'Village_{chr(65+i)}' for i in range(NUM_VILLAGES)],
    # Simulate some villages being more dense than others
    'population_density': np.random.randint(100, 1000, size=NUM_VILLAGES),
    # Simulate proximity to a river (lower is closer/riskier)
    'proximity_to_river': np.round(np.random.uniform(0.1, 5.0, size=NUM_VILLAGES), 1)
}
villages_df = pd.DataFrame(villages_data)

# --- Create Time-series Data ---
date_range = pd.date_range(start=START_DATE, end=END_DATE, freq='D')
num_days = len(date_range)

df_list = []
for i, village in villages_df.iterrows():
    temp_df = pd.DataFrame({'date': date_range})
    temp_df['village_id'] = village['village_id']
    temp_df['population_density'] = village['population_density']
    temp_df['proximity_to_river'] = village['proximity_to_river']
    df_list.append(temp_df)

df = pd.concat(df_list, ignore_index=True)
num_records = len(df)

# --- Generate Base Measurements ---
df['reported_cases'] = np.random.randint(0, 3, size=num_records)
df['turbidity_ntu'] = np.round(np.random.uniform(1.0, 5.0, size=num_records), 2)
df['ph_level'] = np.round(np.random.uniform(6.8, 7.8, size=num_records), 2)
df['rainfall_mm'] = np.round(np.abs(np.random.normal(2, 5, size=num_records)), 2)
df['e_coli_present'] = np.zeros(num_records, dtype=int)

# --- Create Probabilistic Outbreak Events ---
print("Simulating probabilistic outbreak events using all risk factors...")
is_monsoon = (df['date'].dt.month >= 6) & (df['date'].dt.month <= 9)
recent_heavy_rain = df.groupby('village_id')['rainfall_mm'].transform(lambda x: x.rolling(window=3).sum()) > 50

# Propensity now includes the new features
propensity = 0.05
propensity += is_monsoon * 0.15
propensity += recent_heavy_rain * 0.25
propensity += (df['population_density'] / 1000) * 0.10 # Denser areas have higher risk
propensity -= (df['proximity_to_river'] / 5) * 0.10     # Closer to river (lower value) increases risk

is_outbreak_event = np.random.rand(num_records) < propensity

df.loc[is_outbreak_event, 'reported_cases'] += np.random.randint(15, 30, size=is_outbreak_event.sum())
df.loc[is_outbreak_event, 'e_coli_present'] = 1
df.loc[is_outbreak_event, 'turbidity_ntu'] += np.random.uniform(5, 15, size=is_outbreak_event.sum())

df['turbidity_ntu'] += np.random.normal(0, 0.5, size=num_records)
numeric_cols = df.select_dtypes(include=np.number).columns
df[numeric_cols] = df[numeric_cols].clip(lower=0)

# --- Save to CSV ---
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
df.to_csv(OUTPUT_FILE, index=False)
print(f"\n✅ Final synthetic data saved to '{OUTPUT_FILE}'!")