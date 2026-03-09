import React, { useEffect, useState } from 'react'
import { getTransactionHistory } from '../services/apiService'

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await getTransactionHistory(50)
      setTransactions(response.data)
    } catch (err) {
      setError('Failed to load transaction history')
    } finally {
      setLoading(false)
    }
  }

  const getRiskBadge = (riskLevel) => {
    const badges = {
      green: <span className="risk-badge-green">✅ SAFE</span>,
      yellow: <span className="risk-badge-yellow">⚠️ CAUTION</span>,
      red: <span className="risk-badge-red">❌ FRAUD</span>,
    }
    return badges[riskLevel] || badges.green
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Transaction History</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="card bg-red-50 border-red-300">
            <p className="text-red-600">{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="card text-center">
            <p className="text-gray-600">No transactions found</p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">UPI ID</th>
                  <th className="px-6 py-3 text-left font-semibold">Merchant</th>
                  <th className="px-6 py-3 text-left font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold">Risk Level</th>
                  <th className="px-6 py-3 text-left font-semibold">Risk Score</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">{tx.upiId}</td>
                    <td className="px-6 py-3 text-sm">{tx.merchant}</td>
                    <td className="px-6 py-3 text-sm">₹{tx.amount}</td>
                    <td className="px-6 py-3 text-sm">{getRiskBadge(tx.riskLevel)}</td>
                    <td className="px-6 py-3 text-sm">{(tx.riskScore * 100).toFixed(1)}%</td>
                    <td className="px-6 py-3 text-sm">{new Date(tx.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
