import { useEffect, useState } from "react";

export default function Dashboard() {

  const [stats, setStats] = useState({
    total: 0,
    safe: 0,
    suspicious: 0,
    fraud: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        const res = await fetch("http://localhost:5000/api/analytics");

        const data = await res.json();

        if (data.success) {
          setStats(data.data);
        }

      } catch (error) {

        console.error("Analytics fetch failed", error);

      }

      setLoading(false);

    };

    fetchAnalytics();

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
              {stats.total}
            </p>
          </div>

          {/* Safe */}
          <div className="bg-gray-900 border border-green-500 p-6 rounded-xl">
            <p className="text-gray-400">Safe</p>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {stats.safe}
            </p>
          </div>

          {/* Suspicious */}
          <div className="bg-gray-900 border border-yellow-500 p-6 rounded-xl">
            <p className="text-gray-400">Suspicious</p>
            <p className="text-3xl font-bold text-yellow-400 mt-2">
              {stats.suspicious}
            </p>
          </div>

          {/* Fraud */}
          <div className="bg-gray-900 border border-red-500 p-6 rounded-xl">
            <p className="text-gray-400">Fraud Detected</p>
            <p className="text-3xl font-bold text-red-500 mt-2">
              {stats.fraud}
            </p>
          </div>

        </div>

      )}

    </div>
  );
}