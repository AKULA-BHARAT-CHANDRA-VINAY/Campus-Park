import { useEffect, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { SlotGrid } from "../components/SlotGrid";
import { mapSlotStatus } from "../utils/slotStatus";
import BookingSuccessDisplay from "./BookingSuccessDisplay";

/* ======================
   Types
====================== */
interface Area {
  _id: string;
  name: string;
}

interface Slot {
  id: string;
  label: string;
  status: "available" | "booked" | "occupied";
  type: "Car" | "Bike" | "Road" | "Walkway" | "None";
  row: number;
  col: number;
}

/* ======================
   Component
====================== */
const ManualBooking = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("");

  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [vehicleType, setVehicleType] = useState<"2W" | "4W">("4W");

  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [arrivalTime, setArrivalTime] = useState("");
  const [currentBooking, setCurrentBooking] = useState<any>(null);

  /* ======================
     1️⃣ SOCKET CONNECTION
  ====================== */
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("slotUpdated", ({ slotId, status }) => {
      setSlots(prev =>
        prev.map(slot =>
          slot.id === slotId
            ? { ...slot, status: mapSlotStatus(status) }
            : slot
        )
      );

      if (
        selectedSlot?.id === slotId &&
        mapSlotStatus(status) !== "available"
      ) {
        setSelectedSlot(null);
        alert("Slot was booked by another user.");
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [selectedSlot]);

  /* ======================
     2️⃣ FETCH AREAS & ACTIVE BOOKINGS
  ====================== */
  useEffect(() => {
    // Fetch Areas
    const fetchAreas = async () => {
      try {
        const res = await axios.get("/api/parking/areas");
        setAreas(res.data.areas);
      } catch (err) {
        console.error("Error fetching areas", err);
      }
    };

    // Fetch Active Booking
    const fetchActiveBooking = async () => {
      try {
        const res = await axios.get("/api/parking/active", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.data?.booking) {
          setCurrentBooking(res.data.booking);
        }
      } catch (err) {
        console.error("Error fetching active booking", err);
      }
    };

    fetchAreas();
    fetchActiveBooking();
  }, []);

  /* ======================
     3️⃣ FETCH SLOTS
  ====================== */
  useEffect(() => {
    if (!selectedArea) return;

    const fetchSlots = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `/api/parking/areas/${selectedArea}/slots`
        );

        const formattedSlots: Slot[] = res.data.slots.map(
          (slot: any, index: number) => ({
            id: slot._id,
            label: slot.slotNumber,
            status: mapSlotStatus(slot.status),
            type: slot.slotType,
            row: Math.floor(index / 10),
            col: index % 10,
          })
        );

        setSlots(formattedSlots);
        setSelectedSlot(null);
      } catch (err) {
        console.error("Error fetching slots", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedArea]);

  /* ======================
     4️⃣ HANDLE BOOKING
  ====================== */
  const handleBooking = async () => {
    if (!selectedSlot || loading || !selectedArea) return;

    try {
      setLoading(true);

      let startTime = new Date();
      if (arrivalTime) {
        const [hours, minutes] = arrivalTime.split(":").map(Number);
        startTime.setHours(hours, minutes, 0, 0);
      }

      const res = await axios.post(
        "/api/parking/create",
        {
          slotId: selectedSlot.id,
          vehicleType,
          startTime: startTime.toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const areaObj = areas.find((a) => a._id === selectedArea);

      const booking = res.data.booking;
      booking.qrCodeUrl = res.data.qrCode;
      booking.slot = { slotNumber: selectedSlot.label };
      booking.area = { name: areaObj?.name || "Unknown Area" };
      booking.vehicleType = vehicleType;

      setCurrentBooking(booking);
      setSelectedSlot(null);
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
        "Booking failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelection = (slot: Slot) => {
    setSelectedSlot(slot);
    if (!selectedArea) {
      alert("Please select a zone first!");
      return;
    }

    if (window.confirm(`Do you want to confirm the booking for slot ${slot.label}?`)) {
      // Trigger booking flow immediately with this slot
      executeBookingForSlot(slot);
    } else {
      setSelectedSlot(null);
    }
  };

  const executeBookingForSlot = async (slot: Slot) => {
    if (loading || !selectedArea) return;

    try {
      setLoading(true);

      let startTime = new Date();
      if (arrivalTime) {
        const [hours, minutes] = arrivalTime.split(":").map(Number);
        startTime.setHours(hours, minutes, 0, 0);
      }

      const res = await axios.post(
        "/api/parking/create",
        {
          slotId: slot.id,
          vehicleType,
          startTime: startTime.toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const areaObj = areas.find((a) => a._id === selectedArea);

      const booking = res.data.booking;
      booking.qrCodeUrl = res.data.qrCode;
      booking.slot = { slotNumber: slot.label };
      booking.area = { name: areaObj?.name || "Unknown Area" };
      booking.vehicleType = vehicleType;

      setCurrentBooking(booking);
      setSelectedSlot(null);
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
        "Booking failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col">
      {currentBooking && (
        <BookingSuccessDisplay
          booking={{
            _id: currentBooking._id || currentBooking.id,
            slot: currentBooking.slot,
            area: currentBooking.area,
            qrCodeUrl: currentBooking.qrCodeUrl,
            vehicleType: currentBooking.vehicleType,
            startTime: currentBooking.startTime,
            endTime: currentBooking.endTime,
          }}
          onClose={() => setCurrentBooking(null)}
          onBookingCancelled={() => {
            setCurrentBooking(null);
            setSelectedSlot(null);
            if (selectedArea) {
              // trigger a refresh
              setSelectedArea(selectedArea);
            }
          }}
        />
      )}
      {/* Header */}
      <header className="px-8 py-5 flex items-center justify-between bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl sticky top-0">
        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400">
          Manual Parking Booking
        </h1>
      </header>

      <main className="flex-1 max-w-[1920px] mx-auto p-4 md:p-6 grid lg:grid-cols-[340px_1fr] gap-6 overflow-hidden w-full">
        {/* LEFT PANEL */}
        <div className="space-y-4 order-2 lg:order-1 h-full flex flex-col overflow-y-auto pb-20">
          {/* Area Selection */}
          <div className="bg-zinc-900/30 p-5 rounded-3xl border border-zinc-800/50">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
              Select Zone
            </h3>
            <select
              className="w-full bg-zinc-900/50 border border-zinc-800/50 text-zinc-300 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
            >
              <option value="">Select Area</option>
              {areas.map(area => (
                <option key={area._id} value={area._id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Type */}
          <div className="bg-zinc-900/30 p-5 rounded-3xl border border-zinc-800/50">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
              Vehicle Type
            </h3>
            <select
              className="w-full bg-zinc-900/50 border border-zinc-800/50 text-zinc-300 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
              value={vehicleType}
              onChange={e =>
                setVehicleType(e.target.value as "4W" | "2W")
              }
            >
              <option value="4W">Car (4-Wheeler)</option>
              <option value="2W">Bike (2-Wheeler)</option>
            </select>
          </div>

          {/* Arrival Time */}
          <div className="bg-zinc-900/30 p-5 rounded-3xl border border-zinc-800/50">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
              Arrival Time
            </h3>
            <input
              type="time"
              min="06:00"
              max="15:30"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800/50 text-zinc-300 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
            />
            <p className="text-[10px] text-zinc-500 mt-2">Select arrival between 06:00 AM - 03:30 PM. Defaults to 'Now'.</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="order-1 lg:order-2 flex flex-col h-full overflow-hidden">
          <div className="flex-1 bg-zinc-900/20 rounded-[2.5rem] border border-zinc-800/50 p-2 md:p-4 flex items-center justify-center overflow-y-auto">
            <SlotGrid
              slots={slots}
              selectedSlot={selectedSlot}
              onSelectSlot={handleSlotSelection}
              selectedVehicleType={vehicleType}
              shakingSlotId={null}
              rotate={false}
              compact={false}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManualBooking;