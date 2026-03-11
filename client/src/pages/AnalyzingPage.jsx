import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import NeuralNetworkBackground from "../components/NeuralNetworkBackground";

export default function AnalyzingPage() {

  const navigate = useNavigate();

  useEffect(() => {

    const timer = setTimeout(() => {
      navigate("/result");
    }, 3000);

    return () => clearTimeout(timer);

  }, []);

  return (
    <div className="relative min-h-screen text-white">

      <NeuralNetworkBackground />
      <Navbar />

      <div className="relative z-10 flex flex-col items-center justify-center mt-40">

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-10 w-[400px] text-center">

          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-6"></div>

          <h2 className="text-xl font-semibold mb-4">
            AI Fraud Analysis Running
          </h2>

          <div className="space-y-2 text-gray-300 text-sm">

            <p>Scanning QR data...</p>
            <p>Analyzing merchant reputation...</p>
            <p>Checking fraud patterns...</p>
            <p>Calculating fraud probability...</p>

          </div>

        </div>

      </div>

    </div>
  );
}