import express from "express";
import {
  sendMessage,
  getAllMessages
} from "../controllers/contactController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";
const router = express.Router();

// User sends message
router.post("/", protect, sendMessage);

// Admin fetches messages
router.get("/", protect, adminOnly, getAllMessages);

export default router;