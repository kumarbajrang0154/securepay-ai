import { useEffect, useState } from "react";
import { getTransactionHistory } from "../services/apiService";

function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getTransactionHistory();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12">

      <h2 className="text-3xl font-bold mb-8 text-center">
        Transaction History
      </h2>

      {transactions.length === 0 ? (
        <p className="text-center text-gray-500">
          No transactions found.
        </p>
      ) : (
        <div className="space-y-4">

          {transactions.map((tx, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p><strong>Merchant:</strong> {tx.merchantName}</p>
                <p><strong>UPI:</strong> {tx.upiId}</p>
                <p><strong>Amount:</strong> ₹{tx.amount}</p>
              </div>

              <div
                className={`px-3 py-1 rounded text-white ${
                  tx.riskLevel === "RED"
                    ? "bg-red-500"
                    : tx.riskLevel === "YELLOW"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              >
                {tx.riskLevel}
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default TransactionHistoryPage;