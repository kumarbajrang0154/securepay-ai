import Navbar from "../components/Navbar";
import NeuralNetworkBackground from "../components/NeuralNetworkBackground";

export default function TransactionHistoryPage() {

  const transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

  const getRiskColor = (score) => {
    if (score < 40) return "text-green-400";
    if (score < 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getRiskLabel = (score) => {
    if (score < 40) return "SAFE";
    if (score < 70) return "SUSPICIOUS";
    return "HIGH RISK";
  };

  return (
    <div className="relative min-h-screen text-white">

      <NeuralNetworkBackground />
      <Navbar />

      <div className="relative z-10 max-w-5xl mx-auto mt-16 px-6">

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg">

          <h1 className="text-2xl font-bold mb-6">
            Transaction History
          </h1>

          {transactions.length === 0 && (
            <p className="text-gray-400">
              No transactions yet
            </p>
          )}

          {transactions.length > 0 && (

            <table className="w-full">

              <thead className="text-left text-gray-400 border-b border-white/10">

                <tr>
                  <th className="py-3">QR Data</th>
                  <th>Fraud Score</th>
                  <th>Risk</th>
                  <th>Date</th>
                </tr>

              </thead>

              <tbody>

                {transactions.map((tx, index) => (

                  <tr
                    key={index}
                    className="border-b border-white/10"
                  >

                    <td className="py-3 break-all">
                      {tx.qr}
                    </td>

                    <td>
                      {tx.score}%
                    </td>

                    <td className={getRiskColor(tx.score)}>
                      {getRiskLabel(tx.score)}
                    </td>

                    <td>
                      {tx.date}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}