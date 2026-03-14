// server/src/utils/qrParser.js

export function parseQR(qrData) {

  if (!qrData) {
    return {
      merchant: "Unknown",
      upiId: "",
      amount: "0",
      currency: "INR"
    };
  }

  try {

    // Ensure it is UPI QR
    if (!qrData.startsWith("upi://")) {
      return {
        merchant: "Unknown",
        upiId: "",
        amount: "0",
        currency: "INR"
      };
    }

    const queryString = qrData.split("?")[1];

    const params = new URLSearchParams(queryString);

    return {
      merchant: params.get("pn") || "Unknown Merchant",
      upiId: params.get("pa") || "",
      amount: params.get("am") || "0",
      currency: params.get("cu") || "INR"
    };

  } catch (error) {

    console.error("QR Parse Error:", error);

    return {
      merchant: "Unknown",
      upiId: "",
      amount: "0",
      currency: "INR"
    };

  }

}