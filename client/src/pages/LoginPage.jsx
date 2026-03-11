import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NeuralNetworkBackground from "../components/NeuralNetworkBackground";

export default function LoginPage() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");

  const handleLogin = () => {
    if (mobile.length === 10) {
      localStorage.setItem("userMobile", mobile);

      // redirect to dashboard
      navigate("/dashboard");
    } else {
      alert("Enter valid mobile number");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">

      <NeuralNetworkBackground />

      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-10 w-[350px] text-center shadow-xl">

        <h1 className="text-3xl font-bold mb-2">SecurePay AI</h1>

        <p className="text-gray-300 mb-6">
          AI powered QR fraud protection
        </p>

        <input
          type="text"
          placeholder="Enter mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg bg-black/40 border border-white/20 outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition"
        >
          Login
        </button>

      </div>
    </div>
  );
}