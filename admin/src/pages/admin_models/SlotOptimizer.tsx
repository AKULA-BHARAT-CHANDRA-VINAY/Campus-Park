import React, { useState } from "react";
import axios from "axios";

const SlotOptimizer: React.FC = () => {
  const [vehicleType, setVehicleType] = useState("2W");
  const [department, setDepartment] = useState("CSE");
  const [hour, setHour] = useState(10);
  const [dayOfWeek, setDayOfWeek] = useState(2);
  const [duration, setDuration] = useState(3);
  const [peakHour, setPeakHour] = useState(1);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runPrediction = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/ml/predict`,
        {
          vehicle_type: vehicleType,
          department: department,
          hour,
          day_of_week: dayOfWeek,
          duration,
          peak_hour: peakHour,
        }
      );

      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <h1>Slot Optimizer</h1>
      <p>Generate optimal parking slot demand prediction.</p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          placeholder="Vehicle Type"
        />

        <input
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Department"
        />

        <input
          type="number"
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          placeholder="Hour"
        />

        <input
          type="number"
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(Number(e.target.value))}
          placeholder="Day of Week"
        />

        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="Duration"
        />

        <input
          type="number"
          value={peakHour}
          onChange={(e) => setPeakHour(Number(e.target.value))}
          placeholder="Peak Hour (0/1)"
        />
      </div>

      <button
        onClick={runPrediction}
        style={{ marginTop: 20 }}
        className="btn btn-primary"
      >
        Run Prediction
      </button>

      {loading && <p>Predicting...</p>}

      {result && (
        <div style={{ marginTop: 30 }}>
          <h3>Prediction Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SlotOptimizer;