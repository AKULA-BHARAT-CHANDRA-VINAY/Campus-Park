import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

interface Props {
  zones: any[];
}

const ZoneOccupancyChart: React.FC<Props> = ({ zones }) => {

  const data = {
    labels: zones.map(z => z.zone),
    datasets: [
      {
        label: "Occupancy %",
        data: zones.map(z => z.occupancy),
        backgroundColor: "#64ffda"
      }
    ]
  };

  return <Bar data={data} />;
};

export default ZoneOccupancyChart;