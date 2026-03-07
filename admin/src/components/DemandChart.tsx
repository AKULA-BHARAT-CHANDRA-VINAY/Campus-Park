import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function DemandChart() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/ml/rebalance")
      .then(res => {

        // Adjust this based on your actual ML output structure
        const result = res.data;

        setChartData({
          labels: ["2W", "4W"],
          datasets: [{
            label: "Vehicle Ratio",
            data: [
              result.predicted_2W_ratio || 0,
              result.predicted_4W_ratio || 0
            ],
            borderColor: "#64ffda",
            backgroundColor: "rgba(100,255,218,0.2)"
          }]
        });
      });
  }, []);

  if (!chartData) return <div>Loading Chart...</div>;

  return <Line data={chartData} />;
}