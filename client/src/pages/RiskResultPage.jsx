import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AnalysisContext } from "../context/AnalysisContext";
import RiskMeter from "../components/RiskMeter";

function RiskResultPage() {

  const { transactionDetails, riskResult } =
    useContext(AnalysisContext);

  const navigate = useNavigate();

  if (!transactionDetails || !riskResult) {

    return (
      <div className="text-center py-20">
        <h2>No analysis data found.</h2>
      </div>
    );

  }

  const getRiskColor = () => {

    if (riskResult.riskLevel === "RED") return "bg-red-500";
    if (riskResult.riskLevel === "YELLOW") return "bg-yellow-400";
    return "bg-green-500";

  };

  return (

    <div className="max-w-xl mx-auto py-12 text-center">

      <h2 className="text-3xl font-bold mb-6">
        Transaction Risk Result
      </h2>

      <div className={`text-white p-6 rounded-lg ${getRiskColor()}`}>

        <h3 className="text-2xl font-semibold mb-2">
          Risk Level: {riskResult.riskLevel}
        </h3>

        <p className="text-lg">
          Risk Score: {riskResult.riskScore}
        </p>

      </div>

      <RiskMeter score={riskResult.riskScore} />

      <div className="mt-8 text-left bg-white p-6 rounded-lg shadow">

        <p>
          <strong>UPI ID:</strong> {transactionDetails.upiId}
        </p>

        <p>
          <strong>Merchant:</strong> {transactionDetails.merchantName}
        </p>

        <p>
          <strong>Amount:</strong> ₹{transactionDetails.amount}
        </p>

        <p>
          <strong>Currency:</strong> {transactionDetails.currency}
        </p>

      </div>

      <div className="flex justify-center gap-6 mt-10">

        <button
          onClick={() => navigate("/")}
          className="bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800"
        >
          Go Home
        </button>

        <button
          onClick={() => navigate("/report")}
          className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
        >
          Report Fraud
        </button>

      </div>

    </div>

  );
}

export default RiskResultPage;