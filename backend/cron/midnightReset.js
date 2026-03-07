import Booking from "../models/bookingModel.js";
import ParkingSlot from "../models/parkingSlotModel.js";

export const midnightReset = async () => {
    try {
        console.log("Starting midnight parking reset...");

        // First, clear ALL active, reserved, or no-show bookings in the DB
        // We mark any incomplete/ongoing bookings as "completed" (or cancelled) to end their lifecycle.
        await Booking.updateMany(
            { status: { $in: ["reserved", "active", "NO_SHOW"] } },
            { $set: { status: "completed" } }
        );
        console.log("All unfinished bookings marked completed.");

        // Second, free ALL slots in the parking lot regardless of their current status
        await ParkingSlot.updateMany(
            {},
            {
                $set: {
                    status: "AVAILABLE",
                    currentBooking: null,
                    lockedAt: null
                }
            }
        );
        console.log("All parking slots are now AVAILABLE.");

    } catch (error) {
        console.error("Error during Midnight Parking Reset:", error);
    }
};
