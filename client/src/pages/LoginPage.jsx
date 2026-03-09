import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (mobile.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    localStorage.setItem("userMobile", mobile);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">

      <div className="bg-teal-400 w-80 p-8 rounded-3xl text-center text-white">

        <h2 className="text-xl mb-6 font-semibold">
          Welcome to SecurePay
        </h2>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full bg-transparent border-b border-white outline-none text-center mb-6"
          />

          <button
            type="submit"
            className="w-full bg-white text-gray-600 py-2 rounded"
          >
            Send OTP
          </button>

        </form>

        <p className="text-sm mt-6">
          Note: Mobile number should be in this phone to use this application
        </p>

      </div>

    </div>
  );
}

export default LoginPage;