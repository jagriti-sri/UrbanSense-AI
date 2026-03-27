import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# load cleaned dataset
df = pd.read_csv("dataset_clean.csv")

# split features and label
X = df.drop("riskLevel", axis=1)
y = df["riskLevel"]

# split training + testing data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# initialize model
model = DecisionTreeClassifier(
    max_depth=6,
    min_samples_split=8,
    random_state=42
)

# train model
model.fit(X_train, y_train)



# predictions
y_pred = model.predict(X_test)

# evaluation
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

scores = cross_val_score(model, X, y, cv=5)

print("Cross-validation accuracy:", scores.mean())

# save trained model
joblib.dump(model, "flood_model.pkl")

print("Model saved successfully!")