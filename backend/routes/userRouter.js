import express from 'express';
import { getProfile, getAllUsers } from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/all", protect, adminOnly, getAllUsers);

export default router;