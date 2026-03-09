import React, { useEffect, useState } from 'react'
import { getAnalysisStats } from '../services/apiService'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export default function TransactionAnalysisPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await getAnalysisStats()
      setStats(response.data)
    } catch (err) {
      setError('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="text-center">
          <div className="spinner mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const riskDistributionData = {
    labels: ['Safe', 'Caution', 'Fraudulent'],
    datasets: [{
      data: [stats?.greenCount || 0, stats?.yellowCount || 0, stats?.redCount || 0],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
    }],
  }

  const transactionTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Transactions Analyzed',
      data: [12, 19, 3, 5],
      backgroundColor: '#3b82f6',
    }],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Transaction Analysis</h1>

        {error && <div className="card bg-red-50 border-red-300 mb-8"><p className="text-red-600">{error}</p></div>}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="font-semibold text-gray-600 mb-2">Total Scanned</h3>
            <p className="text-4xl font-bold text-blue-600">{stats?.totalScanned || 0}</p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-600 mb-2">Safe</h3>
            <p className="text-4xl font-bold text-green-600">✅ {stats?.greenCount || 0}</p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-600 mb-2">Caution</h3>
            <p className="text-4xl font-bold text-yellow-600">⚠️ {stats?.yellowCount || 0}</p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-600 mb-2">Fraudulent</h3>
            <p className="text-4xl font-bold text-red-600">❌ {stats?.redCount || 0}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Risk Distribution</h3>
            <Pie data={riskDistributionData} />
          </div>
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Transaction Trend</h3>
            <Bar data={transactionTrendData} />
          </div>
        </div>
      </div>
    </div>
  )
}
