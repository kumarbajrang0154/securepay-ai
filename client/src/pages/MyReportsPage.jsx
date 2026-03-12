import Navbar from "../components/Navbar"
import NeuralNetworkBackground from "../components/NeuralNetworkBackground"

export default function MyReportsPage() {

  const reports =
    JSON.parse(localStorage.getItem("fraudReports")) || []

  const totalReports = reports.length

  return (

    <div className="relative min-h-screen text-white">

      <NeuralNetworkBackground />
      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto mt-12 px-4">

        <h1 className="text-2xl font-bold mb-6">
          My Fraud Reports
        </h1>

        {/* SUMMARY */}

        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 text-center">

          <p className="text-sm text-gray-400">
            Total Fraud Reported
          </p>

          <p className="text-2xl font-bold text-red-400">
            {totalReports}
          </p>

        </div>

        {reports.length === 0 && (

          <p className="text-gray-400">
            You have not reported any QR fraud yet.
          </p>

        )}

        <div className="space-y-4">

          {reports.map((r, index) => (

            <div
              key={index}
              className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-lg"
            >

              <div className="flex justify-between mb-2">

                <div className="font-semibold">
                  {r.merchant || "Unknown Merchant"}
                </div>

                <div className="text-yellow-400 text-sm">
                  {r.status}
                </div>

              </div>

              <div className="text-sm text-gray-400 break-all mb-2">
                {r.upiId}
              </div>

              <div className="text-sm text-gray-300">
                Reason: {r.reason}
              </div>

              <div className="text-sm text-gray-300">
                Amount: ₹{r.amount || "Not specified"}
              </div>

              <div className="text-sm text-gray-400">
                {new Date(r.date).toLocaleString()}
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}