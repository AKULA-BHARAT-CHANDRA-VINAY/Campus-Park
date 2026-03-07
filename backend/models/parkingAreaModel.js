import mongoose from "mongoose";

const parkingAreaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  description: {
    type: String
  },

  // WHO can use this area
  allowedRoles: {
    type: [String],
    enum: ["student", "faculty", "outsider"],
    required: true
  },

  slotsConfig: {
    twoWheeler: {
      type: Number,
      default: 0
    },
    fourWheeler: {
      type: Number,
      default: 0
    }
  },
  location: {
    lat: Number,
    lng: Number
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("ParkingArea", parkingAreaSchema);