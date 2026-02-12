# predict_aqi.py

import joblib
import numpy as np
from sklearn.preprocessing import StandardScaler

# -------------------------
# 1. Load trained model
# -------------------------
model = joblib.load('aqi_model.pkl')
print("AQI model loaded successfully!")

# -------------------------
# 2. Define feature order
# -------------------------
feature_columns = ['pm25', 'pm10', 'co', 'no2', 'o3', 'so2']

# -------------------------
# 3. Input new pollutant values
# -------------------------
# Example: Replace with real-time or test values
pm25 = float(input("Enter PM2.5 value: "))
pm10 = float(input("Enter PM10 value: "))
co = float(input("Enter CO value: "))
no2 = float(input("Enter NO2 value: "))
o3 = float(input("Enter O3 value: "))
so2 = float(input("Enter SO2 value: "))

new_data = np.array([[pm25, pm10, co, no2, o3, so2]])

# -------------------------
# 4. Scale input features
# -------------------------
# Note: In real deployment, you should save & load the scaler from training
scaler = StandardScaler()
new_data_scaled = scaler.fit_transform(new_data)  # Works for testing

# -------------------------
# 5. Predict AQI
# -------------------------
predicted_aqi = model.predict(new_data_scaled)
print(f"\nPredicted AQI: {predicted_aqi[0]:.2f}")
