import pandas as pd

# load dataset
df = pd.read_csv("dataset.csv")

# remove unwanted columns
df = df.drop(columns=[
    "latitude",
    "longitude",
    "createdAt",
    "confidenceScore",
    "riskProbability"
], errors="ignore")

# save cleaned dataset
df.to_csv("dataset_clean.csv", index=False)

print("Dataset cleaned successfully")