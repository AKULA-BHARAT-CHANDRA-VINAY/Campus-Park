import React, { useEffect, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { Users, LogOut, Zap, MapPin, Bike, Car } from "lucide-react";
import { SlotGrid } from "../components/SlotGrid";
import { mapSlotStatus } from "../utils/slotStatus";
import { cn } from "../utils/cn";
import BookingSuccessDisplay from "../components/BookingSuccessDisplay";

interface DashboardProps {
  onBack: () => void;
  onExitScanner: () => void;
  onScannerSuccess?: (data: any) => void;
}

interface Area {
  _id: string;
  name: string;
}

interface Slot {
  id: string;
  label: string;
  status: "available" | "booked" | "occupied";
  type: "2W" | "4W";
  row: number;
  col: number;
}
interface Booking {
  slot: string;
  vehicleType: "2W" | "4W";
  startTime: string;
  endTime: string;
  area: { name: string };
}

const Dashboard: React.FC<DashboardProps> = ({ onBack, onExitScanner, onScannerSuccess }) => {
  const [username, setUsername] = useState("");
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [vehicleType, setVehicleType] = useState<"2W" | "4W">("2W");

  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(false);
  const [arrivalTime, setArrivalTime] = useState("");

  const [currentBooking, setCurrentBooking] = useState<any>(null);
  /* ======================
     AUTH
  ====================== */
  useEffect(() => {
    const user = localStorage.getItem("username");
    if (!user) {
      onBack();
      return;
    }
    setUsername(user);

    // Fetch active bookings
    axios.get("/api/parking/active", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(res => {
      if (res.data?.booking) {
        setCurrentBooking(res.data.booking);
      }
    }).catch(err => console.error(err));
  }, []);

  /* ======================
     SOCKET
  ====================== */
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("slotUpdated", ({ slotId, status }) => {
      setSlots(prev =>
        prev.map(slot =>
          slot.id === slotId
            ? { ...slot, status: mapSlotStatus(status) }
            : slot
        )
      );
    });

    socket.on("bookingActivated", (data) => {
      // Check if this user's current booking was activated
      setCurrentBooking((prevBooking: any) => {
        if (prevBooking && (prevBooking._id === data.bookingId || prevBooking.id === data.bookingId)) {
          if (onScannerSuccess) {
            onScannerSuccess(data);
          }
          return { ...prevBooking, status: 'active' };
        }
        return prevBooking;
      });
    });

    socket.on("bookingCompleted", (data) => {
      setCurrentBooking((prevBooking: any) => {
        if (prevBooking && (prevBooking._id === data.bookingId || prevBooking.id === data.bookingId)) {
          alert("Exit scan successful. We hope to see you again soon!");
          return null;
        }
        return prevBooking;
      });
    });

    return () => {
      socket.disconnect();   // ✅ cleanup function
    };
  }, []);

  /* ======================
     FETCH AREAS
  ====================== */
  useEffect(() => {
    axios.get("/api/parking/areas", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(res => {
      setAreas(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  /* ======================
     FETCH SLOTS
  ====================== */
  useEffect(() => {
    if (!selectedArea) return;

    setLoading(true);
    axios.get(
      `/api/parking/areas/${selectedArea._id}/slots`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    ).then(res => {
      const formatted: Slot[] = Array.isArray(res.data)
        ? res.data.map((slot: any, i: number) => ({
          id: slot._id,
          label: slot.slotNumber,
          status: mapSlotStatus(slot.status),
          type: slot.slotType as "2W" | "4W",
          row: Math.floor(i / 10),
          col: i % 10,
        }))
        : [];
      setSlots(formatted);
    })
      .finally(() => setLoading(false));
  }, [selectedArea]);

  /* ======================
     BOOK SLOT
  ====================== */
  const confirmBooking = async (slotToBook: Slot) => {
    if (!slotToBook || !selectedArea) return;

    try {
      let startTime = new Date();
      if (arrivalTime) {
        const [hours, minutes] = arrivalTime.split(":").map(Number);
        startTime.setHours(hours, minutes, 0, 0);
      }

      const res = await axios.post(
        "/api/parking/create",
        {
          slotId: slotToBook.id,
          vehicleType,
          startTime: startTime.toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const booking = res.data.booking;
      booking.qrCodeUrl = res.data.qrCode;
      booking.slot = { slotNumber: slotToBook.label };
      booking.area = { name: selectedArea.name };
      booking.vehicleType = vehicleType;

      setCurrentBooking(booking);
      setSelectedSlot(null);
    } catch (err: any) {
      console.error("Booking error:", err);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  const handleSlotSelection = (slot: Slot) => {
    setSelectedSlot(slot);
    if (!selectedArea) {
      alert("Please select a zone first!");
      return;
    }

    if (window.confirm(`Do you want to confirm the booking for slot ${slot.label}?`)) {
      confirmBooking(slot);
    } else {
      setSelectedSlot(null);
    }
  };

  /* ======================
     FLASH BOOKING
  ====================== */
  const autoBook = async () => {
    if (!selectedArea) return;

    try {
      let startTime = new Date();
      if (arrivalTime) {
        const [hours, minutes] = arrivalTime.split(":").map(Number);
        startTime.setHours(hours, minutes, 0, 0);
      }

      const res = await axios.post(
        "/api/booking/flash",
        {
          areaId: selectedArea._id,
          vehicleType,
          startTime: startTime.toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const booking = res.data.booking;
      booking.qrCodeUrl = res.data.qrCode;

      // The backend returns slot id in booking.slot. We'll find it from slots array if possible.
      const bookedSlot = slots.find(s => s.id === booking.slot) || { label: "Assigned by Flash" };
      booking.slot = { slotNumber: bookedSlot.label };
      booking.area = { name: selectedArea.name };
      booking.vehicleType = vehicleType;

      setCurrentBooking(booking);
    } catch (err: any) {
      console.error("Flash booking error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Flash booking failed");
    }
  };

  /* ======================
     LOGOUT
  ====================== */
  const logout = () => {
    localStorage.clear();
    onBack();
  };

  return (
    // <div className="h-screen bg-zinc-950 text-zinc-100 flex flex-col">
    //   <header className="px-6 py-4 flex justify-between items-center border-b border-white/5">
    //     <div className="flex gap-3 items-center">
    //       <button onClick={onBack}>← Back</button>
    //       <h1 className="font-black text-xl">Campus Park</h1>
    //     </div>
    //     <div className="flex gap-3 items-center">
    //       <button onClick={onExitScanner} className="bg-red-600 px-3 py-2 rounded">
    //         Exit Scanner
    //       </button>
    //       <span className="font-bold">{username}</span>
    //       <button onClick={logout}>
    //         <LogOut size={18} />
    //       </button>
    //     </div>
    //   </header>

    //   <main className="flex-1 grid lg:grid-cols-[300px_1fr] gap-6 p-6">
    //     <aside className="space-y-4">
    //       {areas.length > 0 && areas.map(a => (
    //         <button
    //           key={a._id}
    //           onClick={() => setSelectedArea(a)}
    //           className={cn(
    //             "w-full p-4 rounded-xl border",
    //             selectedArea?._id === a._id
    //               ? "border-emerald-500 bg-zinc-800"
    //               : "border-zinc-800"
    //           )}
    //         >
    //           {a.name}
    //         </button>
    //       ))}

    //       <button onClick={autoBook} className="w-full bg-emerald-500 py-3 rounded">
    //         <Zap className="inline mr-2" />
    //         Auto Book
    //       </button>
    //     </aside>

    //     <section className="bg-zinc-900/30 rounded-3xl p-4">
    //       {selectedArea ? (
    //         <>
    //           <div className="flex gap-3 mb-4">
    //             <button onClick={() => setVehicleType("2W")}>2W</button>
    //             <button onClick={() => setVehicleType("4W")}>4W</button>
    //           </div>

    //           <SlotGrid
    //             slots={slots}
    //             selectedSlot={selectedSlot}
    //             onSelectSlot={setSelectedSlot}
    //             selectedVehicleType={vehicleType}
    //             shakingSlotId={null}
    //             rotate={false}
    //             compact={false}
    //             loading={loading}
    //           />

    //           {selectedSlot && (
    //             <button
    //               onClick={confirmBooking}
    //               className="mt-4 w-full bg-emerald-500 py-3 rounded font-bold"
    //             >
    //               Confirm Booking
    //             </button>
    //           )}
    //         </>
    //       ) : (
    //         <div className="h-full flex items-center justify-center text-zinc-600">
    //           <MapPin size={48} />
    //         </div>
    //       )}
    //     </section>
    //   </main>
    // </div>

    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="px-8 py-5 flex flex-col md:flex-row justify-between items-center bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5 z-50 gap-6 sticky top-0 shadow-2xl">

        {/* Title */}
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-zinc-400 hover:text-white transition-colors">
            ← Back
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 tracking-tighter drop-shadow-lg">
              Campus Park
            </h1>
            <p className="text-zinc-400 text-xs font-bold tracking-[0.2em] uppercase mt-0.5">
              Smart Park Assist
            </p>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 bg-zinc-900/80 p-1.5 rounded-full border border-white/5 shadow-inner hidden sm:flex">
          <div className="flex items-center gap-2 px-2 md:px-4 py-2 rounded-full bg-zinc-950 border border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            <span className="text-zinc-300 text-[10px] md:text-xs font-bold tracking-wider">AVAILABLE</span>
          </div>
          <div className="flex items-center gap-2 px-2 md:px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
            <span className="text-zinc-500 text-[10px] md:text-xs font-bold tracking-wider">BOOKED</span>
          </div>
          <div className="flex items-center gap-2 px-2 md:px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <span className="text-zinc-500 text-[10px] md:text-xs font-bold tracking-wider">OCCUPIED</span>
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">

          <div className="flex items-center gap-3 bg-zinc-900/80 px-5 py-3 rounded-2xl border border-white/5 shadow-lg">
            <Users size={18} className="text-emerald-400" />
            <span className="text-zinc-200 font-bold">{username}</span>
          </div>

          <button
            onClick={logout}
            className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-2xl border border-red-500/20 transition-colors"
          >
            <LogOut size={18} className="text-red-400" />
          </button>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1 max-w-[1920px] mx-auto p-4 md:p-6 flex flex-col lg:grid lg:grid-cols-[340px_1fr] gap-6 overflow-y-auto lg:overflow-hidden w-full">
        {currentBooking ? (
          <div className="col-span-full h-full flex items-center justify-center">
            <BookingSuccessDisplay
              booking={{
                _id: currentBooking._id || currentBooking.id,
                slot: currentBooking.slot,
                area: currentBooking.area,
                qrCodeUrl: currentBooking.qrCodeUrl || currentBooking.qrCode,
                vehicleType: currentBooking.vehicleType || currentBooking.slotType,
                startTime: currentBooking.startTime,
                endTime: currentBooking.endTime,
              }}
              onClose={() => setCurrentBooking(null)}
              onBookingCancelled={() => {
                setCurrentBooking(null);
                if (selectedArea) {
                  setSelectedArea({ ...selectedArea });
                }
              }}
            />
          </div>
        ) : (
          <>
            {/* ========== SIDEBAR ========== */}
            <aside className="space-y-4 h-auto lg:h-full flex flex-col lg:overflow-y-auto lg:pb-20 shrink-0">

              {/* Zone Selection */}
              <div className="bg-zinc-900/30 p-5 rounded-3xl border border-zinc-800/50 backdrop-blur-sm">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                  Select Zone
                </h3>
                <div className="flex flex-col gap-2">
                  {areas.map(a => (
                    <button
                      key={a._id}
                      onClick={() => setSelectedArea(a)}
                      className={cn(
                        "group flex items-center justify-between px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 border-2",
                        selectedArea?._id === a._id
                          ? "bg-zinc-800 border-emerald-500/50 text-white shadow-lg"
                          : "bg-zinc-900/50 border-transparent text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                      )}
                    >
                      <span>{a.name}</span>
                      {selectedArea?._id === a._id && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              {/* Vehicle Type Selection */}
              <div className="bg-zinc-900/30 p-5 rounded-3xl border border-zinc-800/50 shadow-sm backdrop-blur-sm">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                  Vehicle Type
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setVehicleType("2W")}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300",
                      vehicleType === "2W"
                        ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
                    )}
                  >
                    <Bike
                      size={24}
                      className={vehicleType === "2W" ? "text-emerald-400" : "text-zinc-600"}
                    />
                    <span
                      className={cn(
                        "mt-2 text-sm font-medium",
                        vehicleType === "2W" ? "text-emerald-100" : "text-zinc-500"
                      )}
                    >
                      2W
                    </span>
                  </button>

                  <button
                    onClick={() => setVehicleType("4W")}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300",
                      vehicleType === "4W"
                        ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
                    )}
                  >
                    <Car
                      size={24}
                      className={vehicleType === "4W" ? "text-emerald-400" : "text-zinc-600"}
                    />
                    <span
                      className={cn(
                        "mt-2 text-sm font-medium",
                        vehicleType === "4W" ? "text-emerald-100" : "text-zinc-500"
                      )}
                    >
                      4W
                    </span>
                  </button>
                </div>
              </div>

              {/* Arrival Time Selection */}
              <div className="bg-zinc-900/30 p-5 rounded-3xl border border-zinc-800/50 shadow-sm backdrop-blur-sm">
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
                <p className="text-[10px] text-zinc-500 mt-2">Bookings allowed between 06:00 AM - 03:30 PM. Defaults to 'Now'.</p>
              </div>

              {/* Auto Book */}
              <button
                onClick={autoBook}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-black font-bold rounded-xl shadow-lg hover:from-emerald-500 hover:to-emerald-400 transition-all"
              >
                <Zap size={18} className="inline mr-2" />
                Auto Book Best Slot
              </button>
            </aside>

            {/* ========== SLOT GRID AREA ========== */}
            <section className="bg-zinc-900/20 rounded-[2.5rem] border border-zinc-800/50 p-4 lg:overflow-hidden min-h-[400px] flex flex-col">
              {selectedArea ? (
                <>
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
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-600">
                  <MapPin size={48} />
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;