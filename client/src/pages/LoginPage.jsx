import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {

  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {

    if (!mobile) {
      alert("Enter Mobile Number");
      return;
    }

    localStorage.setItem("userMobile", mobile);

    navigate("/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-lg w-80">

        <h1 className="text-2xl font-bold text-center mb-6">
          SecurePay AI Login
        </h1>

        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="border w-full p-2 rounded mb-4"
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Send OTP
        </button>

      </div>

    </div>
  );
}

export default LoginPage;