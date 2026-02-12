# train_aqi_model.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib

# -------------------------
# 1. Load dataset
# -------------------------
csv_path = "data/aqi_data.csv"
df = pd.read_csv(csv_path)
print("Columns in dataset:", df.columns)
print("Total rows in CSV:", len(df))

# -------------------------
# 2. Define feature columns
# -------------------------
feature_columns = ['pm25', 'pm10', 'co', 'no2', 'o3', 'so2']

# Convert all features to numeric (in case of strings)
for col in feature_columns:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# Fill missing pollutant values with mean
df[feature_columns] = df[feature_columns].fillna(df[feature_columns].mean())

# -------------------------
# 3. AQI breakpoints (Indian standard)
# -------------------------
pm25_bp = [(0, 30, 0, 50), (31, 60, 51, 100), (61, 90, 101, 200), (91, 120, 201, 300)]
pm10_bp = [(0, 50, 0, 50), (51, 100, 51, 100), (101, 250, 101, 200), (251, 350, 201, 300)]
no2_bp  = [(0, 40, 0, 50), (41, 80, 51, 100), (81, 180, 101, 200)]
co_bp   = [(0, 1, 0, 50), (1.1, 2, 51, 100), (2.1, 10, 101, 200)]
o3_bp   = [(0, 50, 0, 50), (51, 100, 51, 100), (101, 168, 101, 200)]
so2_bp  = [(0, 40, 0, 50), (41, 80, 51, 100), (81, 380, 101, 200)]

# Function to calculate AQI for a pollutant
def calc_aqi(C, breakpoints):
    for BP_lo, BP_hi, I_lo, I_hi in breakpoints:
        if BP_lo <= C <= BP_hi:
            return ((I_hi - I_lo)/(BP_hi - BP_lo))*(C - BP_lo) + I_lo
    return None

# -------------------------
# 4. Calculate AQI if missing
# -------------------------
if 'aqi' not in df.columns or df['aqi'].isna().all():
    print("Calculating AQI from pollutants...")
    aqi_values = []
    for idx, row in df.iterrows():
        aqi_list = []
        aqi_list.append(calc_aqi(row['pm25'], pm25_bp))
        aqi_list.append(calc_aqi(row['pm10'], pm10_bp))
        aqi_list.append(calc_aqi(row['no2'], no2_bp))
        aqi_list.append(calc_aqi(row['co'], co_bp))
        aqi_list.append(calc_aqi(row['o3'], o3_bp))
        aqi_list.append(calc_aqi(row['so2'], so2_bp))
        
        # Remove None values (out-of-range)
        aqi_list = [x for x in aqi_list if x is not None]
        
        # Overall AQI is max pollutant AQI
        aqi_values.append(max(aqi_list) if aqi_list else np.nan)
    
    df['aqi'] = aqi_values

# Drop rows where AQI could not be calculated
df = df.dropna(subset=['aqi'])
print(f"Rows with valid AQI after calculation: {len(df)}")

# -------------------------
# 5. Prepare features and target
# -------------------------
X = df[feature_columns]
y = df['aqi']

if X.shape[0] == 0:
    raise ValueError("No valid rows left after cleaning! Check your CSV.")

# -------------------------
# 6. Scale features
# -------------------------
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# -------------------------
# 7. Split into train/test
# -------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# -------------------------
# 8. Hyperparameter tuning for Random Forest
# -------------------------
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [None, 10, 20],
    'min_samples_split': [2, 5, 10]
}

grid = GridSearchCV(
    RandomForestRegressor(random_state=42),
    param_grid,
    cv=5,
    scoring='r2',
    n_jobs=-1
)
grid.fit(X_train, y_train)
print("Best parameters found:", grid.best_params_)
model = grid.best_estimator_

# -------------------------
# 9. Evaluate model
# -------------------------
# Calculate percentage accuracy per sample
accuracy_list = []

# 1. Predict on test set
y_pred = model.predict(X_test)

# 2. Evaluate with regression metrics
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"Mean Squared Error: {mse:.2f}")
print(f"Mean Absolute Error: {mae:.2f}")
print(f"R2 Score: {r2:.2f}")

# 3. Calculate regression "accuracy" %
accuracy_list = []
for true, pred in zip(y_test, y_pred):
    if true == 0:
        acc = 1.0 if pred == 0 else 0.0
    else:
        acc = 1 - abs(true - pred)/true
    accuracy_list.append(acc)

accuracy_percent = np.mean(accuracy_list) * 100
print(f"Regression Accuracy: {accuracy_percent:.2f}%")


# -------------------------
# 10. Save model and scaler
# -------------------------
joblib.dump(model, 'aqi_model.pkl')
joblib.dump(scaler, 'aqi_scaler.pkl')
print("Trained model saved as 'aqi_model.pkl' and scaler saved as 'aqi_scaler.pkl'")
