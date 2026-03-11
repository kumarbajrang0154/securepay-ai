export function parseUPI(qr) {

  if (!qr || !qr.startsWith("upi://")) {
    return null;
  }

  const params = new URLSearchParams(qr.split("?")[1]);

  return {
    upiId: params.get("pa") || "Unknown",
    merchant: params.get("pn") || "Unknown Merchant",
    amount: params.get("am") || "Not specified",
    currency: params.get("cu") || "INR"
  };

}