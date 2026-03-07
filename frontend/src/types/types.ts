export type AppState = 'intro' | 'auth-form' | 'landing' | 'contact' | 'dashboard' | 'booking-details';
export type Role = 'Faculty' | 'Student';

export interface Booking {
  _id: string;

  // Backend times
  startTime: string;
  endTime: string;

  status: "reserved" | "active" | "completed" | "cancelled";

  slot: {
    _id: string;
    slotNumber: string;
  } | string;

  qrCode?: string;

  createdAt: string;
  updatedAt: string;

  // ⬇️ KEEP THESE if still used elsewhere
  bookingTime?: string;
  validTill?: string;
  sessionId?: string;
  department?: string;
  slotType?: string;
  slotIndex?: number;
}

export interface Department {
  id: string;
  name: string;
  image: string;
  type: 'Mixed' | '2W' | '4W';
  slots: {
    '2W': number;
    '4W': number;
  };
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  display: string;
  startMinutes: number;
}