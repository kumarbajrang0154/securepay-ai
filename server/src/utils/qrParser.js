export function parseQR(qrData) {
  try {
    if (!qrData) {
      return {
        merchant: "Unknown",
        upiId: "",
        amount: 0,
      };
    }

    // Check if it is UPI format
    if (qrData.startsWith("upi://")) {
      const url = new URL(qrData);

      const merchant = url.searchParams.get("pn") || "Unknown Merchant";
      const upiId = url.searchParams.get("pa") || "";
      const amount = Number(url.searchParams.get("am")) || 0;

      return {
        merchant,
        upiId,
        amount,
      };
    }

    // If not UPI QR
    return {
      merchant: "Unknown",
      upiId: "",
      amount: 0,
    };
  } catch (error) {
    console.error("QR parse error:", error);

    return {
      merchant: "Unknown",
      upiId: "",
      amount: 0,
    };
  }
}