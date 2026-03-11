import { useNavigate } from "react-router-dom";

export default function TransactionHistoryPage() {

  const navigate = useNavigate();

  // Dummy Data (later API se ayega)
  const transactions = [
    {
      merchant: "Amazon Store",
      amount: 1200,
      upi: "amazon@upi",
      risk: "SAFE",
      date: "10 Mar 2026"
    },
    {
      merchant: "Unknown Merchant",
      amount: 500,
      upi: "fraud@upi",
      risk: "HIGH",
      date: "09 Mar 2026"
    },
    {
      merchant: "Flipkart",
      amount: 850,
      upi: "flipkart@upi",
      risk: "MEDIUM",
      date: "08 Mar 2026"
    }
  ];

  const getRiskBadge = (risk) => {

    if (risk === "HIGH")
      return "bg-red-100 text-red-600";

    if (risk === "MEDIUM")
      return "bg-yellow-100 text-yellow-600";

    return "bg-green-100 text-green-600";
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-2xl font-bold">
          Transaction History
        </h1>

        <button
          onClick={() => navigate("/home")}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
        >
          Back to Dashboard
        </button>

      </div>


      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-sm text-gray-600">

              <th className="p-4">Merchant</th>
              <th className="p-4">Amount</th>
              <th className="p-4">UPI ID</th>
              <th className="p-4">Risk</th>
              <th className="p-4">Date</th>

            </tr>

          </thead>

          <tbody>

            {transactions.map((tx, index) => (

              <tr
                key={index}
                className="border-t hover:bg-slate-50 transition"
              >

                <td className="p-4 font-medium">
                  {tx.merchant}
                </td>

                <td className="p-4">
                  ₹{tx.amount}
                </td>

                <td className="p-4 text-gray-600">
                  {tx.upi}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskBadge(tx.risk)}`}
                  >
                    {tx.risk}
                  </span>

                </td>

                <td className="p-4 text-gray-500">
                  {tx.date}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}