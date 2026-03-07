import QRCode from "qrcode";

export const generateBookingQR = async (bookingId) => {
  const qrData = JSON.stringify({
    bookingId,
    issuedAt: Date.now()
  });

  return await QRCode.toDataURL(qrData);
};