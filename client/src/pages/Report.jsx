import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Report() {

  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state || {};

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReport = async () => {

    if (!reason) {
      alert("Please enter reason");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          merchant: data.merchant,
          upiId: data.upiId,
          amount: data.amount,
          reason
        })
      });

      const result = await response.json();

      if (result.success) {

        alert("Fraud report submitted");

        navigate("/dashboard");

      } else {

        alert("Failed to submit report");

      }

    } catch (error) {

      console.error(error);
      alert("Server error");

    }

    setLoading(false);

  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">

      <h1 className="text-3xl font-bold text-red-400 mb-6">
        Report Suspicious QR
      </h1>

      <div className="w-full max-w-md border border-red-500 p-6 rounded-xl">

        <p className="mb-2">
          <span className="text-gray-400">Merchant:</span> {data.merchant}
        </p>

        <p className="mb-2">
          <span className="text-gray-400">UPI ID:</span> {data.upiId}
        </p>

        <p className="mb-4">
          <span className="text-gray-400">Amount:</span> ₹{data.amount}
        </p>

        <textarea
          placeholder="Describe why this QR is suspicious..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg mb-4"
        />

        <button
          onClick={submitReport}
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg font-semibold"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>

      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-black px-5 py-2 rounded-lg"
      >
        Cancel
      </button>

    </div>
  );
}