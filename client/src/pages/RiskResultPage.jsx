import { useNavigate, useLocation } from "react-router-dom";

export default function RiskResultPage() {

  const navigate = useNavigate();
  const location = useLocation();

  // Example data (later API se ayega)
  const result = location.state || {
    merchant: "XYZ Store",
    amount: "500",
    upi: "xyz@upi",
    probability: 82
  };

  const getRiskLevel = () => {
    if (result.probability > 70) return "HIGH";
    if (result.probability > 40) return "MEDIUM";
    return "SAFE";
  };

  const riskLevel = getRiskLevel();

  const riskColor =
    riskLevel === "HIGH"
      ? "text-red-500"
      : riskLevel === "MEDIUM"
      ? "text-yellow-500"
      : "text-green-500";

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-lg">

        <h2 className="text-2xl font-bold text-center mb-8">
          AI Fraud Risk Analysis
        </h2>

        {/* Risk Meter */}
        <div className="text-center mb-8">

          <div className="relative w-40 h-40 mx-auto rounded-full border-[10px] border-gray-200 flex items-center justify-center">

            <span className="text-3xl font-bold">
              {result.probability}%
            </span>

          </div>

          <p className={`mt-4 font-semibold text-lg ${riskColor}`}>
            {riskLevel} RISK
          </p>

        </div>

        {/* Details */}
        <div className="space-y-3 text-sm">

          <div className="flex justify-between">
            <span className="text-gray-500">Merchant</span>
            <span className="font-medium">{result.merchant}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-medium">₹{result.amount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">UPI ID</span>
            <span className="font-medium">{result.upi}</span>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">

          <button
            onClick={() => navigate("/report-fraud")}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
          >
            Report Fraud
          </button>

          <button
            onClick={() => navigate("/home")}
            className="flex-1 bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-800 transition"
          >
            Go Back
          </button>

        </div>

      </div>

    </div>
  );
}