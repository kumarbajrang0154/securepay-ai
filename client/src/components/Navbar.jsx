import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          SecurePay AI
        </Link>

        <div className="flex gap-6">
          <Link to="/" className="hover:text-gray-200">
            Home
          </Link>

          <Link to="/scan" className="hover:text-gray-200">
            Scan QR
          </Link>

          <Link to="/upload" className="hover:text-gray-200">
            Upload QR
          </Link>

          <Link to="/history" className="hover:text-gray-200">
            History
          </Link>

          <Link to="/report" className="hover:text-gray-200">
            Report Fraud
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;