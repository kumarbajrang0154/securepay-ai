import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import NeuralNetworkBackground from "../components/NeuralNetworkBackground"

export default function HomePage() {

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      <NeuralNetworkBackground />
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* HERO PANEL */}

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-10 mb-10 text-center">

          <div className="flex flex-col items-center gap-4">

            {/* SHIELD ICON */}

            <div className="relative">

              <div className="absolute inset-0 rounded-full bg-cyan-500 blur-xl opacity-40 animate-pulse"></div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-cyan-400 relative"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"
                />
              </svg>

            </div>

            {/* TEXT */}

            <h1 className="text-3xl font-bold">
              SecurePay AI Protection Active
            </h1>

            <p className="text-gray-300">
              AI powered QR fraud detection monitoring your payments
            </p>

            {/* STATUS INDICATORS */}

            <div className="flex gap-6 mt-4 text-sm">

              <div className="flex items-center gap-2">

                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>

                AI Engine Running

              </div>

              <div className="flex items-center gap-2">

                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>

                Fraud Detection Active

              </div>

              <div className="flex items-center gap-2">

                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>

                Security Monitoring

              </div>

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          {/* SCAN */}

          <Link
            to="/scan"
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition text-center"
          >

            <div className="flex justify-center mb-3">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 4h5M4 4v5M20 4h-5M20 4v5M4 20h5M4 20v-5M20 20h-5M20 20v-5" />
              </svg>

            </div>

            <div>Scan QR</div>

          </Link>

          {/* UPLOAD */}

          <Link
            to="/upload"
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition text-center"
          >

            <div className="flex justify-center mb-3">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 15a4 4 0 014-4h1a5 5 0 019.9-1A4.5 4.5 0 0121 15a3 3 0 01-3 3H7a4 4 0 01-4-3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V8m0 0l-3 3m3-3l3 3"
                />
              </svg>

            </div>

            <div>Upload QR</div>

          </Link>

          {/* HISTORY */}

          <Link
            to="/transactions"
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition text-center"
          >

            <div className="flex justify-center mb-3">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3a9 9 0 100 18 9 9 0 000-18z"
                />
              </svg>

            </div>

            <div>History</div>

          </Link>

          {/* REPORT */}

          <Link
            to="/report"
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition text-center"
          >

            <div className="flex justify-center mb-3">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01" />
              </svg>

            </div>

            <div>Report Fraud</div>

          </Link>

        </div>

      </div>

      <Footer />

    </div>
  )

}