import { useNavigate } from "react-router-dom";

export default function HomePage() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100">

      {/* TOP HEADER */}
      <div className="bg-white shadow flex justify-between items-center px-8 py-4">

        <h1 className="text-xl font-bold text-slate-800">
          SecurePay AI
        </h1>

        <div className="flex items-center gap-3 cursor-pointer">

          <img
            src="https://i.pravatar.cc/40"
            alt="user"
            className="w-10 h-10 rounded-full"
          />

          <span className="font-medium text-gray-700">
            User
          </span>

        </div>

      </div>


      {/* MAIN DASHBOARD */}
      <div className="max-w-6xl mx-auto mt-10 px-6">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total Scans</p>
            <h2 className="text-2xl font-bold mt-1">12</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Fraud Detected</p>
            <h2 className="text-2xl font-bold text-red-500 mt-1">2</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Safe Transactions</p>
            <h2 className="text-2xl font-bold text-green-500 mt-1">10</h2>
          </div>

        </div>


        {/* QR SCANNER CARD */}
        <div className="bg-white rounded-xl shadow p-8 text-center">

          <h2 className="text-xl font-semibold mb-6">
            Scan QR Code
          </h2>

          {/* Scanner Frame */}
          <div className="relative w-64 h-64 mx-auto border-4 border-dashed border-blue-400 rounded-lg flex items-center justify-center">

            <span className="text-gray-400">
              Place QR Code Here
            </span>

            {/* scan line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex justify-center gap-4">

            <button
              onClick={() => navigate("/qr-scanner")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Scan QR
            </button>

            <button
              onClick={() => navigate("/qr-upload")}
              className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              Upload QR Image
            </button>

          </div>

        </div>


        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div
            onClick={() => navigate("/history")}
            className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
          >

            <h3 className="font-semibold mb-2">
              Transaction History
            </h3>

            <p className="text-sm text-gray-500">
              View all scanned QR transactions
            </p>

          </div>


          <div
            onClick={() => navigate("/report-fraud")}
            className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
          >

            <h3 className="font-semibold mb-2">
              Report Fraud
            </h3>

            <p className="text-sm text-gray-500">
              Report suspicious QR codes
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}