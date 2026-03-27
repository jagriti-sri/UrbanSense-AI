import sys
import json
import joblib
import numpy as np
import os


# -----------------------------
# Load trained ML model safely
# -----------------------------

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "flood_model.pkl"
)

model = joblib.load(MODEL_PATH)


# -----------------------------
# Read features from Node.js
# -----------------------------

if len(sys.argv) < 2:
    print("ERROR: No input features provided")
    sys.exit(1)

try:
    features = json.loads(sys.argv[1])
except Exception as e:
    print("ERROR: Invalid JSON input")
    sys.exit(1)


# -----------------------------
# Convert to numpy array
# -----------------------------

try:
    X = np.array([features])
except Exception as e:
    print("ERROR: Feature conversion failed")
    sys.exit(1)


# -----------------------------
# Predict flood risk level
# -----------------------------

try:
    prediction = model.predict(X)[0]
except Exception as e:
    print("ERROR: Prediction failed")
    sys.exit(1)


# -----------------------------
# Return prediction to Node.js
# -----------------------------

print(prediction)