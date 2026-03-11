import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userMobile");
    navigate("/");
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <h1
        onClick={() => navigate("/home")}
        className="text-xl font-bold text-blue-600 cursor-pointer"
      >
        SecurePay AI
      </h1>

      {/* Profile */}
      <div className="relative">

        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src="https://i.pravatar.cc/40"
            className="w-9 h-9 rounded-full"
          />

          <span className="text-sm font-medium">
            User
          </span>
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden">

            <button
              onClick={() => navigate("/history")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              History
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
            >
              Logout
            </button>

          </div>
        )}

      </div>

    </div>
  );
}