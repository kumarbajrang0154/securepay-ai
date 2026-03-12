import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Navbar from "../components/Navbar"
import NeuralNetworkBackground from "../components/NeuralNetworkBackground"

import { analyzeQR } from "../utils/fraudDetection"
import { parseUPI } from "../utils/upiParser"

export default function QRUploadPage() {

  const navigate = useNavigate()

  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [qrData, setQrData] = useState("")

  const handleImage = (e) => {

    const file = e.target.files[0]

    if (!file) return

    setImage(file)

    const reader = new FileReader()

    reader.onload = () => {
      setPreview(reader.result)
    }

    reader.readAsDataURL(file)

  }

  const handleAnalyze = () => {

    if (!qrData) {
      alert("Enter QR data manually for now")
      return
    }

    const parsed = parseUPI(qrData)
    const fraudScore = analyzeQR(qrData)

    localStorage.setItem("scannedQR", qrData)
    localStorage.setItem("fraudScore", fraudScore)
    localStorage.setItem("parsedUPI", JSON.stringify(parsed))

    const oldTransactions =
      JSON.parse(localStorage.getItem("transactions")) || []

    const newTransaction = {
      qr: qrData,
      score: fraudScore,
      date: new Date().toLocaleString()
    }

    oldTransactions.unshift(newTransaction)

    localStorage.setItem(
      "transactions",
      JSON.stringify(oldTransactions)
    )

    navigate("/analyzing")

  }

  return (

    <div className="relative min-h-screen text-white">

      <NeuralNetworkBackground />
      <Navbar />

      <div className="relative z-10 max-w-3xl mx-auto mt-12 px-6">

        <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3 text-sm mb-6 text-blue-400 text-center">
          🤖 AI Image Scanner Ready
        </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg text-center">

          <h1 className="text-2xl font-bold mb-6">
            Upload QR Code Image
          </h1>

          {/* UPLOAD AREA */}

          <label className="block border-2 border-dashed border-cyan-400 rounded-xl p-12 cursor-pointer hover:bg-white/5 transition">

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />

            {/* NEW ICON */}

            <div className="flex flex-col items-center justify-center gap-3">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-14 h-14 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 15a4 4 0 014-4h1a5 5 0 019.9-1A4.5 4.5 0 0121 15a3 3 0 01-3 3H7a4 4 0 01-4-3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V8m0 0l-3 3m3-3l3 3"
                />
              </svg>

              <p className="text-gray-400 text-sm">
                Drag & drop QR image or click to upload
              </p>

            </div>

          </label>

          {/* IMAGE PREVIEW */}

          {preview && (

            <div className="mt-6">

              <img
                src={preview}
                alt="preview"
                className="mx-auto rounded-lg max-h-64 border border-white/10"
              />

            </div>

          )}

          {/* MANUAL QR INPUT */}

          <div className="mt-6">

            <p className="text-sm text-gray-400 mb-2">
              Paste QR data (optional)
            </p>

            <input
              value={qrData}
              onChange={(e) => setQrData(e.target.value)}
              placeholder="upi://pay?..."
              className="w-full p-2 rounded bg-black/40 border border-white/10"
            />

          </div>

          {/* ANALYZE BUTTON */}

          <button
            onClick={handleAnalyze}
            className="mt-6 w-full py-3 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition"
          >
            Analyze QR with AI
          </button>

        </div>

      </div>

    </div>

  )

}