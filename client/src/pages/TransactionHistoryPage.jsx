import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import NeuralNetworkBackground from "../components/NeuralNetworkBackground"
import { getTransactions } from "../services/apiService"

export default function TransactionHistoryPage() {

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      const mobile = localStorage.getItem("userMobile")
      if (!mobile) {
        setLoading(false)
        return
      }

      try {
        const data = await getTransactions(mobile)
        setTransactions(data.transactions || [])
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const getRiskColor = (score) => {
    if (score < 40) return "text-green-400"
    if (score < 70) return "text-yellow-400"
    return "text-red-400"
  }

  const getRiskLabel = (riskLevel) => {
    return riskLevel || "UNKNOWN"
  }

  const totalScans = transactions.length
  const fraudCount = transactions.filter(t => t.riskLevel === "FRAUD").length
  const safeCount = transactions.filter(t => t.riskLevel === "SAFE").length
  const suspiciousCount = transactions.filter(t => t.riskLevel === "SUSPICIOUS").length

  if (loading) {
    return (
      <div className="relative min-h-screen text-white">
        <NeuralNetworkBackground />
        <Navbar />
        <div className="relative z-10 max-w-5xl mx-auto mt-12 px-4">
          <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

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

                <div className={`text-sm ${getRiskColor(tx.fraudScore)}`}>
                  {getRiskLabel(tx.riskLevel)}
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
                  <span className="text-gray-400">Score:</span> {tx.fraudScore}%
                </div>

                <div>
                  <span className="text-gray-400">Community Reports:</span> {tx.communityReports}
                </div>

                <div>
                  <span className="text-gray-400">Date:</span>{" "}
                  {new Date(tx.scannedAt).toLocaleDateString()}
                </div>

                <div>
                  <span className="text-gray-400">Time:</span>{" "}
                  {new Date(tx.scannedAt).toLocaleTimeString()}
                </div>

                {tx.previouslyReported && (
                  <div className="col-span-2">
                    <span className="text-red-400">Previously Reported by You</span>
                  </div>
                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}