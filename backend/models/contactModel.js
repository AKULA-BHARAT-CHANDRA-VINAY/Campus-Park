import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },

  regNo: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  replied: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);