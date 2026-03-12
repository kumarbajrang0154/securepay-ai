import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";

export default function Scanner() {
  const navigate = useNavigate();
  const [scannedData, setScannedData] = useState("");

  // 🔴 CAMERA CLEANUP WHEN PAGE LEAVES
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    const video = document.querySelector("video");

    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  const handleScan = (result) => {
    if (result) {
      const text = result?.text;
      setScannedData(text);

      // camera stop after scan
      stopCamera();

      // go to analyze page
      navigate("/analyzing", { state: { qrData: text } });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">

      <h1 className="text-2xl font-bold mb-4">Scan QR Code</h1>

      <div className="w-full max-w-md border-2 border-cyan-500 rounded-xl overflow-hidden">
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (result) handleScan(result);
          }}
          containerStyle={{ width: "100%" }}
          videoStyle={{ width: "100%" }}
        />
      </div>

      {/* Back Button */}
      <button
        onClick={() => {
          stopCamera();
          navigate("/dashboard");
        }}
        className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6 py-2 rounded-lg"
      >
        Back to Dashboard
      </button>
    </div>
  );
}