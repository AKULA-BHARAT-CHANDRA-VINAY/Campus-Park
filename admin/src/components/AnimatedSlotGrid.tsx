import { motion } from "framer-motion";

interface Props {
  occupied: number;
  total: number;
}

const AnimatedSlotGrid: React.FC<Props> = ({ occupied, total }) => {

  const slots = Array.from({ length: total });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6 }}>
      {slots.map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.02 }}
          style={{
            height: 20,
            background: index < occupied ? "#ef4444" : "#10b981",
            borderRadius: 4
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedSlotGrid;