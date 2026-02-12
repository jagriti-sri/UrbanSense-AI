import json
import os

FILE = "data/cities.json"
os.makedirs("data", exist_ok=True)

def add_cities():
    cities = input("Enter cities separated by comma: ")
    city_list = [c.strip() for c in cities.split(",") if c.strip()]

    with open(FILE, "w") as f:
        json.dump(city_list, f)

    print("Cities saved successfully!")

if __name__ == "__main__":
    add_cities()
