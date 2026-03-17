import Booking from "../models/bookingModel.js";
import ParkingSlot from "../models/parkingSlotModel.js";

export const expireBookings = async () => {
  const now = new Date();

  const expired = await Booking.find({
    status: "reserved",
    checkedIn: false,
    endTime: { $lt: now }
  });

  for (const booking of expired) {
    booking.status = "NO_SHOW";
    await booking.save();

    await ParkingSlot.findByIdAndUpdate(booking.slot, {
      status: "AVAILABLE",
      currentBooking: null,
      lockedAt: null
    });
  }
};