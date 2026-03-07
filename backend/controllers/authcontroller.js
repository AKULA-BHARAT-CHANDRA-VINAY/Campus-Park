import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import OTP from "../models/otpModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { detectUserRole } from "../utils/detectUserRole.js";

const generateOTP = () =>
  crypto.randomInt(100000, 999999).toString();

const mkToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

// REGISTER

// Send OTP
export const register = async (req, res) => {
  const { fullname, regNo, email, phone, birthDate, password } = req.body;
  const role = detectUserRole(regNo);
  if (!regNo || !email || !password)
    return res.status(400).json({ success: false, message: "All fields required" });

  const exists = await User.findOne({
    $or: [{ email }, { regNo }]
  });

  if (exists)
    return res.status(400).json({
      success: false,
      message: "User already exists with this email or registration number"
    });

  const hashed = await bcrypt.hash(password, 10);

  const imagePath = req.file ? `/uploads/profile-images/${req.file.filename}` : "";

  await User.create({
    fullname,
    regNo,
    email,
    phone,
    birthDate,
    password: hashed,
    role,
    profileImage: imagePath,
    isVerified: false,
    firstLoginDone: false
  });

  const otp = generateOTP();

  await OTP.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  await sendEmail(email, "Verify Account", `OTP: ${otp}`);

  res.json({
    success: true,
    message: "OTP sent to email"
  });
};


// Verify Register OTP
export const verifyRegisterOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = await OTP.findOne({ email, otp });
  if (!record || record.expiresAt < Date.now())
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

  await User.findOneAndUpdate(
    { email },
    { isVerified: true }
  );

  await OTP.deleteMany({ email });

  res.json({
    success: true,
    message: "Email verified successfully"
  });
};


// LOGIN 
// Sending Login OTP
export const login = async (req, res) => {
  const { regNo, password } = req.body;

  const user = await User.findOne({ regNo });
  if (!user)
    return res.status(401).json({ success: false, message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ success: false, message: "Invalid credentials" });

  // First time login → OTP required
  if (!user.firstLoginDone) {
    const otp = generateOTP();

    await OTP.create({
      email: user.email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    await sendEmail(
      user.email,
      "First-time Login OTP",
      `Your OTP is ${otp}`
    );

    return res.json({
      success: true,
      message: "First-time login OTP sent",
      email: user.email
    });

  }

  // Normal login (no OTP)
  const token = mkToken({ id: user._id });

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      fullname: user.fullname,
      regNo: user.regNo
    }
  });
};


// Verify Login OTP
export const verifyLoginOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = await OTP.findOne({ email, otp });

  if (!record || record.expiresAt < Date.now()) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP"
    });
  }

  const user = await User.findOne({ email });

  user.firstLoginDone = true;
  await user.save();

  await OTP.deleteMany({ email });

  const token = mkToken({
    id: user._id,
    role: user.role
  });


  res.json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      fullname: user.fullname,
      regNo: user.regNo,
      role: user.role
    }
  });
};

// 🔐 Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { regNo, password } = req.body;

    if (!regNo || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide regNo and password"
      });
    }

    const admin = await User.findOne({ regNo, role: "admin" });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found"
      });
    }

    // ✅ Correct password comparison
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        token: "admin-token-" + Date.now(), // temporary demo token
        user: {
          id: admin._id,
          name: admin.fullname,
          regNo: admin.regNo,
          role: admin.role
        }
      }
    });

  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// ===============================
// FORGOT PASSWORD - SEND OTP
// ===============================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ success: false, message: "Email required" });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const otp = crypto.randomInt(100000, 999999).toString();

  await OTP.deleteMany({ email }); // clear old OTPs

  await OTP.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  await sendEmail(email, "Reset Password OTP", `Your OTP is ${otp}`);

  res.json({
    success: true,
    message: "OTP sent to email"
  });
};


// ===============================
// VERIFY RESET OTP
// ===============================
export const verifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = await OTP.findOne({ email, otp });

  if (!record || record.expiresAt < Date.now()) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP"
    });
  }

  res.json({
    success: true,
    message: "OTP verified"
  });
};


// ===============================
// RESET PASSWORD
// ===============================
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword)
    return res.status(400).json({
      success: false,
      message: "Email and new password required"
    });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  await OTP.deleteMany({ email });

  res.json({
    success: true,
    message: "Password reset successful"
  });
};