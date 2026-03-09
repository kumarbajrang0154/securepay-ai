import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AnalysisContext } from "../context/AnalysisContext";
import { reportFraud } from "../services/apiService";

function ReportFraudPage() {
  const { transactionDetails } = useContext(AnalysisContext);
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await reportFraud({
        ...transactionDetails,
        reason,
      });

      alert("Fraud reported successfully.");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to report fraud.");
    }
  };

  if (!transactionDetails) {
    return (
      <div className="text-center py-20">
        <h2>No transaction data available.</h2>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12">

      <h2 className="text-3xl font-bold mb-6 text-center">
        Report Fraudulent QR
      </h2>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <p><strong>UPI ID:</strong> {transactionDetails.upiId}</p>
        <p><strong>Merchant:</strong> {transactionDetails.merchantName}</p>
        <p><strong>Amount:</strong> ₹{transactionDetails.amount}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <textarea
          placeholder="Describe why this QR code is suspicious..."
          className="border p-3 rounded"
          rows="4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-red-600 text-white py-3 rounded hover:bg-red-700"
        >
          Submit Report
        </button>

      </form>

    </div>
  );
}

export default ReportFraudPage;