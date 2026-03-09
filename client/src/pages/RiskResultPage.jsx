import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnalysisContext } from '../context/AnalysisContext'

export default function RiskResultPage() {
  const navigate = useNavigate()
  const { analysisResult } = useContext(AnalysisContext)

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="card text-center">
            <p className="text-gray-600 mb-4">No analysis result found</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getRiskColor = (risk) => {
    if (risk === 'green') return 'bg-green-50 border-green-300'
    if (risk === 'yellow') return 'bg-yellow-50 border-yellow-300'
    return 'bg-red-50 border-red-300'
  }

  const getRiskBadge = (risk) => {
    if (risk === 'green') return 'risk-badge-green'
    if (risk === 'yellow') return 'risk-badge-yellow'
    return 'risk-badge-red'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Analysis Result</h1>

        <div className={`card border-2 ${getRiskColor(analysisResult.riskLevel)}`}>
          <div className="text-center mb-8">
            <div className={`${getRiskBadge(analysisResult.riskLevel)} inline-block`}>
              {analysisResult.riskLevel === 'green' && '✅ SAFE'}
              {analysisResult.riskLevel === 'yellow' && '⚠️ CAUTION'}
              {analysisResult.riskLevel === 'red' && '❌ FRAUDULENT'}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Risk Score</h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-3xl font-bold">{(analysisResult.riskScore * 100).toFixed(1)}%</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Transaction Details</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><span className="font-semibold">UPI ID:</span> {analysisResult.upiId}</p>
                <p><span className="font-semibold">Merchant:</span> {analysisResult.merchant}</p>
                <p><span className="font-semibold">Amount:</span> ₹{analysisResult.amount}</p>
                <p><span className="font-semibold">Type:</span> {analysisResult.transactionType}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Risk Factors</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {analysisResult.riskFactors.map((factor, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {analysisResult.riskLevel !== 'green' && (
              <div className="bg-orange-100 border border-orange-300 rounded-lg p-4">
                <h4 className="font-bold mb-2">⚠️ Recommendation</h4>
                <p className="text-gray-700">
                  {analysisResult.riskLevel === 'yellow' 
                    ? 'Verify transaction details before proceeding.' 
                    : 'DO NOT proceed with this transaction. It appears to be fraudulent.'}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => navigate('/')} className="btn-secondary flex-1">
                Back to Home
              </button>
              <button onClick={() => navigate('/report')} className="btn-primary flex-1">
                Report Fraud
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
