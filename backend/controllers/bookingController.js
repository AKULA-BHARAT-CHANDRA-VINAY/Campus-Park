import Booking from "../models/bookingModel.js";
import ParkingArea from "../models/parkingAreaModel.js";
import ParkingSlot from "../models/parkingSlotModel.js";
import { generateBookingQR } from "../utils/generateQR.js";
import { io } from "../server.js";

// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { slotId, vehicleType, startTime: reqStartTime } = req.body;
    const userId = req.user.id;

    const startTime = reqStartTime ? new Date(reqStartTime) : new Date();
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 min grace period

    // Check user already has active booking
    const activeBooking = await Booking.findOne({
      user: userId,
      status: { $in: ["reserved", "active"] },
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) }
    });

    if (activeBooking) {
      return res.status(400).json({
        success: false,
        message: "User already has an active booking"
      });
    }

    // ❌ CHECK SLOT OVERLAP (CRITICAL)
    const overlappingSlotBooking = await Booking.findOne({
      slot: slotId,
      status: { $in: ["reserved", "active"] },
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) }
    });

    if (overlappingSlotBooking) {
      return res.status(409).json({
        success: false,
        message: "Slot already booked for this time range"
      });
    }

    // Check slot availability
    const slot = await ParkingSlot.findOneAndUpdate(
      { _id: slotId, status: "AVAILABLE" },
      { status: "RESERVED" },
      { new: true }
    );

    if (!slot) {
      return res.status(409).json({
        success: false,
        message: "Slot already reserved by another user"
      });
    }

    //  VEHICLE TYPE COMPATIBILITY CHECK
    if (slot.slotType !== vehicleType) {
      return res.status(400).json({
        success: false,
        message: `This slot is for ${slot.slotType} vehicles only`
      });
    }

    // 🔐 ROLE-BASED ACCESS CHECK
    const area = await ParkingArea.findById(slot.area);

    if (!area.allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to book parking in this area"
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      slot: slotId,
      startTime,
      endTime,
      status: "reserved"
    });

    // Update slot status
    slot.currentBooking = booking._id;
    await slot.save();

    // Status updation
    io.emit("slotUpdated", {
      slotId: slotId,
      status: "booked"
    });

    // Generate QR Code
    const qrCode = await generateBookingQR(booking._id);
    booking.qrCode = qrCode;
    await booking.save();

    res.status(201).json({
      success: true,
      booking,
      qrCode
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ENTRY CONFIRMATION (QR SCAN AT ENTRY)
export const confirmEntry = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("slot");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status !== "reserved") {
      return res.status(400).json({ success: false, message: "Invalid booking state" });
    }

    booking.status = "active";
    await booking.save();

    const slot = await ParkingSlot.findById(booking.slot._id).populate("area");
    slot.status = "ACTIVE";
    await slot.save();

    io.emit("slotUpdated", {
      slotId: slot._id,
      status: "ACTIVE"
    });

    // Notify user frontend
    io.emit("bookingActivated", {
      bookingId: booking._id,
      areaLocation: slot.area.location,
      areaName: slot.area.name
    });

    res.json({ success: true, message: "Entry confirmed" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Entry confirmation failed" });
  }
};

// EXIT CONFIRMATION (QR SCAN AT EXIT)
export const confirmExit = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("slot");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    booking.status = "completed";
    await booking.save();

    const slot = await ParkingSlot.findById(booking.slot._id);
    slot.status = "AVAILABLE";
    slot.currentBooking = null;
    await slot.save();

    io.emit("slotUpdated", {
      slotId: slot._id,
      status: "AVAILABLE"
    });

    // Notify user frontend
    io.emit("bookingCompleted", {
      bookingId: booking._id
    });

    res.json({ success: true, message: "Exit confirmed" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Exit confirmation failed" });
  }
};

// FLASH BOOKING (Automated)
export const flashBooking = async (req, res) => {
  try {
    const { vehicleType, areaId, startTime: reqStartTime } = req.body;
    const userId = req.user.id;

    const startTime = reqStartTime ? new Date(reqStartTime) : new Date();
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 min grace period

    const slot = await ParkingSlot.findOne({
      area: areaId,
      slotType: vehicleType,
      status: "AVAILABLE"
    }).sort({ slotNumber: 1 }); // Sequential fill

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "No slots available for Flash Booking"
      });
    }

    //Best Slot Finding Logic
    // const slots = await ParkingSlot.find({
    //   area: areaId,
    //   slotType: vehicleType,
    //   status: "AVAILABLE"
    // });

    // if (!slots.length) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No slots available for Flash Booking"
    //   });
    // }

    // const area = await ParkingArea.findById(areaId);

    // // calculate distance from entry
    // const bestSlot = slots
    //   .map(slot => ({
    //     slot,
    //     distance: Math.sqrt(
    //       Math.pow(slot.x - area.entryX, 2) +
    //       Math.pow(slot.y - area.entryY, 2)
    //     )
    //   }))
    //   .sort((a, b) => a.distance - b.distance)[0].slot;


    // 2. Create Booking (Reuse logic or direct create)
    // We'll mark slot RESERVED immediately
    slot.status = "AVAILABLE";
    await slot.save();

    const booking = await Booking.create({
      user: userId,
      slot: slot._id,
      startTime,
      endTime,
      status: "reserved",
      bookingMode: "FLASH" // Add this field to schema later if needed
    });

    slot.currentBooking = booking._id;
    await slot.save();

    io.emit("slotUpdated", {
      slotId: slot._id,
      status: "AVAILABLE"
    });

    const qrCode = await generateBookingQR(booking._id);
    booking.qrCode = qrCode;
    await booking.save();

    res.status(201).json({
      success: true,
      booking,
      qrCode,
      bookingId: booking._id,
      message: "Flash Booking Successful"
    });

  } catch (error) {
    console.error("Flash Booking Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET BOOKING STATS (For ML Model)
export const getBookingStats = async (req, res) => {
  try {
    // Return last 24h or 7d bookings
    const bookings = await Booking.find()
      .populate('slot')
      .sort({ createdAt: -1 })
      .limit(1000);

    res.json({ success: true, bookings });
  } catch (error) { // <--- Added catch block here
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
};

// 1. Get all parking areas (for the Department Cards)
export const getAllAreas = async (req, res) => {
  try {
    const areas = await ParkingArea.find({ isActive: true });
    res.json({ success: true, areas });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching areas" });
  }
};

// 2. Get all slots for a specific area (for the Slot Grid)
export const getSlotsByArea = async (req, res) => {
  try {
    const { areaId } = req.params;
    const slots = await ParkingSlot.find({ area: areaId });
    res.json({ success: true, slots });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching slots" });
  }
};

// GET ACTIVE BOOKING
export const getActiveBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const activeBooking = await Booking.findOne({
      user: userId,
      status: { $in: ["reserved"] },
      endTime: { $gt: now }
    }).populate({
      path: "slot",
      populate: { path: "area" }
    }).sort({ createdAt: -1 });

    if (!activeBooking) {
      return res.status(200).json({ success: true, booking: null });
    }

    // Format to inject area inside the response for frontend
    const formattedBooking = activeBooking.toObject();
    if (formattedBooking.slot && formattedBooking.slot.area) {
      formattedBooking.area = formattedBooking.slot.area;
    }

    res.status(200).json({
      success: true,
      booking: formattedBooking
    });
  } catch (error) {
    console.error("Get Active Booking Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// CANCEL BOOKING
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findOne({ _id: bookingId, user: userId });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status !== "reserved") {
      return res.status(400).json({ success: false, message: "Cannot cancel a booking that is already active/completed/cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Free the slot
    const slot = await ParkingSlot.findById(booking.slot);
    if (slot) {
      slot.status = "AVAILABLE";
      slot.currentBooking = null;
      await slot.save();

      io.emit("slotUpdated", {
        slotId: slot._id,
        status: "AVAILABLE"
      });
    }

    res.status(200).json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
