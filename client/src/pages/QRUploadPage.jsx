import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnalysisContext } from '../context/AnalysisContext'
import { analyzeQR } from '../services/apiService'

export default function QRUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const navigate = useNavigate()
  const { setResult, setLoading, setErrorMessage } = useContext(AnalysisContext)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select an image first')
      return
    }

    setLoading(true)
    try {
      // For actual implementation, use FormData to upload image
      // For now, we'll assume analyzeQR takes base64 data
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const response = await analyzeQR(e.target.result)
          setResult(response.data)
          navigate('/result')
        } catch (error) {
          setErrorMessage(error.response?.data?.message || 'Analysis failed')
        } finally {
          setLoading(false)
        }
      }
      reader.readAsDataURL(selectedFile)
    } catch (error) {
      setErrorMessage('Upload failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Upload QR Code</h1>

        <div className="card">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            {preview ? (
              <div>
                <img src={preview} alt="Preview" className="max-w-xs mx-auto mb-4 rounded" />
                <button
                  onClick={() => {
                    setSelectedFile(null)
                    setPreview(null)
                  }}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div>
                <p className="text-4xl mb-4">📤</p>
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-800 font-semibold">Click to upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-gray-500 mt-2">or drag and drop</p>
                <p className="text-gray-400 text-sm">PNG, JPG, GIF (max 5MB)</p>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Analyze QR Code
          </button>
        </div>
      </div>
    </div>
  )
}
