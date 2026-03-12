import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import NeuralNetworkBackground from "../components/NeuralNetworkBackground";

import { analyzeQR } from "../utils/fraudDetection";
import { parseUPI } from "../utils/upiParser";

export default function QRScannerPage() {

  const navigate = useNavigate();

  const [result, setResult] = useState("");
  const [manualQR, setManualQR] = useState("");
  const [torch, setTorch] = useState(false);

  const processQR = (qrText) => {

    const parsed = parseUPI(qrText);
    const fraudScore = analyzeQR(qrText);

    localStorage.setItem("scannedQR", qrText);
    localStorage.setItem("fraudScore", fraudScore);
    localStorage.setItem("parsedUPI", JSON.stringify(parsed));

    const oldTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];

    const newTransaction = {
      qr: qrText,
      score: fraudScore,
      date: new Date().toLocaleString()
    };

    oldTransactions.unshift(newTransaction);

    localStorage.setItem(
      "transactions",
      JSON.stringify(oldTransactions)
    );

    navigate("/analyzing");
  };

  const handleScan = (data) => {

    if (data) {

      const qrText = data.text;

      setResult(qrText);

      processQR(qrText);

    }

  };

  const handleManualSubmit = () => {

    if (manualQR.trim() !== "") {
      processQR(manualQR);
    }

  };

  return (
    <div className="relative min-h-screen text-white">

      <NeuralNetworkBackground />
      <Navbar />

      <div className="relative z-10 max-w-3xl mx-auto mt-12 px-6">

        {/* AI STATUS */}

        <div className="bg-green-500/10 border border-green-500 rounded-lg p-3 text-sm mb-6 text-green-400 text-center">

          🛡 AI Protection Active • Fraud Detection Enabled

        </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg text-center">

          <h1 className="text-2xl font-bold mb-6">
            Scan Payment QR Code
          </h1>

          {/* CAMERA SCANNER */}

          <div className="relative rounded-xl overflow-hidden">

            <QrReader
              constraints={{
                facingMode: "environment",
                advanced: [{ torch }]
              }}
              onResult={(result, error) => {

                if (!!result) {
                  handleScan(result);
                }

              }}
              style={{ width: "100%" }}
            />

            {/* SCAN FRAME */}

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

              <div className="w-60 h-60 border-4 border-cyan-400 rounded-xl animate-pulse"></div>

            </div>

          </div>

          <p className="mt-4 text-gray-400 text-sm">
            Align QR code inside the frame
          </p>

          {/* TORCH BUTTON */}

          <button
            onClick={() => setTorch(!torch)}
            className="mt-4 bg-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-600 transition"
          >
            {torch ? "Turn Flash Off" : "Turn Flash On"}
          </button>

          {/* SCANNED RESULT */}

          {result && (

            <div className="mt-6 bg-black/40 p-3 rounded-lg text-sm break-all">

              {result}

            </div>

          )}

          {/* MANUAL INPUT */}

          <div className="mt-8">

            <p className="text-gray-400 text-sm mb-2">
              Or paste QR data manually
            </p>

            <input
              value={manualQR}
              onChange={(e) => setManualQR(e.target.value)}
              placeholder="upi://pay?..."
              className="w-full p-2 rounded bg-black/40 border border-white/10"
            />

            <button
              onClick={handleManualSubmit}
              className="mt-3 w-full py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
            >
              Analyze QR
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}