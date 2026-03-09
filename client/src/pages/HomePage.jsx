import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">

      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        SecurePay AI
      </h1>

      <p className="text-lg text-gray-600 max-w-xl mb-10">
        AI-powered protection against fraudulent UPI QR codes. 
        Scan or upload a QR code to analyze transaction risk before making a payment.
      </p>

      <div className="flex gap-6">

        <Link
          to="/scan"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Scan QR Code
        </Link>

        <Link
          to="/upload"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Upload QR Image
        </Link>

      </div>

    </div>
  );
}

export default HomePage;