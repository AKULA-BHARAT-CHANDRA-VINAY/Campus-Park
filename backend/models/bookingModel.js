import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  guestInfo: {
    name: String,
    vehicleNumber: String,
    phone: String
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingSlot"
  },
  startTime: Date,
  endTime: Date,
  status: {
    type: String,
    enum: ["reserved", "active", "completed", "cancelled", "NO_SHOW"],
    default: "reserved"
  },
  qrCode: String,
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkedInAt: Date
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);