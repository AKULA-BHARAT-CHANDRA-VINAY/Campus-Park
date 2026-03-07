import cron from "node-cron";
import { expireBookings } from "./expireBookings.js";
import { midnightReset } from "./midnightReset.js";

// Keep existing 5 minute interval for NO-SHOW expiry 
cron.schedule("*/5 * * * *", async () => {
  console.log("Running booking expiry check...");
  await expireBookings();
});

// Add new Daily Midnight refresh for all slots
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily midnight parking reset...");
  await midnightReset();
});