import express from "express";
import ParkingArea from "../models/parkingAreaModel.js";
import ParkingSlot from "../models/parkingSlotModel.js";
import { cancelBooking, getActiveBooking, createBooking } from "../controllers/bookingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/cancel", protect, cancelBooking);
router.get("/active", protect, getActiveBooking);
router.post("/create", protect, createBooking);

// Get all parking areas
router.get("/areas", async (req, res) => {
  try {
    const areas = await ParkingArea.find({});
    res.json(areas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch areas" });
  }
});

// Get slots for a specific area
router.get("/areas/:areaId/slots", async (req, res) => {
  try {
    const { areaId } = req.params;
    const slots = await ParkingSlot.find({ area: areaId }).sort({ slotNumber: 1 });
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch slots" });
  }
});

// Book a slot
router.post("/slots/:slotId/book", async (req, res) => {
  try {
    const { slotId } = req.params;
    const slot = await ParkingSlot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.status && slot.status !== "available") {
      return res.status(400).json({ message: `Slot is ${slot.status}` });
    }

    slot.status = "booked"; // Mark as booked
    await slot.save();
    res.json({ message: "Slot booked successfully", slot });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to book slot" });
  }
});

export default router;