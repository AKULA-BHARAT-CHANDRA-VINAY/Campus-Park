from pymongo import MongoClient
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder

client = MongoClient("mongodb://localhost:27017/smart_parking")
db = client["CampusPark_ML_TEST"]

bookings = list(db.bookings.find())

if not bookings:
    print("No data to retrain.")
    exit()

data = []
for b in bookings:
    data.append({
        "vehicle_type": "2W" if "2W" in str(b.get("slot")) else "4W",
        "department": "Main Gate Parking",
        "hour": b["createdAt"].hour,
        "day_of_week": b["createdAt"].weekday(),
        "duration": 60,
        "peak_hour": 1 if 9 <= b["createdAt"].hour <= 11 else 0,
        "slot_demand": 1
    })

df = pd.DataFrame(data)

le_vehicle = LabelEncoder()
le_dept = LabelEncoder()

df["vehicle_type"] = le_vehicle.fit_transform(df["vehicle_type"])
df["department"] = le_dept.fit_transform(df["department"])

X = df.drop("slot_demand", axis=1)
y = df["slot_demand"]

model = RandomForestRegressor()
model.fit(X, y)

joblib.dump(model, "models/parking_model.pkl")
joblib.dump(le_vehicle, "models/vehicle_encoder.pkl")
joblib.dump(le_dept, "models/dept_encoder.pkl")

print("Model retrained successfully!")