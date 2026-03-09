import React, { useEffect, useRef, useState, useContext } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useNavigate } from 'react-router-dom'
import { AnalysisContext } from '../context/AnalysisContext'
import { analyzeQR } from '../services/apiService'

export default function QRScannerPage() {
  const [scanning, setScanning] = useState(true)
  const scannerRef = useRef(null)
  const navigate = useNavigate()
  const { setResult, setLoading, setErrorMessage } = useContext(AnalysisContext)

  useEffect(() => {
    if (!scanning) return

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false,
    )

    scanner.render(
      (decodedText) => {
        setLoading(true)
        handleQRData(decodedText)
        scanner.clear()
        setScanning(false)
      },
      (error) => {
        // Ignore scanning errors
      }
    )

    return () => {
      scanner.clear()
    }
  }, [scanning])

  const handleQRData = async (qrData) => {
    try {
      const response = await analyzeQR(qrData)
      setResult(response.data)
      navigate('/result')
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Analysis failed')
      setScanning(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">QR Scanner</h1>
        
        <div className="card">
          <div id="qr-reader" style={{ width: '100%' }}></div>
        </div>

        <div className="mt-8 bg-blue-100 border border-blue-300 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">📸 Scanning Instructions</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Point camera at UPI QR code</li>
            <li>Keep code in focus for 2-3 seconds</li>
            <li>Analysis starts automatically</li>
            <li>Results appear in seconds</li>
          </ul>
        </div>
      </div>
    </div>
  )
}



