import { useEffect, useState } from "react";

export default function Dashboard() {

  const [stats, setStats] = useState({
    totalScans: 0,
    safeScans: 0,
    suspiciousScans: 0,
    fraudScans: 0
  });

  const [topFraudUpis, setTopFraudUpis] = useState([]);
  const [topMerchants, setTopMerchants] = useState([]);
  const [dailyScans, setDailyScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchAllAnalytics = async () => {

      try {

        const [dashboardRes, topUpiRes, topMerchantsRes, dailyRes] = await Promise.all([
          fetch("http://localhost:5000/api/analytics/dashboard"),
          fetch("http://localhost:5000/api/analytics/top-upi"),
          fetch("http://localhost:5000/api/analytics/top-merchants"),
          fetch("http://localhost:5000/api/analytics/daily-scans")
        ]);

        const dashboardData = await dashboardRes.json();
        const topUpiData = await topUpiRes.json();
        const topMerchantsData = await topMerchantsRes.json();
        const dailyData = await dailyRes.json();

        if (dashboardData.success) {
          setStats(dashboardData.data);
        }

        if (topUpiData.success) {
          setTopFraudUpis(topUpiData.data);
        }

        if (topMerchantsData.success) {
          setTopMerchants(topMerchantsData.data);
        }

        if (dailyData.success) {
          setDailyScans(dailyData.data);
        }

      } catch (error) {

        console.error("Analytics fetch failed", error);

      }

      setLoading(false);

    };

    fetchAllAnalytics();

  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl font-bold text-cyan-400 mb-8">
        SecurePay AI Dashboard
      </h1>

      {loading ? (
        <p>Loading analytics...</p>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Total Scans */}
          <div className="bg-gray-900 border border-cyan-500 p-6 rounded-xl">
            <p className="text-gray-400">Total Scans</p>
            <p className="text-3xl font-bold mt-2">
              {dashboardStats.total}
            </p>
          </div>

          {/* Safe */}
          <div className="bg-gray-900 border border-green-500 p-6 rounded-xl">
            <p className="text-gray-400">Safe</p>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {dashboardStats.safe}
            </p>
          </div>

          {/* Suspicious */}
          <div className="bg-gray-900 border border-yellow-500 p-6 rounded-xl">
            <p className="text-gray-400">Suspicious</p>
            <p className="text-3xl font-bold text-yellow-400 mt-2">
              {dashboardStats.suspicious}
            </p>
          </div>

          {/* Fraud */}
          <div className="bg-gray-900 border border-red-500 p-6 rounded-xl">
            <p className="text-gray-400">Fraud Detected</p>
            <p className="text-3xl font-bold text-red-500 mt-2">
              {dashboardStats.fraud}
            </p>
          </div>

        </div>

        {/* Blacklist Analytics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Blacklisted Count */}
          <div className="bg-gray-900 border border-red-600 p-6 rounded-xl">
            <p className="text-gray-400">Blacklisted UPI IDs</p>
            <p className="text-3xl font-bold text-red-400 mt-2">
              {dashboardStats.blacklistedCount}
            </p>
          </div>

          {/* Top Fraud Merchants */}
          <div className="bg-gray-900 border border-orange-500 p-6 rounded-xl md:col-span-2">
            <p className="text-gray-400 mb-4">Top Fraud Merchants</p>
            <div className="space-y-2">
              {topFraudMerchants.slice(0, 5).map((merchant, index) => (
                <div key={index} className="flex justify-between">
                  <span>{merchant._id || "Unknown"}</span>
                  <span className="text-orange-400">{merchant.reports} reports</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Top Fraud UPIs */}
        <div className="mt-6 bg-gray-900 border border-red-500 p-6 rounded-xl">
          <p className="text-gray-400 mb-4">Top Fraud UPI IDs</p>
          <div className="space-y-2">
            {topFraudUpis.map((upi, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <span className="text-sm">{upi.upiId}</span>
                  {upi.merchant && <span className="text-gray-500 ml-2">({upi.merchant})</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">{upi.reports} reports</span>
                  {upi.isBlacklisted && <span className="text-red-600 text-xs">BLACKLISTED</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Scan Statistics */}
        <div className="mt-6 bg-gray-900 border border-blue-500 p-6 rounded-xl">
          <p className="text-gray-400 mb-4">Daily Scan Statistics (Last 7 Days)</p>
          <div className="space-y-2">
            {dailyScanStats.map((day, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{new Date(day._id).toLocaleDateString()}</span>
                <div className="flex items-center gap-4">
                  <span className="text-green-400">Safe: {day.safe}</span>
                  <span className="text-yellow-400">Suspicious: {day.suspicious}</span>
                  <span className="text-red-400">Fraud: {day.fraud}</span>
                  <span className="text-cyan-400">Total: {day.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      )}

    </div>
  );
}