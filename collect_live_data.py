import requests
import pandas as pd
from datetime import datetime
import os

# ====== PUT YOUR TOKEN HERE ======
TOKEN = "14e01c5e18d47c154db7063b1b2bf74ebceebb5c"

city = input("Enter your city name: ")

url = f"https://api.waqi.info/feed/{city}/?token={TOKEN}"

response = requests.get(url).json()

if response["status"] != "ok":
    print("City not found or no data available.")
    exit()

data = response["data"]

row = {
    "city": city,
    "datetime": datetime.now(),
    "AQI": data.get("aqi"),
}

# Pollutants (if available)
if "iaqi" in data:
    pollutants = data["iaqi"]
    for key in pollutants:
        row[key] = pollutants[key]["v"]

df = pd.DataFrame([row])

# Save
os.makedirs("data", exist_ok=True)
file_path = "data/aqi_data.csv"

if not os.path.isfile(file_path):
    df.to_csv(file_path, index=False)
else:
    df.to_csv(file_path, mode="a", header=False, index=False)

print("\nLive AQI data collected successfully!\n")
print(df)
