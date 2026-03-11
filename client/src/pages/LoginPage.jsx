import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NeuralNetworkBackground from "../components/NeuralNetworkBackground";

const qrImage =
  "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=SecurePayAI";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!mobile) {
      alert("Enter mobile number");
      return;
    }

    localStorage.setItem("userMobile", mobile);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex bg-black relative overflow-hidden">

      {/* Neural Network */}
      <NeuralNetworkBackground />

      {/* LEFT */}
      <div className="hidden md:flex w-1/2 relative z-10 bg-gradient-to-br from-black via-slate-900 to-blue-900 flex-col justify-center items-center p-16 text-white">

        <h1 className="text-5xl font-bold text-cyan-400 mb-6">
          SecurePay AI
        </h1>

        <p className="text-gray-300 text-center max-w-md mb-10">
          AI Powered QR Fraud Detection protecting your payments in real time
        </p>

        <div className="relative">

          <div className="w-64 h-64 border-4 border-cyan-400 rounded-xl shadow-lg shadow-cyan-500/60 flex items-center justify-center bg-black overflow-hidden">

            <img
              src={qrImage}
              alt="QR"
              className="w-full h-full object-contain p-6"
            />

            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 animate-[scan_2s_linear_infinite]"></div>

          </div>

        </div>

        <div className="mt-10 text-sm text-gray-300 space-y-2">
          <p>✓ AI Fraud Detection</p>
          <p>✓ Secure QR Payments</p>
          <p>✓ Real-time Scam Protection</p>
        </div>

      </div>

      {/* RIGHT LOGIN */}
      <div className="flex w-full md:w-1/2 relative z-10 items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-800">

        <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl border border-cyan-500/30 shadow-xl w-[380px] text-white">

          <h2 className="text-2xl font-semibold text-center text-cyan-400 mb-2">
            Welcome Back
          </h2>

          <p className="text-sm text-gray-300 text-center mb-6">
            Enter your mobile number to continue
          </p>

          <input
            type="text"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <button
            onClick={handleLogin}
            className="mt-5 w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-lg font-medium hover:scale-105 transition"
          >
            Send OTP
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            🔒 Secure login powered by SecurePay AI
          </p>

        </div>

      </div>

    </div>
  );
}