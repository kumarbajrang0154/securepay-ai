import Navbar from "../components/Navbar"
import NeuralNetworkBackground from "../components/NeuralNetworkBackground"

export default function MyReportsPage() {

  const savedReports =
    JSON.parse(localStorage.getItem("fraudReports")) || []

  const dummyReports = [

    {
      merchant: "Lottery Prize Center",
      upiId: "lottery@upi",
      amount: 5000,
      reason: "Scam / Fraud",
      status: "Pending Review",
      date: "2026-03-10T16:40:00"
    },

    {
      merchant: "Fake Cashback Offer",
      upiId: "cashback@upi",
      amount: 1500,
      reason: "Unexpected Payment Request",
      status: "Under Investigation",
      date: "2026-03-11T11:10:00"
    },

    {
      merchant: "Unknown Merchant",
      upiId: "unknownpay@upi",
      amount: 3200,
      reason: "Fake Merchant",
      status: "Reported",
      date: "2026-03-12T09:30:00"
    }

  ]

  const reports =
    savedReports.length > 0 ? savedReports : dummyReports

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

        <div className="space-y-4">

          {reports.map((r, index) => (

            <div
              key={index}
              className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-lg"
            >

              {/* HEADER */}

              <div className="flex justify-between mb-2">

                <div className="font-semibold">
                  {r.merchant}
                </div>

                <div className="text-yellow-400 text-sm">
                  {r.status}
                </div>

              </div>

              {/* UPI */}

              <div className="text-sm text-gray-400 break-all mb-2">
                {r.upiId}
              </div>

              {/* DETAILS */}

              <div className="text-sm text-gray-300">
                Reason: {r.reason}
              </div>

              <div className="text-sm text-gray-300">
                Amount: ₹{r.amount}
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