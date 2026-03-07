from pymongo import MongoClient
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

MONGO_URI = "mongodb+srv://abcvinay2005_db_user:campuspark123@cluster0.2ndyriy.mongodb.net/CampusPark_ML_TEST"

client = MongoClient(MONGO_URI)
db = client["CampusPark_ML_TEST"]

bookings = list(db.bookings.find())

if not bookings:
    print("No booking data found.")
    exit()

data = []

for b in bookings:
    slot = db.parkingslots.find_one({"_id": b["slot"]})
    if not slot:
        continue

    created = b["createdAt"]

    peak = 1 if 9 <= created.hour <= 11 or 16 <= created.hour <= 18 else 0

    if slot["slotType"] == "2W":
        base_demand = 40
    else:
        base_demand = 70

    if peak:
        base_demand += 20

    if created.weekday() >= 5:
        base_demand += 10

    noise = np.random.randint(-10, 10)

    slot_demand = base_demand + noise
    slot_demand = max(10, min(100, slot_demand))

    data.append({
        "vehicle_type": slot["slotType"],
        "department": "Main Gate Parking",
        "hour": created.hour,
        "day_of_week": created.weekday(),
        "duration": 60,
        "peak_hour": peak,
        "slot_demand": slot_demand
    })


df = pd.DataFrame(data)

le_vehicle = LabelEncoder()
le_dept = LabelEncoder()

df["vehicle_type"] = le_vehicle.fit_transform(df["vehicle_type"])
df["department"] = le_dept.fit_transform(df["department"])

X = df.drop("slot_demand", axis=1)
y = df["slot_demand"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = RandomForestRegressor(n_estimators=100)
model.fit(X_train, y_train)

pred = model.predict(X_test)

print("MAE:", mean_absolute_error(y_test, pred))
print("R2:", r2_score(y_test, pred))

joblib.dump(model, "models/parking_model.pkl")
joblib.dump(le_vehicle, "models/vehicle_encoder.pkl")
joblib.dump(le_dept, "models/dept_encoder.pkl")

print("Model trained and saved successfully.")