export type SlotStatus = "available" | "booked" | "occupied";

export function mapSlotStatus(
  status: "AVAILABLE" | "RESERVED" | "OCCUPIED"
): SlotStatus {
  if (status === "AVAILABLE") return "available";
  if (status === "RESERVED") return "booked";
  return "occupied";
}