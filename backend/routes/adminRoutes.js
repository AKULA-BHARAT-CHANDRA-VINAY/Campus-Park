import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/roleMiddleware.js";
import { 
  createArea,
  getDashboardStats,
  getParkingAreas,
  updateParkingArea,
  deleteParkingArea
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/areas", protect, adminOnly, getParkingAreas);
router.post("/create-area", protect, adminOnly, createArea);
router.put("/update-area/:id", protect, adminOnly, updateParkingArea);
router.delete("/delete-area/:id", protect, adminOnly, deleteParkingArea);

export default router;