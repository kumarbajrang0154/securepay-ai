import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import NeuralNetworkBackground from "../components/NeuralNetworkBackground"
import RiskMeter from "../components/RiskMeter"
import UPIAppPicker from "../components/UPIAppPicker"
import SmartWarningCard from "../components/SmartWarningCard"

export default function RiskResultPage() {

  const navigate = useNavigate()
  const [showAppPicker, setShowAppPicker] = useState(false)

  const fraudScore = Number(localStorage.getItem("fraudScore")) || 0
  const parsedUPI = JSON.parse(localStorage.getItem("parsedUPI")) || {}
  const communityReports = Number(localStorage.getItem("communityReports")) || 0
  const previouslyReported = localStorage.getItem("previouslyReported") === "true"
  const isBlacklisted = localStorage.getItem("isBlacklisted") === "true"
  const storedRiskLevel = localStorage.getItem("riskLevel")
  const warnings = JSON.parse(localStorage.getItem("warnings")) || []
  const behaviorStats = JSON.parse(localStorage.getItem("behaviorStats")) || {}

  const riskLevel = storedRiskLevel || (
    fraudScore > 60 ? "FRAUD" :
    fraudScore > 30 ? "SUSPICIOUS" :
    "SAFE"
  )

  const handleReport = () => {
    navigate("/report-fraud")
  }

  const handleContinue = async () => {
    // Track payment attempt
    const mobile = localStorage.getItem("mobile") || "+919876543210"; // Default for demo

    try {
      const response = await fetch('http://localhost:5001/api/track-payment-attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile,
          upiId: parsedUPI.upiId
        })
      });

      if (response.ok) {
        console.log("Payment attempt tracked successfully");
      }
    } catch (error) {
      console.error("Failed to track payment attempt:", error);
    }

    // Open app picker
    setShowAppPicker(true);
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

          {isBlacklisted && (
            <div className="mt-4 bg-red-500/20 border-2 border-red-500 rounded-lg p-4 text-red-400 text-center mb-4">
              <div className="text-2xl font-bold mb-2">🚫 BLACKLISTED UPI</div>
              <div>This merchant has been reported by many SecurePay AI users and is considered highly dangerous.</div>
            </div>
          )}

          {previouslyReported && (
            <div className="mt-4 bg-orange-500/10 border border-orange-500 rounded-lg p-3 text-orange-400 text-center">
              ⚠ You previously reported this QR as fraud.
            </div>
          )}

          <RiskMeter score={fraudScore} />

          {/* Smart Warning Card */}
          <SmartWarningCard
            warnings={warnings}
            behaviorStats={behaviorStats}
            fraudScore={fraudScore}
            riskLevel={riskLevel}
          />

          {communityReports >= 3 && (
            <div className="mt-4 bg-yellow-500/10 border border-yellow-500 rounded-lg p-3 text-yellow-400 text-center">
              ⚠ COMMUNITY FRAUD ALERT<br />
              This UPI ID has been reported by {communityReports} SecurePay AI users.
            </div>
          )}

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
              className="py-3 bg-green-500 rounded-lg hover:bg-green-600 transition font-semibold"
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

      {/* UPI App Picker Modal */}
      {showAppPicker && (
        <UPIAppPicker
          upiId={parsedUPI.upiId}
          merchant={parsedUPI.merchant}
          amount={parsedUPI.amount}
          onClose={() => setShowAppPicker(false)}
        />
      )}

    </div>

  )

}