export const parseUPIQR = (qrString) => {
  try {
    if (!qrString.includes("upi://")) {
      return null;
    }

    const queryString = qrString.split("?")[1];
    const params = new URLSearchParams(queryString);

    return {
      upiId: params.get("pa") || "",
      merchantName: params.get("pn") || "",
      amount: params.get("am") || "",
      currency: params.get("cu") || "INR",
    };
  } catch (error) {
    console.error("QR Parse Error:", error);
    return null;
  }
};