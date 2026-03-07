import Booking from "../models/bookingModel.js";
import ParkingSlot from "../models/parkingSlotModel.js";
import User from "../models/userModel.js";
import { io } from "../server.js";

import ParkingArea from "../models/parkingAreaModel.js";
import { generateLayout } from "../utils/layoutGenerator.js";

// Create Area with Dynamic Slots
export const createArea = async (req, res) => {
  try {
    const { name, totalWidth, totalLength, ratio2W } = req.body;

    // 1. Create Area
    const area = await ParkingArea.create({
      name,
      totalWidth: totalWidth || 50, // Default 50m
      totalLength: totalLength || 50, // Default 50m
      slots: [] // Will populate later
    });

    // 2. Generate Layout
    // ratio2W is the admin preference (e.g. 0.7 for 70% bikes)
    const rawSlots = generateLayout(area.totalWidth, area.totalLength, ratio2W || 0.6);

    // 3. Format for DB
    const parkingSlots = rawSlots.map((s, index) => ({
      area: area._id,
      slotType: s.slotType,
      x: s.x,
      y: s.y,
      width: s.width,
      height: s.height,
      slotNumber: `${s.slotType}-${index + 1}`,
      status: "AVAILABLE"
    }));

    // 4. Bulk Insert
    const createdSlots = await ParkingSlot.insertMany(parkingSlots);

    // 5. Update Area with Slot IDs
    area.slots = createdSlots.map(s => s._id);
    await area.save();

    res.status(201).json({
      success: true,
      data: {
        area,
        totalSlots: createdSlots.length,
        slots: createdSlots
      }
    });

  } catch (error) {
    console.error("Create Area Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const verifyQR = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findOne({ sessionId: bookingId }).populate("slot");

    if (!booking)
      return res.status(404).json({ success: false, message: "Invalid QR" });

    if (booking.checkedIn) {
      // Handle EXIT
      if (booking.status === "completed") {
        return res.status(400).json({ success: false, message: "Booking already completed" });
      }

      booking.status = "completed";
      await booking.save();

      if (booking.slot) {
        booking.slot.status = "AVAILABLE";
        booking.slot.currentBooking = null;
        await booking.slot.save();

        io.emit("slotUpdated", {
          slotId: booking.slot._id,
          status: "AVAILABLE"
        });
      }

      return res.json({
        success: true,
        message: "Exit verified",
        booking
      });
    }

    const now = new Date();
    // Allow a small grace period if needed, or stick to strict timing
    if (now > booking.endTime)
      return res.status(400).json({ success: false, message: "Booking has expired" });

    booking.checkedIn = true;
    booking.checkedInAt = now;
    booking.status = "active";
    await booking.save();

    if (booking.slot) {
      booking.slot.status = "OCCUPIED";
      await booking.slot.save();

      io.emit("slotUpdated", {
        slotId: booking.slot._id,
        status: "OCCUPIED"
      });
    }

    res.json({
      success: true,
      message: "Entry allowed",
      booking
    });
  } catch (error) {
    console.error("Verify QR Error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// Get Live Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const totalParkingAreas = await ParkingArea.countDocuments();
    const totalSlots = await ParkingSlot.countDocuments();
    const occupiedSlots = await ParkingSlot.countDocuments({ status: "OCCUPIED" });
    const availableSlots = await ParkingSlot.countDocuments({ status: "AVAILABLE" });

    // Today stats
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayEntries = await Booking.countDocuments({
      checkedIn: true,
      checkedInAt: { $gte: startOfDay }
    });

    const todayExits = await Booking.countDocuments({
      status: "completed",
      updatedAt: { $gte: startOfDay }
    });

    const zoneData = await ParkingSlot.aggregate([
      {
        $group: {
          _id: "$area",
          total: { $sum: 1 },
          occupied: {
            $sum: {
              $cond: [{ $eq: ["$status", "OCCUPIED"] }, 1, 0]
            }
          }
        }
      }
    ]);

    const formattedZoneData = zoneData.map(z => ({
      zone: z._id,
      occupancy: Math.round((z.occupied / z.total) * 100)
    }));


    res.json({
      success: true,
      data: {
        totalUsers,
        totalParkingAreas,
        totalSlots,
        occupiedSlots,
        availableSlots,
        todayEntries,
        todayExits,
        zoneOccupancy: formattedZoneData
      }
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};

export const getParkingAreas = async (req, res) => {
  try {
    const areas = await ParkingArea.find().populate("slots");

    res.json({
      success: true,
      data: areas
    });

  } catch (error) {
    console.error("Get Areas Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch areas" });
  }
};


export const updateParkingArea = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedArea = await ParkingArea.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedArea) {
      return res.status(404).json({
        success: false,
        message: "Area not found"
      });
    }

    res.json({
      success: true,
      data: updatedArea
    });

  } catch (error) {
    console.error("Update Area Error:", error);
    res.status(500).json({ success: false, message: "Failed to update area" });
  }
};

export const deleteParkingArea = async (req, res) => {
  try {
    const { id } = req.params;

    const area = await ParkingArea.findById(id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found"
      });
    }

    // Delete all slots belonging to this area
    await ParkingSlot.deleteMany({ area: id });

    // Delete area
    await area.deleteOne();

    res.json({
      success: true,
      message: "Area and associated slots deleted successfully"
    });

  } catch (error) {
    console.error("Delete Area Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete area" });
  }
};
