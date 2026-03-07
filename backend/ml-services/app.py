from flask import Flask, request, jsonify
import joblib
import numpy as np
from rebalance_model import analyze_demand_ml

app = Flask(__name__)

model = joblib.load("models/parking_model.pkl")
le_vehicle = joblib.load("models/vehicle_encoder.pkl")
le_dept = joblib.load("models/dept_encoder.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    vehicle = le_vehicle.transform([data["vehicle_type"]])[0]
    dept = le_dept.transform([data["department"]])[0]

    features = np.array([[
        vehicle,
        dept,
        data["hour"],
        data["day_of_week"],
        data["duration"],
        data["peak_hour"]
    ]])

    prediction = model.predict(features)[0]

    return jsonify({"predicted_slot_demand": int(prediction)})


@app.route("/rebalance", methods=["GET"])
def rebalance():
    result = analyze_demand_ml("mongodb+srv://abcvinay2005_db_user:campuspark123@cluster0.2ndyriy.mongodb.net/CampusPark_ML_TEST")
    return jsonify(result)

from layout_service import generate_parking_layout

@app.route("/layout", methods=["POST"])
def layout():
    data = request.json

    result = generate_parking_layout(
        area_width=data["width"],
        area_length=data["length"],
        predicted_ratio=data["ratio_2w"]
    )

    return jsonify(result)



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000)