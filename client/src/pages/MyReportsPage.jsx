import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import NeuralNetworkBackground from "../components/NeuralNetworkBackground"
import { getMyReports } from "../services/apiService"

export default function MyReportsPage() {

  const [reports, setReports] = useState([])
  const [totalReports, setTotalReports] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      const mobile = localStorage.getItem("userMobile")
      if (!mobile) {
        setLoading(false)
        return
      }

      try {
        const data = await getMyReports(mobile)
        setReports(data.reports || [])
        setTotalReports(data.totalReports ?? (data.reports ? data.reports.length : 0))
      } catch (error) {
        console.error("Error fetching reports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  if (loading) {
    return (
      <div className="relative min-h-screen text-white">
        <NeuralNetworkBackground />
        <Navbar />
        <div className="relative z-10 max-w-4xl mx-auto mt-12 px-4 text-center">
          <p>Loading reports...</p>
        </div>
      </div>
    )
  }

  // totalReports is populated from the API response (fallbacks to reports.length)

  return (
    <div className="relative min-h-screen text-white">
      <NeuralNetworkBackground />
      <Navbar />
      <div className="relative z-10 max-w-4xl mx-auto mt-12 px-4">
        <h1 className="text-2xl font-bold mb-6">
          My Fraud Reports
        </h1>
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 text-center">
          <p className="text-sm text-gray-400">
            Total Fraud Reported
          </p>
          <p className="text-2xl font-bold text-red-400">
            {totalReports}
          </p>
        </div>
        <div className="space-y-4">
          {reports.map((r, index) => (
            <div
              key={index}
              className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-lg"
            >
              <div className="flex justify-between mb-2">
                <div className="font-semibold">
                  {r.merchant}
                </div>
                <div className="text-yellow-400 text-sm">
                  {r.status || "Reported"}
                </div>
              </div>
              <div className="text-sm text-gray-400 break-all mb-2">
                {r.upiId}
              </div>
              <div className="text-sm text-gray-400 mb-2">
                Amount: ₹{r.amount || 0} | Reason: {r.reason}
              </div>
              <div className="text-xs text-gray-500">
                Reported on {r.reportedAt ? new Date(r.reportedAt).toLocaleDateString() : "Unknown"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}