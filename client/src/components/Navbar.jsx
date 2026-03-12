import { useState } from "react"
import { Link } from "react-router-dom"

export default function Navbar() {

  const [open, setOpen] = useState(false)

  const userMobile = localStorage.getItem("userMobile") || "User"

  const handleLogout = () => {
    localStorage.removeItem("userMobile")
    window.location.href = "/"
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/30 border-b border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        <Link to="/dashboard" className="text-xl font-bold text-cyan-400">
          SecurePay AI
        </Link>

        <div className="relative">

          <img
            src="https://i.pravatar.cc/40"
            alt="user"
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full cursor-pointer border border-cyan-400"
          />

          {open && (

            <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden">

              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm text-gray-400">Logged in as</p>
                <p className="text-white font-semibold">{userMobile}</p>
              </div>

              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-300 hover:bg-white/10"
              >
                👤 View Profile
              </Link>

              <Link
                to="/edit-profile"
                className="block px-4 py-2 text-gray-300 hover:bg-white/10"
              >
                ✏ Edit Profile
              </Link>

              <Link
                to="/settings"
                className="block px-4 py-2 text-gray-300 hover:bg-white/10"
              >
                ⚙ Settings
              </Link>

              <Link
                to="/my-fraud"
                className="block px-4 py-2 text-gray-300 hover:bg-white/10"
              >
                🚨 My Fraud Reports
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 border-t border-white/10"
              >
                Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </nav>
  )
}