export const getRiskColor = (riskLevel) => {
  if (riskLevel === "RED") return "bg-red-500";
  if (riskLevel === "YELLOW") return "bg-yellow-500";
  return "bg-green-500";
};

export const getRiskMessage = (riskLevel) => {
  if (riskLevel === "RED")
    return "High probability of fraud. Avoid making this payment.";

  if (riskLevel === "YELLOW")
    return "Suspicious transaction detected. Verify before paying.";

  return "Transaction appears safe.";
};