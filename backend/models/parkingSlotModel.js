import mongoose from "mongoose";

const parkingSlotSchema = new mongoose.Schema({
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingArea",
    required: true
  },

  slotType: {
    type: String,
    enum: ["2W", "4W"],
    required: true
  },

  // Visual Coordinates
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },


  slotNumber: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["AVAILABLE", "RESERVED", "OCCUPIED"],
    default: "AVAILABLE"
  },

  currentBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    default: null
  }
}, { timestamps: true });

export default mongoose.model("ParkingSlot", parkingSlotSchema);