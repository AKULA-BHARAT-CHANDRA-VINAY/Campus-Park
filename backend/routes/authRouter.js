import express from "express";
import {
  register,
  verifyRegisterOTP,
  login,
  verifyLoginOTP
} from "../controllers/authcontroller.js";
import {
  forgotPassword,
  verifyResetOTP,
  resetPassword
} from "../controllers/authcontroller.js";
import { uploadProfileImage } from "../middlewares/uploadMiddleware.js";

import { adminLogin } from "../controllers/authcontroller.js";

const router = express.Router();

// REGISTER (with profile image upload)
router.post(
  "/register",
  uploadProfileImage.single("profileImage"),
  register
);

// REGISTER OTP VERIFY
router.post("/register/verify", verifyRegisterOTP);

// LOGIN
router.post("/login", login);

// LOGIN OTP VERIFY
router.post("/login/verify", verifyLoginOTP);
router.post("/admin-login", adminLogin);
//forgot-password
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

export default router;