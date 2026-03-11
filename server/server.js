import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { connectDB } from './src/config/db.js'

import analysisRoutes from './src/routes/analysisRoutes.js'
import fraudRoutes from './src/routes/fraudRoutes.js'
import transactionRoutes from './src/routes/transactionRoutes.js'
import authRoutes from './src/routes/authRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/analysis', analysisRoutes)
app.use('/api/fraud', fraudRoutes)
app.use('/api/transactions', transactionRoutes)

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date()
  })
})

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack)

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date()
  })
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start Server
app.listen(PORT, () => {
  console.log(`✅ SecurePay AI Server running on http://localhost:${PORT}`)
  console.log(`📊 API available at http://localhost:${PORT}/api`)
})

export default app