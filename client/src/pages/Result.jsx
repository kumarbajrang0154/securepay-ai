import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {

  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p>No analysis data found</p>
      </div>
    );
  }

  const riskColor =
    data.riskLevel === "SAFE"
      ? "text-green-400"
      : data.riskLevel === "SUSPICIOUS"
      ? "text-yellow-400"
      : "text-red-500";

  const riskBg =
    data.riskLevel === "SAFE"
      ? "bg-green-500/20"
      : data.riskLevel === "SUSPICIOUS"
      ? "bg-yellow-500/20"
      : "bg-red-500/20";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">

      <h1 className="text-3xl font-bold mb-6 text-cyan-400">
        SecurePay AI Analysis
      </h1>

      <div className={`w-full max-w-md p-6 rounded-xl border border-cyan-500 ${riskBg}`}>

        <h2 className="text-xl font-semibold mb-4">Merchant Info</h2>

        <p className="mb-2">
          <span className="text-gray-400">Merchant:</span> {data.merchant}
        </p>

        <p className="mb-2">
          <span className="text-gray-400">UPI ID:</span> {data.upiId}
        </p>

        <p className="mb-4">
          <span className="text-gray-400">Amount:</span> ₹{data.amount}
        </p>

        <hr className="border-gray-700 mb-4" />

        <h2 className="text-xl font-semibold mb-3">Fraud Detection</h2>

        {/* Fraud Score Gauge */}
        <p className="text-gray-400 mb-2">
          Fraud Score
        </p>

        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">

          <div
            className={`h-full ${
              data.riskLevel === "SAFE"
                ? "bg-green-400"
                : data.riskLevel === "SUSPICIOUS"
                ? "bg-yellow-400"
                : "bg-red-500"
            }`}
            style={{
              width: `${data.fraudScore}%`
            }}
          />

        </div>

        <p className="mt-2 text-lg font-semibold">
          {data.fraudScore}%
        </p>

        <p className={`text-lg font-bold mt-2 ${riskColor}`}>
          Risk Level: {data.riskLevel}
        </p>

        {/* Reasons */}
        {data.reasons && data.reasons.length > 0 && (
          <div className="mt-4">

            <h3 className="text-lg font-semibold mb-2">
              Reasons
            </h3>

            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {data.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>

          </div>
        )}

      </div>

      <div className="flex gap-4 mt-6">

        <button
          onClick={() =>
            navigate("/report", {
              state: data
            })
          }
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-semibold"
        >
          Report QR
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-cyan-500 hover:bg-cyan-600 text-black px-5 py-2 rounded-lg font-semibold"
        >
          Back to Dashboard
        </button>

      </div>

    </div>
  );
}