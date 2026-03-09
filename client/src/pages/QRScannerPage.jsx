import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";

import { AnalysisContext } from "../context/AnalysisContext";

function QRScannerPage() {
  const { setQrData } = useContext(AnalysisContext);
  const navigate = useNavigate();

  const handleScan = (result) => {
    if (result?.text) {
      setQrData(result.text);
      navigate("/analysis");
    }
  };

  const handleError = (error) => {
    console.error("QR Scan Error:", error);
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">

      <h2 className="text-2xl font-bold mb-6">Scan QR Code</h2>

      <div className="w-full max-w-md">
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (!!result) handleScan(result);
            if (!!error) handleError(error);
          }}
          style={{ width: "100%" }}
        />
      </div>

    </div>
  );
}

export default QRScannerPage;