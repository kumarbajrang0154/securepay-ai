import Navbar from "../components/Navbar"
import NeuralNetworkBackground from "../components/NeuralNetworkBackground"

export default function TransactionHistoryPage() {

  const transactions = [

    {
      merchant: "Amazon Store",
      upiId: "amazon@upi",
      amount: 599,
      location: "Bangalore",
      type: "PAY QR",
      score: 12,
      date: "2026-03-12T10:21:00"
    },

    {
      merchant: "Coffee Cafe",
      upiId: "coffee@upi",
      amount: 120,
      location: "Delhi",
      type: "PAY QR",
      score: 15,
      date: "2026-03-12T08:15:00"
    },

    {
      merchant: "Unknown Merchant",
      upiId: "scam@upi",
      amount: 2500,
      location: "Unknown",
      type: "REQUEST QR",
      score: 85,
      date: "2026-03-11T22:30:00"
    },

    {
      merchant: "Flipkart Seller",
      upiId: "flipkart@upi",
      amount: 899,
      location: "Mumbai",
      type: "PAY QR",
      score: 22,
      date: "2026-03-11T19:05:00"
    },

    {
      merchant: "Lottery Prize Center",
      upiId: "lottery@upi",
      amount: 5000,
      location: "Unknown",
      type: "REQUEST QR",
      score: 92,
      date: "2026-03-10T16:40:00"
    }

  ]

  const getRiskColor = (score) => {
    if (score < 40) return "text-green-400"
    if (score < 70) return "text-yellow-400"
    return "text-red-400"
  }

  const getRiskLabel = (score) => {
    if (score < 40) return "SAFE"
    if (score < 70) return "SUSPICIOUS"
    return "HIGH RISK"
  }

  const totalScans = transactions.length
  const fraudCount = transactions.filter(t => t.score > 70).length
  const safeCount = transactions.filter(t => t.score < 40).length
  const suspiciousCount = transactions.filter(t => t.score >= 40 && t.score <= 70).length

  return (

    <div className="relative min-h-screen text-white">

      <NeuralNetworkBackground />
      <Navbar />

      <div className="relative z-10 max-w-5xl mx-auto mt-12 px-4">

        <h1 className="text-2xl font-bold mb-6">
          Transaction History
        </h1>

        {/* FRAUD STATISTICS DASHBOARD */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-white/10 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm">Total Scans</p>
            <p className="text-xl font-bold text-cyan-400">{totalScans}</p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm">Safe</p>
            <p className="text-xl font-bold text-green-400">{safeCount}</p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm">Suspicious</p>
            <p className="text-xl font-bold text-yellow-400">{suspiciousCount}</p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm">Fraud Detected</p>
            <p className="text-xl font-bold text-red-400">{fraudCount}</p>
          </div>

        </div>

        {/* TRANSACTION LIST */}

        <div className="space-y-4">

          {transactions.map((tx, index) => (

            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-lg"
            >

              <div className="flex justify-between items-center mb-3">

                <div className="font-semibold">
                  {tx.merchant}
                </div>

                <div className={`text-sm ${getRiskColor(tx.score)}`}>
                  {getRiskLabel(tx.score)}
                </div>

              </div>

              <div className="text-sm text-gray-400 break-all mb-2">
                {tx.upiId}
              </div>

              <div className="text-lg font-bold text-cyan-400 mb-3">
                ₹{tx.amount}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">

                <div>
                  <span className="text-gray-400">QR Type:</span> {tx.type}
                </div>

                <div>
                  <span className="text-gray-400">Score:</span> {tx.score}%
                </div>

                <div>
                  <span className="text-gray-400">Date:</span>{" "}
                  {new Date(tx.date).toLocaleDateString()}
                </div>

                <div>
                  <span className="text-gray-400">Time:</span>{" "}
                  {new Date(tx.date).toLocaleTimeString()}
                </div>

                <div className="col-span-2">
                  <span className="text-gray-400">Location:</span>{" "}
                  {tx.location}
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}