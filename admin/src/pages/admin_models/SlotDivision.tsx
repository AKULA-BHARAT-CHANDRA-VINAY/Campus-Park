import React, { useState } from "react";
import axios from "axios";

interface Slot {
  slot_type: string;
  x: number;
  y: number;
  width: number;
  length: number;
}

const SlotDivision: React.FC = () => {
  const [width, setWidth] = useState(50);
  const [length, setLength] = useState(50);
  const [ratio, setRatio] = useState(0.6);
  const [layout, setLayout] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  const generateLayout = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/ml/layout",
        {
          width,
          length,
          ratio_2w: ratio
        }
      );

      setLayout(res.data.slots || res.data.layout || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Slot Division Model</h1>

      <div style={{ display: "flex", gap: 10 }}>
        <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
        <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} />
        <input type="number" step="0.1" value={ratio} onChange={(e) => setRatio(Number(e.target.value))} />
        <button onClick={generateLayout}>Generate Layout</button>
      </div>

      {loading && <p>Generating layout...</p>}

      <div
        style={{
          position: "relative",
          marginTop: 40,
          width: 600,
          height: 600,
          border: "2px solid #64ffda",
          background: "#0f172a"
        }}
      >
        {layout.map((slot, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: slot.x * 10,
              top: slot.y * 10,
              width: slot.width * 10,
              height: slot.length * 10,
              backgroundColor:
                slot.slot_type === "2W" ? "#10b981" : "#3b82f6",
              opacity: 0,
              animation: `fadeIn 0.5s ease forwards`,
              animationDelay: `${index * 0.02}s`,
              border: "1px solid #000"
            }}
          />
        ))}
      </div>

      <style>
        {`
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        `}
      </style>
    </div>
  );
};

export default SlotDivision;