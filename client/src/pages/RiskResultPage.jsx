import Navbar from "../components/Navbar";
import NeuralNetworkBackground from "../components/NeuralNetworkBackground";
import RiskMeter from "../components/RiskMeter";

export default function RiskResultPage() {

  const fraudScore =
    parseInt(localStorage.getItem("fraudScore")) || 0;

  const parsedUPI =
    JSON.parse(localStorage.getItem("parsedUPI")) || {};

  const getRiskLabel = () => {
    if (fraudScore < 40) return "SAFE";
    if (fraudScore < 70) return "SUSPICIOUS";
    return "HIGH RISK";
  };

  const getRiskColor = () => {
    if (fraudScore < 40) return "text-green-400";
    if (fraudScore < 70) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="relative min-h-screen text-white">

      <NeuralNetworkBackground />
      <Navbar />

      <div className="relative z-10 max-w-3xl mx-auto mt-16 px-6">

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg">

          <h1 className="text-2xl font-bold mb-8 text-center">
            QR Fraud Analysis Result
          </h1>

          {/* FRAUD METER */}

          <div className="flex justify-center mb-8">
            <RiskMeter score={fraudScore} />
          </div>

          {/* RISK LABEL */}

          <div className={`text-center text-lg font-semibold mb-8 ${getRiskColor()}`}>
            Risk Level: {getRiskLabel()}
          </div>

          {/* QR DETAILS */}

          <div className="space-y-3 text-gray-300 bg-black/40 p-4 rounded-lg">

            <p><b>Merchant:</b> {parsedUPI.merchant || "Unknown Merchant"}</p>

            <p><b>UPI ID:</b> {parsedUPI.upiId || "Unknown"}</p>

            <p><b>Amount:</b> ₹{parsedUPI.amount || "Not specified"}</p>

            <p><b>Currency:</b> {parsedUPI.currency || "INR"}</p>

          </div>

          {/* AI MESSAGE */}

          <div className="mt-8 p-4 bg-black/40 rounded-lg text-sm text-gray-300 text-center">

            AI analysis detected unusual payment behavior.  
            Please verify the merchant before making any payment.

          </div>

          {/* ACTION BUTTONS */}

          <div className="mt-8 flex gap-4">

            <button className="flex-1 py-3 bg-red-500 rounded-lg hover:bg-red-600 transition">
              Report Fraud
            </button>

            <button className="flex-1 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition">
              Continue Anyway
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
