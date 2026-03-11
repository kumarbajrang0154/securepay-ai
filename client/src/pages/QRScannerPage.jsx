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

  const handleScan = (data) => {

    if (data) {

      const qrText = data.text;

      setResult(qrText);

      const parsed = parseUPI(qrText);

      const fraudScore = analyzeQR(qrText);

      // store scan data
      localStorage.setItem("scannedQR", qrText);
      localStorage.setItem("fraudScore", fraudScore);
      localStorage.setItem("parsedUPI", JSON.stringify(parsed));

      // save transaction history
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

      // go to AI analyzing screen
      navigate("/analyzing");

    }

  };

  return (
    <div className="relative min-h-screen text-white">

      <NeuralNetworkBackground />
      <Navbar />

      <div className="relative z-10 max-w-2xl mx-auto mt-16 px-6">

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg text-center">

          <h1 className="text-2xl font-bold mb-6">
            Scan QR Code
          </h1>

          <div className="rounded-xl overflow-hidden">

            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(result, error) => {

                if (!!result) {
                  handleScan(result);
                }

              }}
              style={{ width: "100%" }}
            />

          </div>

          <p className="mt-4 text-gray-400 text-sm">
            Point camera at a UPI QR code
          </p>

          {result && (
            <div className="mt-6 bg-black/40 p-3 rounded-lg text-sm break-all">
              {result}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}