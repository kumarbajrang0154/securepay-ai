import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const analyzeQR = (qrData) => {
  return apiClient.post('/analysis/analyze', { qrData })
}

export const reportFraud = (qrData, reason) => {
  return apiClient.post('/fraud/report', { qrData, reason })
}

export const getTransactionHistory = (limit = 10) => {
  return apiClient.get(`/transactions/history?limit=${limit}`)
}

export const getAnalysisStats = () => {
  return apiClient.get('/analysis/stats')
}

export const getQRDetails = (qrId) => {
  return apiClient.get(`/transactions/${qrId}`)
}

export default apiClient
