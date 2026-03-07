import express from "express";
import axios from "axios";

const router = express.Router();

const ML_BASE = "http://localhost:6000";

/* ===== Layout Generation ===== */
router.post("/layout", async (req, res) => {
  try {
    const response = await axios.post(`${ML_BASE}/layout`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Layout ML error" });
  }
});

/* ===== Demand Prediction ===== */
router.post("/predict", async (req, res) => {
  try {
    const response = await axios.post(`${ML_BASE}/predict`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Prediction ML error" });
  }
});

/* ===== Rebalance ===== */
router.get("/rebalance", async (req, res) => {
  try {
    const response = await axios.get(`${ML_BASE}/rebalance`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Rebalance ML error" });
  }
});

export default router;