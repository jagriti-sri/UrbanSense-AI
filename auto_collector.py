import requests
import pandas as pd
from datetime import datetime
import os
import json
import time

# ====== CONFIG ======
TOKEN = "YOUR_TOKEN_HERE"  # Replace with your WAQI token
CITY_FILE = "data/cities.json"
DATA_FILE = "data/aqi_data.csv"

# Create data folder if it doesn't exist
os.makedirs("data", exist_ok=True)


# ====== AQI CALCULATION FROM PM2.5 ======
def calc_aqi_pm25(pm25):
    if pm25 is None:
        return None

    breakpoints = [
        (0, 30, 0, 50),
        (31, 60, 51, 100),
        (61, 90, 101, 200),
        (91, 120, 201, 300),
        (121, 250, 301, 400),
        (251, 500, 401, 500),
    ]

    for c_low, c_high, i_low, i_high in breakpoints:
        if c_low <= pm25 <= c_high:
            return ((i_high - i_low)/(c_high - c_low))*(pm25 - c_low) + i_low
    return None


# ====== FETCH AQI FOR A CITY ======
def fetch_aqi(city):
    headers = {"User-Agent": "UrbanSenseAI"}

    # --- STEP 1: Get coordinates from OpenStreetMap ---
    geo_url = f"https://nominatim.openstreetmap.org/search?city={city}&country=India&format=json"
    try:
        geo_response = requests.get(geo_url, headers=headers, timeout=10).json()
    except Exception as e:
        print(f"Error fetching coordinates for {city}: {e}")
        return None

    if not geo_response:
        print(f"Location not found for {city}")
        return None

    lat = geo_response[0]["lat"]
    lon = geo_response[0]["lon"]

    # --- STEP 2: Try WAQI first ---
    aqi_url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={TOKEN}"
    try:
        response = requests.get(aqi_url, timeout=10).json()
    except Exception as e:
        print(f"Error fetching WAQI data for {city}: {e}")
        response = {"status": "fail"}

    if response.get("status") == "ok":
        data = response.get("data", {})
        row = {
            "city": city,
            "datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "aqi": data.get("aqi")
        }

        if "iaqi" in data:
            for key in data["iaqi"]:
                row[key] = data["iaqi"][key]["v"]

        print(f"WAQI data used for {city}")
        return row

    # --- STEP 3: Fallback to Open-Meteo ---
    print(f"Using Open-Meteo fallback for {city}")
    meteo_url = f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide"

    try:
        meteo_response = requests.get(meteo_url, timeout=10).json()
    except Exception as e:
        print(f"Error fetching Open-Meteo data for {city}: {e}")
        return None

    current = meteo_response.get("current", {})

row = {
    "city": city,
    "datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "aqi": None,
    "pm25": current.get("pm2_5"),   # <-- ensure this key matches the function
    "pm10": current.get("pm10"),
    "co": current.get("carbon_monoxide"),
    "no2": current.get("nitrogen_dioxide"),
    "o3": current.get("ozone"),
    "so2": current.get("sulphur_dioxide")
}

# Calculate AQI from PM2.5 if WAQI failed
if row["aqi"] is None and row["pm25"] is not None:
    row["aqi"] = calc_aqi_pm25(row["pm25"])




# ====== COLLECT DATA FOR ALL CITIES ======
def collect_all():
    if not os.path.exists(CITY_FILE):
        print("No cities found. Run city_manager.py first.")
        return

    with open(CITY_FILE, "r") as f:
        cities = json.load(f)

    rows = []

    for city in cities:
        print(f"Fetching data for {city}...")
        data = fetch_aqi(city)
        if data:
            rows.append(data)
        time.sleep(1)  # prevent API rate-limits

    if rows:
        df = pd.DataFrame(rows)

        if not os.path.exists(DATA_FILE):
            df.to_csv(DATA_FILE, index=False)
        else:
            df.to_csv(DATA_FILE, mode="a", header=False, index=False)

        print("Data saved successfully!\n")


# ====== RUN CONTINUOUSLY ======
if __name__ == "__main__":
    while True:
        collect_all()
        print("Waiting 5 minutes...\n")
        time.sleep(300)  # 5 minutes
