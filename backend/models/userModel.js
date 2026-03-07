import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },

  regNo: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: String,
  birthDate: Date,

  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["student", "faculty", "outsider", "admin"],
    required: true
  },
  profileImage: {
    type: String,
    default: "/uploads/profile-images/default_img.jpg"
    
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  firstLoginDone: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);