import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    zone: {
      type: String,
      default: "N/A"
    },
    type: {
      type: String,
      enum: [
        "entry",
        "exit",
        "alert",
        "user",
        "slot",
        "update",
        "system",
        "security"
      ],
      required: true
    }
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;