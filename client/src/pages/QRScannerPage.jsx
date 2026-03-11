import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";

export default function QRScannerPage() {

  const navigate = useNavigate();

  const handleScan = (result) => {

    if (result) {

      const qrData = result?.text;

      // Example parsing (later improve karenge)
      const parsedData = {
        merchant: "Demo Merchant",
        amount: "500",
        upi: "merchant@upi",
        probability: Math.floor(Math.random() * 100)
      };

      navigate("/risk-result", { state: parsedData });

    }

  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-6">

      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">
        Scan QR Code
      </h1>

      {/* Scanner Card */}
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md text-center">

        {/* Camera */}
        <div className="relative rounded-lg overflow-hidden">

          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={(result) => handleScan(result)}
            containerStyle={{ width: "100%" }}
          />

          {/* Scanner Frame */}
          <div className="absolute inset-0 border-4 border-blue-400 rounded-lg pointer-events-none"></div>

          {/* Scan Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>

        </div>

        <p className="text-sm text-gray-500 mt-4">
          Place QR code inside the frame to scan
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">

          <button
            onClick={() => navigate("/qr-upload")}
            className="flex-1 bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-800 transition"
          >
            Upload QR
          </button>

          <button
            onClick={() => navigate("/home")}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
}