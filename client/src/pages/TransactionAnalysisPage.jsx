import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AnalysisContext } from "../context/AnalysisContext";
import { analyzeTransaction } from "../services/apiService";

function TransactionAnalysisPage() {
  const { qrData, setTransactionDetails, setRiskResult } =
    useContext(AnalysisContext);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const parseUPIData = (qr) => {
    const params = new URLSearchParams(qr.split("?")[1]);

    return {
      upiId: params.get("pa") || "",
      merchantName: params.get("pn") || "",
      amount: params.get("am") || "",
      currency: params.get("cu") || "INR",
    };
  };

  useEffect(() => {
    if (!qrData) {
      navigate("/");
      return;
    }

    const analyze = async () => {
      try {
        const parsedData = parseUPIData(qrData);

        setTransactionDetails(parsedData);

        const result = await analyzeTransaction(parsedData);

        setRiskResult(result);

        setLoading(false);

        setTimeout(() => {
          navigate("/result");
        }, 1500);
      } catch (error) {
        console.error(error);
        alert("Error analyzing transaction");
      }
    };

    analyze();
  }, [qrData]);

  return (
    <div className="flex flex-col items-center justify-center py-20">

      <h2 className="text-2xl font-bold mb-6">
        Analyzing Transaction...
      </h2>

      {loading && (
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      )}

    </div>
  );
}

export default TransactionAnalysisPage;