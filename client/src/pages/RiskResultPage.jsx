import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import NeuralNetworkBackground from "../components/NeuralNetworkBackground"
import RiskMeter from "../components/RiskMeter"

export default function RiskResultPage() {

  const navigate = useNavigate()

  const fraudScore = Number(localStorage.getItem("fraudScore")) || 0
  const parsedUPI = JSON.parse(localStorage.getItem("parsedUPI")) || {}

  const riskLevel =
    fraudScore > 60 ? "FRAUD" :
    fraudScore > 30 ? "SUSPICIOUS" :
    "SAFE"

  const handleReport = () => {
    navigate("/report-fraud")
  }

  const handleContinue = () => {

    if(parsedUPI.upiId){
      window.location.href = `upi://pay?pa=${parsedUPI.upiId}`
    }

  }

  const handleScanAgain = () => {
    navigate("/scan")
  }

  const handleDashboard = () => {
    navigate("/dashboard")
  }

  return (

    <div className="relative min-h-screen text-white">

      <NeuralNetworkBackground/>
      <Navbar/>

      <div className="relative z-10 max-w-xl mx-auto mt-16">

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg text-center">

          <h1 className="text-2xl font-bold mb-6">
            QR Fraud Analysis Result
          </h1>

          <RiskMeter score={fraudScore} />

          <p className="mt-4 text-green-400 font-semibold">
            Risk Level: {riskLevel}
          </p>

          <div className="mt-6 bg-black/40 p-4 rounded-lg text-left">

            <p><b>Merchant:</b> {parsedUPI.merchant || "Unknown"}</p>
            <p><b>UPI ID:</b> {parsedUPI.upiId || "Unknown"}</p>
            <p><b>Amount:</b> ₹{parsedUPI.amount || "Not specified"}</p>
            <p><b>Currency:</b> INR</p>

          </div>

          <div className="mt-6 text-sm text-gray-400">
            AI analysis detected unusual payment behavior.
            Please verify the merchant before making payment.
          </div>

          {/* ACTION BUTTONS */}

          <div className="grid grid-cols-2 gap-4 mt-8">

            <button
              onClick={handleReport}
              className="py-3 bg-red-500 rounded-lg hover:bg-red-600 transition"
            >
              Report Fraud
            </button>

            <button
              onClick={handleContinue}
              className="py-3 bg-green-500 rounded-lg hover:bg-green-600 transition"
            >
              Continue Anyway
            </button>

            <button
              onClick={handleScanAgain}
              className="py-3 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition"
            >
              Scan Another QR
            </button>

            <button
              onClick={handleDashboard}
              className="py-3 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </button>

          </div>

        </div>

      </div>

    </div>

  )

}