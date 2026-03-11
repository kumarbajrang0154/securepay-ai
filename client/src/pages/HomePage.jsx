import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NeuralNetworkBackground from "../components/NeuralNetworkBackground";

export default function HomePage() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      <NeuralNetworkBackground />

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* HERO SECTION */}

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-10 text-center shadow-xl">

          <h1 className="text-3xl font-bold mb-2">
            🛡 SecurePay AI Protection Active
          </h1>

          <p className="text-gray-300 mb-6">
            AI powered QR fraud detection protecting your payments
          </p>

          <Link
            to="/scan"
            className="inline-block px-10 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition"
          >
            Scan QR Code
          </Link>
        </div>

        {/* QUICK ACTIONS */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <Link
            to="/scan"
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition text-center"
          >
            <div className="text-3xl mb-2">📷</div>
            <div>Scan QR</div>
          </Link>

          <Link
            to="/upload"
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition text-center"
          >
            <div className="text-3xl mb-2">⬆</div>
            <div>Upload QR</div>
          </Link>

          <Link
            to="/transactions"
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition text-center"
          >
            <div className="text-3xl mb-2">🕑</div>
            <div>History</div>
          </Link>

          <Link
            to="/report"
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition text-center"
          >
            <div className="text-3xl mb-2">⚠</div>
            <div>Report Fraud</div>
          </Link>

        </div>

        {/* STATS */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
            <p className="text-gray-400">Scans Today</p>
            <h2 className="text-3xl font-bold text-cyan-400">12</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
            <p className="text-gray-400">Frauds Detected</p>
            <h2 className="text-3xl font-bold text-red-400">2</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
            <p className="text-gray-400">Security Score</p>
            <h2 className="text-3xl font-bold text-green-400">98%</h2>
          </div>

        </div>

        {/* RECENT SCANS */}

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-10">

          <h2 className="text-xl font-semibold mb-4">Recent Scans</h2>

          <table className="w-full text-left">

            <thead className="text-gray-400 border-b border-white/20">
              <tr>
                <th className="py-2">Merchant</th>
                <th>Amount</th>
                <th>Risk</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-b border-white/10">
                <td className="py-2">Amazon</td>
                <td>₹500</td>
                <td className="text-green-400">SAFE</td>
                <td>Today</td>
              </tr>

              <tr className="border-b border-white/10">
                <td className="py-2">Unknown Merchant</td>
                <td>₹2000</td>
                <td className="text-red-400">HIGH</td>
                <td>Today</td>
              </tr>

              <tr>
                <td className="py-2">Cafe Coffee</td>
                <td>₹300</td>
                <td className="text-green-400">SAFE</td>
                <td>Yesterday</td>
              </tr>

            </tbody>

          </table>

        </div>

        {/* FRAUD ALERT */}

        <div className="bg-red-500/10 border border-red-500 rounded-xl p-6 text-red-400 text-center">

          ⚠ Fraud alert: Suspicious QR codes reported today.  
          Always verify before payment.

        </div>

      </div>

      <Footer />

    </div>
  );
}