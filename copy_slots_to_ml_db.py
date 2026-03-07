from pymongo import MongoClient

PROD_URI = "mongodb+srv://abcvinay2005_db_user:campuspark123@cluster0.2ndyriy.mongodb.net/CampusPark"
MONGO_URI = "mongodb+srv://abcvinay2005_db_user:campuspark123@cluster0.2ndyriy.mongodb.net/CampusPark_ML_TEST"

prod_client = MongoClient(PROD_URI)
client = MongoClient(MONGO_URI)

prod_db = prod_client["CampusPark"]
db = client["CampusPark_ML_TEST"]

prod_slots = list(prod_db.parkingslots.find())

if not prod_slots:
    print("❌ No slots found in production DB.")
    exit()

db.parkingslots.delete_many({})

for slot in prod_slots:
    slot.pop("_id")
    db.parkingslots.insert_one(slot)

print(f"✅ Copied {len(prod_slots)} slots into CampusPark_ML_TEST")