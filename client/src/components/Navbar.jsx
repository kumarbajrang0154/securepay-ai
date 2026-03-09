import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-bold text-2xl flex items-center gap-2">
            🔒 SecurePay AI
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            <Link to="/scanner" className="hover:text-blue-200 transition">Scanner</Link>
            <Link to="/upload" className="hover:text-blue-200 transition">Upload</Link>
            <Link to="/analysis" className="hover:text-blue-200 transition">Analysis</Link>
            <Link to="/history" className="hover:text-blue-200 transition">History</Link>
            <Link to="/report" className="hover:text-blue-200 transition">Report</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block hover:text-blue-200">Home</Link>
            <Link to="/scanner" className="block hover:text-blue-200">Scanner</Link>
            <Link to="/upload" className="block hover:text-blue-200">Upload</Link>
            <Link to="/analysis" className="block hover:text-blue-200">Analysis</Link>
            <Link to="/history" className="block hover:text-blue-200">History</Link>
            <Link to="/report" className="block hover:text-blue-200">Report</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
