import sys
import json
import numpy as np
import pandas as pd
from pymongo import MongoClient
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression

def analyze_demand_ml(connection_string):
    try:
        client = MongoClient(connection_string)
        db = client["CampusPark_ML_TEST"]

        thirty_days_ago = datetime.now() - timedelta(days=30)

        pipeline = [
            {"$match": {"createdAt": {"$gte": thirty_days_ago}}},
            {"$lookup": {
                "from": "parkingslots",
                "localField": "slot",
                "foreignField": "_id",
                "as": "slotDetails"
            }},
            {"$unwind": "$slotDetails"},
            {"$project": {
                "date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$createdAt"}},
                "slotType": "$slotDetails.slotType"
            }},
            {"$group": {
                "_id": {"date": "$date", "slotType": "$slotType"},
                "count": {"$sum": 1}
            }}
        ]

        results = list(db.bookings.aggregate(pipeline))

        if not results:
            return {"status": "no_data"}

        # Convert to dataframe
        data = []
        for r in results:
            data.append({
                "date": r["_id"]["date"],
                "slotType": r["_id"]["slotType"],
                "count": r["count"]
            })

        df = pd.DataFrame(data)

        pivot = df.pivot(index="date", columns="slotType", values="count").fillna(0)
        pivot["total"] = pivot.sum(axis=1)
        pivot["2W_ratio"] = pivot.get("2W", 0) / pivot["total"]

        pivot = pivot.reset_index()
        pivot["day_index"] = np.arange(len(pivot))

        X = pivot[["day_index"]]
        y = pivot["2W_ratio"]

        model = LinearRegression()
        model.fit(X, y)

        # Predict next 3 days
        future_days = np.array([[len(pivot) + i] for i in range(3)])
        predictions = model.predict(future_days)

        avg_prediction = float(np.mean(predictions))

        recommendation = "STABLE"
        if avg_prediction > 0.65:
            recommendation = "INCREASE_2W_ZONES"
        elif avg_prediction < 0.35:
            recommendation = "INCREASE_4W_ZONES"

        return {
            "predicted_2W_ratio": round(avg_prediction, 2),
            "suggested_action": recommendation
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    mongo_uri = sys.argv[1] if len(sys.argv) > 1 else "mongodb+srv://abcvinay2005_db_user:campuspark123@cluster0.2ndyriy.mongodb.net/CampusPark_ML_TEST"
    result = analyze_demand_ml(mongo_uri)
    print(json.dumps(result))