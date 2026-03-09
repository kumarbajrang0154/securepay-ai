import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("userMobile");

    navigate("/");

  };

  return (

    <div className="flex justify-between items-center p-4 bg-white shadow">

      <h1 className="text-lg font-bold">
        SecurePay AI
      </h1>

      <div className="relative">

        <div
          onClick={() => setOpen(!open)}
          className="flex items-center cursor-pointer gap-2 bg-gray-100 px-3 py-1 rounded"
        >

          <img
            src="https://i.pravatar.cc/40"
            alt="user"
            className="w-8 h-8 rounded-full"
          />

          <span className="text-sm font-medium">
            Rahul
          </span>

        </div>

        {open && (

          <div className="absolute right-0 mt-2 bg-white shadow rounded w-32">

            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>

          </div>

        )}

      </div>

    </div>

  );
}

export default Navbar;