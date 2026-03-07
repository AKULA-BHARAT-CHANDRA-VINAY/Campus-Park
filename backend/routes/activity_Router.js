import express from "express";
import Activity from "../models/activitiesModel.js";

const router = express.Router();

// GET all activities (with filters + pagination)
router.get("/", async (req, res) => {
  try {
    const { type, search, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (type && type !== "all") {
      filter.type = type;
    }

    if (search) {
      filter.$or = [
        { user: { $regex: search, $options: "i" } },
        { action: { $regex: search, $options: "i" } },
        { zone: { $regex: search, $options: "i" } }
      ];
    }

    const activities = await Activity.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Activity.countDocuments(filter);

    res.json({
      activities,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;