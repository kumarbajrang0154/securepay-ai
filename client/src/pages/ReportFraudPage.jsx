import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import NeuralNetworkBackground from "../components/NeuralNetworkBackground"
import { reportFraud } from "../services/apiService"

export default function ReportFraudPage() {

  const parsed = JSON.parse(localStorage.getItem("parsedUPI")) || {};

  const [merchant, setMerchant] = useState(parsed.merchant || "")
  const [upiId, setUpiId] = useState(parsed.upiId || "")
  const [amount, setAmount] = useState(parsed.amount || "")
  const [reason, setReason] = useState("")
  const [screenshot, setScreenshot] = useState(null)
  const [previouslyReported, setPreviouslyReported] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const mobile = localStorage.getItem("userMobile");
    if (!mobile) {
      alert("Please login first to access this page");
      window.location.href = "/login";
      return;
    }

    // Check if QR data is available
    const qrData = localStorage.getItem("scannedQR");
    if (!qrData) {
      alert("Please scan or upload a QR code first");
      window.location.href = "/dashboard";
      return;
    }

    // Show badge if previously reported by this user
    const prev = localStorage.getItem("previouslyReported") === "true";
    setPreviouslyReported(prev);
  }, [])

  const handleSubmit = async () => {

    if (!upiId || !reason) {
      alert("UPI ID and reason are required");
      return;
    }

    // Validate UPI ID format
    if (!upiId.includes("@")) {
      alert("Please enter a valid UPI ID (e.g., merchant@upi)");
      return;
    }

    const mobile = localStorage.getItem("userMobile");
    console.log("userMobile from localStorage:", mobile);
    if (!mobile) {
      alert("Please login first to report fraud");
      return;
    }

    const qrData = localStorage.getItem("scannedQR");
    console.log("scannedQR from localStorage:", qrData);
    if (!qrData) {
      alert("No QR data found. Please scan a QR first.");
      return;
    }

    try {
      const dataToSend = {
        mobile,
        merchant,
        upiId,
        amount: Number(amount) || 0,
        reason,
        qrData
      };
      console.log("Sending fraud report data:", dataToSend);
      await reportFraud(dataToSend);

      alert("Fraud reported successfully");
      navigate("/my-fraud");
    } catch (error) {
      console.error("Fraud report error:", error);
      alert(error.message || "Error reporting fraud");
    }

  };

  return (

    <div className="relative min-h-screen text-white">

      <NeuralNetworkBackground />
      <Navbar />

      <div className="relative z-10 max-w-3xl mx-auto mt-12 px-4">

        <h1 className="text-2xl font-bold mb-6">
          Report Suspicious QR
        </h1>

        {/* WARNING PANEL */}

        {previouslyReported && (
          <div className="bg-orange-500/10 border border-orange-500 rounded-lg p-3 text-sm mb-6 text-orange-400">
            ⚠ You previously reported this QR as fraud.
          </div>
        )}

        <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-sm mb-6 text-red-400">

          ⚠ If you believe a QR code is fraudulent, report it here to help protect other users.

        </div>

        {/* FORM */}

        <div className="bg-white/10 border border-white/10 rounded-xl p-6 backdrop-blur-lg space-y-4">

          {/* MERCHANT */}

          <div>
            <label className="text-sm text-gray-400">Merchant Name</label>
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="Example Store"
              className="w-full mt-1 p-2 rounded bg-black/40 border border-white/10"
            />
          </div>

          {/* UPI */}

          <div>
            <label className="text-sm text-gray-400">UPI ID *</label>
            <input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="merchant@upi"
              className="w-full mt-1 p-2 rounded bg-black/40 border border-white/10"
              required
            />
          </div>

          {/* AMOUNT */}

          <div>
            <label className="text-sm text-gray-400">Amount (optional)</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="₹500"
              className="w-full mt-1 p-2 rounded bg-black/40 border border-white/10"
            />
          </div>

          {/* REASON */}

          <div>
            <label className="text-sm text-gray-400">Reason *</label>

            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-black/40 border border-white/10"
            >

              <option value="">Select reason</option>
              <option value="fake_merchant">Fake Merchant</option>
              <option value="payment_request">Unexpected Payment Request</option>
              <option value="scam">Scam / Fraud</option>
              <option value="other">Other</option>

            </select>

          </div>

          {/* SCREENSHOT */}

          <div>
            <label className="text-sm text-gray-400">Upload Screenshot</label>

            <input
              type="file"
              onChange={(e) => setScreenshot(e.target.files[0])}
              className="w-full mt-1 text-sm"
            />

          </div>

          {/* SUBMIT */}

          <button
            onClick={handleSubmit}
            className="w-full py-3 mt-4 bg-red-500 rounded-lg hover:bg-red-600 transition"
          >
            Submit Fraud Report
          </button>

        </div>

      </div>

    </div>

  )

}