import { useState } from "react"
import Navbar from "../components/Navbar"
import NeuralNetworkBackground from "../components/NeuralNetworkBackground"

export default function ReportFraudPage() {

  const [merchant, setMerchant] = useState("")
  const [upiId, setUpiId] = useState("")
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [screenshot, setScreenshot] = useState(null)

  const handleSubmit = async () => {

const parsed =
JSON.parse(localStorage.getItem("parsedUPI")) || {};

await fetch(
"http://localhost:5000/api/report",
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({

mobile: localStorage.getItem("userMobile"),

merchant: parsed.merchant,

upiId: parsed.upiId,

amount: parsed.amount,

reason,

qrData: localStorage.getItem("scannedQR")

})
}
);

alert("Fraud reported successfully");

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