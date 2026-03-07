import { motion } from "framer-motion";
import { cn } from "../utils/cn";
import { Bike, Car, Ban } from "lucide-react";

const normalizeStatus = (status) => {
  if (!status) return "available";

  const s = status.toUpperCase();

  if (s === "AVAILABLE") return "available";
  if (s === "RESERVED") return "booked";   // 🔥 THIS FIX
  if (s === "ACTIVE") return "occupied";

  return "available";
};

export function SlotGrid({
  slots,
  selectedSlot,
  onSelectSlot,
  selectedVehicleType,
  shakingSlotId,
  rotate = false,
  compact = false,
  loading = false,
}) {
  return (
    <div className="grid gap-2 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50 shadow-inner w-full h-full max-w-[1200px] mx-auto overflow-y-auto overflow-x-hidden">
      <div
        className={cn(
          "grid justify-items-center items-start w-full",
          compact ? "gap-1.5" : "gap-3"
        )}
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))"
        }}
      >
        {slots.map((slot, index) => {
          const normalizedStatus = normalizeStatus(slot.status);
          const isAvailable = normalizedStatus === "available";
          const isCompatible = slot.type === selectedVehicleType;
          const isSelected = selectedSlot?.id === slot.id;

          const carSize = compact
            ? "w-20 h-20 md:w-24 md:h-24"
            : rotate
              ? "w-16 h-24 md:w-20 md:h-28 lg:w-24 lg:h-32"
              : "w-24 h-16 md:w-28 md:h-20 lg:w-32 lg:h-24";

          const bikeSize = compact
            ? "w-14 h-20 md:w-16 md:h-24"
            : rotate
              ? "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
              : "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24";

          let statusColor = "bg-zinc-800 border-zinc-700 text-zinc-500";

          if (isCompatible) {
            if (normalizedStatus === "available")
              statusColor =
                "bg-emerald-500/10 border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
            if (normalizedStatus === "booked")
              statusColor =
                "bg-yellow-500/10 border-yellow-500/50 text-yellow-500";
            if (normalizedStatus === "occupied")
              statusColor =
                "bg-red-500/10 border-red-500/50 text-red-500";
          }

          if (isSelected) {
            statusColor =
              "bg-emerald-500 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10 scale-110";
          }

          if (!isCompatible) {
            statusColor =
              "opacity-20 cursor-not-allowed bg-zinc-900 border-zinc-800 text-zinc-800";
          }

          return (
            <motion.button
              key={slot.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                shakingSlotId === slot.id
                  ? { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } }
                  : { opacity: 1, scale: 1 }
              }
              transition={{ delay: index * 0.005, duration: 0.2 }}
              whileHover={isCompatible && isAvailable ? { scale: 1.15, zIndex: 10 } : {}}
              whileTap={isCompatible && isAvailable ? { scale: 0.95 } : {}}
              onClick={() => isCompatible && onSelectSlot(slot)}
              disabled={!isCompatible}
              className={cn(
                "relative flex items-center justify-center rounded-xl border-2 transition-all duration-300 group shadow-lg",
                slot.type === "4W" ? carSize : bikeSize,
                statusColor
              )}
            >
              <div className="flex flex-col items-center justify-center group-hover:opacity-20 transition-opacity">
                {slot.type === "4W" ? (
                  <Car size={28} strokeWidth={2} />
                ) : (
                  <Bike size={20} strokeWidth={2} />
                )}
                <span className="text-[10px] font-bold mt-1 text-zinc-400/80">
                  {slot.label}
                </span>
              </div>

              {!isAvailable && isCompatible && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <Ban className="text-red-500/80" size={20} />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}