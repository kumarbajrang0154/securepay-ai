import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NeuralNetworkBackground from "../components/NeuralNetworkBackground";

export default function LoginPage() {

  const navigate = useNavigate();

  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState("mobile");

  const sendOTP = () => {

    if (mobile.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000);

    console.log("Generated OTP:", randomOtp);

    setGeneratedOtp(randomOtp.toString());

    setStep("otp");

    alert("OTP sent (check console)");

  };

  const verifyOTP = () => {

    if (otp === generatedOtp) {

      localStorage.setItem("userMobile", countryCode + mobile);

      navigate("/dashboard");

    } else {

      alert("Invalid OTP");

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

        {step === "mobile" && (

          <>
            <div className="flex mb-4">

              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 py-3 rounded-l-lg bg-black/40 border border-white/20 outline-none"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>

              <input
                type="text"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-3 rounded-r-lg bg-black/40 border border-white/20 outline-none"
              />

            </div>

            <button
              onClick={sendOTP}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition"
            >
              Send OTP
            </button>

          </>
        )}

        {step === "otp" && (

          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded-lg bg-black/40 border border-white/20 outline-none"
            />

            <button
              onClick={verifyOTP}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition"
            >
              Verify OTP
            </button>
          </>
        )}

      </div>

    </div>

  );
}