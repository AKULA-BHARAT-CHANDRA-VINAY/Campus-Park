import React, { useEffect, useState } from "react";
import axios from "axios";

const DemandPredictionCard: React.FC = () => {

  const [prediction, setPrediction] = useState<any>(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/ml/rebalance`)
      .then(res => setPrediction(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!prediction) return <div className="card">Loading ML Prediction...</div>;

  return (
    <div className="card">
      <h3>ML Demand Prediction</h3>
      <p>2W Ratio: {prediction.predicted_2W_ratio}</p>
      <p>4W Ratio: {prediction.predicted_4W_ratio}</p>
    </div>
  );
};

export default DemandPredictionCard;