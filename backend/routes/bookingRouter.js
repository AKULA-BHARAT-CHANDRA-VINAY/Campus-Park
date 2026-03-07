import express from "express";
import { createBooking } from "../controllers/bookingController.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getAllAreas,
  getSlotsByArea,
  flashBooking,
  getBookingStats,
  confirmEntry,
  confirmExit,
  getActiveBooking,
  cancelBooking
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/areas", protect, getAllAreas);

// Scanner Gate endpoints (unprotected for physical gate access)
router.post("/entry", confirmEntry);
router.post("/exit", confirmExit);
router.post("/create", protect, createBooking);
router.post("/flash", protect, flashBooking);
router.get("/stats", protect, getBookingStats);
router.get("/active", protect, getActiveBooking);
router.post("/cancel", protect, cancelBooking);

router.post("/guest", createBooking);

export default router;