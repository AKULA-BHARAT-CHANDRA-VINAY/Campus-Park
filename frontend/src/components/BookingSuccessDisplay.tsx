import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import axios from "axios";

interface Booking {
  _id: string;
  slot: { slotNumber: string };
  area: { name: string };
  vehicleType: string;
  startTime: string;
  endTime: string;
  qrCodeUrl: string; // ✅ backend provides this
}

interface Props {
  booking: Booking;
  onClose: () => void;
  onBookingCancelled?: () => void;
}

const BookingSuccessDisplay: React.FC<Props> = ({ booking, onClose, onBookingCancelled }) => {
  const [cancelling, setCancelling] = useState(false);

  const getPhase = () => {
    const now = new Date().getTime();
    const start = new Date(booking.startTime).getTime();
    const end = new Date(booking.endTime).getTime();

    if (now < start) return "PRE_CHECKIN";
    if (now >= start && now < end) return "GRACE_PERIOD";
    return "EXPIRED";
  };

  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const start = new Date(booking.startTime).getTime();
    const end = new Date(booking.endTime).getTime();

    let diff = 0;
    if (now < start) {
      diff = start - now;
    } else if (now < end) {
      diff = end - now;
    }

    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [phase, setPhase] = useState(getPhase());
  const [timer, setTimer] = useState(calculateTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(getPhase());
      setTimer(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [booking]);

  const downloadQR = () => {
    if (!booking.qrCodeUrl) return;
    const link = document.createElement("a");
    link.href = booking.qrCodeUrl;
    link.download = "Parking_QR.png";
    link.click();
  };

  const handleCancelBooking = async () => {
    if (!window.confirm("Are you sure you want to cancel your booking?")) return;

    try {
      setCancelling(true);
      await axios.post(
        "/api/parking/cancel",
        { bookingId: booking._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (onBookingCancelled) {
        onBookingCancelled();
      }
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto flex justify-center py-4">
      <div className="bg-zinc-900/50 border border-emerald-500/30 text-zinc-100 p-6 md:p-8 rounded-3xl w-full max-w-lg flex flex-col items-center shadow-[0_0_50px_rgba(16,185,129,0.1)] h-fit my-auto">

        <h2 className="text-2xl font-bold text-emerald-400 mb-4">
          Booking Confirmed!
        </h2>

        <p>Area: {booking.area.name}</p>
        <p>Slot: {booking.slot.slotNumber}</p>
        <p>Vehicle: {booking.vehicleType}</p>
        <p>Start: {new Date(booking.startTime).toLocaleTimeString()}</p>
        <p>End: {new Date(booking.endTime).toLocaleTimeString()}</p>

        <div className="my-4 p-4 border border-zinc-800 rounded-xl bg-zinc-900 w-full text-center shadow-lg">
          <p className="text-zinc-400 text-sm mb-2">
            {phase === "PRE_CHECKIN"
              ? "Time Remaining for Check-in:"
              : phase === "GRACE_PERIOD"
                ? "Grace Period Remaining:"
                : ""}
          </p>
          <p className={`font-mono text-xl font-bold ${phase === "EXPIRED" ? "text-red-500" : "text-emerald-400"}`}>
            {phase === "EXPIRED"
              ? "Booking Expired / Slot Auto Freed"
              : `${timer.hours}h ${timer.minutes}m ${timer.seconds}s`}
          </p>
        </div>

        {booking.qrCodeUrl && (
          <img
            src={booking.qrCodeUrl}
            alt="Booking QR Code"
            className="w-48 h-48 md:w-52 md:h-52 my-4"
          />
        )}

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={downloadQR}
            className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 shadow-lg transition-all"
          >
            Download QR
          </button>

          {phase !== "EXPIRED" && (
            <button
              onClick={handleCancelBooking}
              disabled={cancelling}
              className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/50 font-bold rounded-xl hover:bg-red-500/20 shadow-lg transition-all disabled:opacity-50"
            >
              {cancelling ? "Cancelling..." : "Cancel Booking"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessDisplay;