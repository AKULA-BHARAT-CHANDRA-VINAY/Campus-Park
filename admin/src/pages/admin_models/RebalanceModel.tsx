import React, { useState } from "react";
import axios from "axios";
import DemandChart from "../../components/DemandChart";

const RebalanceModel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const runRebalance = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/ml/rebalance`
      );

      setResult(res.data);
    } catch (err) {
      setError("Failed to fetch rebalance data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <h1>Rebalance Model</h1>
      <p>Optimize vehicle distribution across zones.</p>

      <button
        onClick={runRebalance}
        style={{ marginTop: 20 }}
        className="btn btn-primary"
      >
        Run Rebalance Model
      </button>

      {loading && <p>Analyzing demand...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 30 }}>
          <h3>Rebalance Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      <div style={{ marginTop: 40 }}>
        <DemandChart />
      </div>
    </div>
  );
};

export default RebalanceModel;