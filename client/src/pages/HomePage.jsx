import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Protect Your UPI Transactions
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Advanced AI-powered fraud detection for UPI QR codes
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/scanner" className="btn-primary">
              Start Scanning
            </Link>
            <Link to="/upload" className="btn-secondary">
              Upload QR Code
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-3">Real-Time Scanning</h3>
            <p className="text-gray-600">
              Scan UPI QR codes directly from your device camera with instant analysis
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-3">AI Analysis</h3>
            <p className="text-gray-600">
              Machine learning algorithms detect fraud patterns and suspicious QR codes
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3">Analytics Dashboard</h3>
            <p className="text-gray-600">
              View detailed reports and transaction history with risk metrics
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-16 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              1
            </div>
            <h3 className="font-bold mb-2">Scan/Upload</h3>
            <p className="text-gray-600">Scan or upload UPI QR code</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              2
            </div>
            <h3 className="font-bold mb-2">Parse Data</h3>
            <p className="text-gray-600">Extract transaction details</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              3
            </div>
            <h3 className="font-bold mb-2">AI Analysis</h3>
            <p className="text-gray-600">Calculate fraud risk score</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              4
            </div>
            <h3 className="font-bold mb-2">Get Result</h3>
            <p className="text-gray-600">View risk assessment</p>
          </div>
        </div>
      </section>
    </div>
  )
}
