// Fraud Detection Engine

function analyzeFraud(data) {
  let fraudScore = 0;
  let warnings = [];

  const merchant = (data.merchant || "").toLowerCase();
  const upiId = (data.upiId || "").toLowerCase();
  const amount = Number(data.amount || 0);

  // Suspicious keywords
  const suspiciousKeywords = [
    "gift",
    "reward",
    "free",
    "offer",
    "bonus",
    "lottery"
  ];

  for (const word of suspiciousKeywords) {
    if (merchant.includes(word)) {
      fraudScore += 30;
      warnings.push("Suspicious merchant keyword detected");
      break;
    }
  }

  // Suspicious UPI ID
  if (upiId.includes("scam") || upiId.includes("test")) {
    fraudScore += 25;
    warnings.push("Suspicious UPI ID detected");
  }

  // High amount
  if (amount > 3000) {
    fraudScore += 20;
    warnings.push("High payment request");
  }

  // Zero amount trick
  if (amount === 0) {
    fraudScore += 10;
    warnings.push("Zero amount request (possible scam)");
  }

  return {
    fraudScore,
    warnings
  };
}

export default analyzeFraud;