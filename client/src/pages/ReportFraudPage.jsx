import React, { useState } from 'react'
import { reportFraud } from '../services/apiService'

export default function ReportFraudPage() {
  const [formData, setFormData] = useState({
    qrData: '',
    reason: '',
    description: '',
    email: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await reportFraud(formData.qrData, formData.reason)
      setSubmitted(true)
      setFormData({ qrData: '', reason: '', description: '', email: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError('Failed to submit report')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Report Fraudulent QR</h1>

        <div className="card">
          {submitted && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6">
              <p className="text-green-700 font-semibold">✅ Report submitted successfully!</p>
              <p className="text-green-600 text-sm">Our team will review your report shortly.</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-2">QR Data</label>
              <textarea
                name="qrData"
                value={formData.qrData}
                onChange={handleChange}
                placeholder="Paste the QR code data or SHA..."
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Reason for Report</label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a reason</option>
                <option value="phishing">Phishing Attempt</option>
                <option value="malware">Malware/Virus</option>
                <option value="money_fraud">Money Fraud</option>
                <option value="identity_theft">Identity Theft</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about the fraud..."
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Email (Optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email for follow-up"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Submit Fraud Report
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
