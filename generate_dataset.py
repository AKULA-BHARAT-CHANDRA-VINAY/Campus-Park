import random
from pymongo import MongoClient
from datetime import datetime, timedelta

MONGO_URI = "mongodb+srv://abcvinay2005_db_user:campuspark123@cluster0.2ndyriy.mongodb.net"

client = MongoClient(MONGO_URI)
db = client["CampusPark_ML_TEST"]
print("Using DB:", db.name)
print("Connected to MongoDB...")
db.bookings.delete_many({})
print("Old booking data cleared.")

# Get existing slots
slots = list(db.parkingslots.find())

if not slots:
    print("No slots found. Please create slots first.")
    exit()

slot_ids_2w = [s["_id"] for s in slots if s["slotType"] == "2W"]
slot_ids_4w = [s["_id"] for s in slots if s["slotType"] == "4W"]

if not slot_ids_2w or not slot_ids_4w:
    print("Slots must contain both 2W and 4W.")
    exit()

print("Using existing slots.")

for day in range(180):
    date = datetime.now() - timedelta(days=day)

    two_w_bias = 0.6 + (day % 5) * 0.05

    for _ in range(random.randint(30, 70)):
        if random.random() < two_w_bias:
            slot_id = random.choice(slot_ids_2w)
        else:
            slot_id = random.choice(slot_ids_4w)

        db.bookings.insert_one({
            "slot": slot_id,
            "createdAt": date
        })

print("Synthetic booking dataset created successfully.")