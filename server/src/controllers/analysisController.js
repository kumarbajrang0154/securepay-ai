import fraudDetectionService from '../services/fraudDetectionService.js'
import TransactionService from '../services/transactionService.js'

export class AnalysisController {
  /**
   * Analyze QR Code
   * POST /api/analysis/analyze
   */
  static async analyzeQR(req, res) {
    try {
      const { qrData } = req.body

      if (!qrData) {
        return res.status(400).json({ error: 'QR data is required' })
      }

      // Parse QR data
      const parsedData = fraudDetectionService.constructor.parseQRData(qrData)
      if (!parsedData) {
        return res.status(400).json({ error: 'Invalid QR data format' })
      }

      // Analyze fraud risk
      const analysisResult = fraudDetectionService.analyzeQRData(parsedData)

      // Create transaction record
      const metadata = {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      }

      const transaction = await TransactionService.createTransaction(analysisResult, metadata)

      // Return result
      res.json({
        success: true,
        transactionId: transaction._id,
        ...analysisResult,
        timestamp: new Date(),
      })
    } catch (error) {
      console.error('Analysis error:', error)
      res.status(500).json({
        error: error.message || 'Analysis failed',
      })
    }
  }

  /**
   * Get analysis statistics
   * GET /api/analysis/stats
   */
  static async getStatistics(req, res) {
    try {
      const stats = await TransactionService.getStatistics()
      res.json(stats)
    } catch (error) {
      console.error('Stats error:', error)
      res.status(500).json({ error: error.message })
    }
  }

  /**
   * Get risk breakdown for dashboard
   * GET /api/analysis/breakdown
   */
  static async getRiskBreakdown(req, res) {
    try {
      const { days = 30 } = req.query
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(days))

      // Simulated breakdown data - in production, aggregate from MongoDB
      const breakdown = {
        timeline: [
          { date: '2024-03-05', green: 45, yellow: 12, red: 3 },
          { date: '2024-03-06', green: 52, yellow: 15, red: 5 },
          { date: '2024-03-07', green: 38, yellow: 18, red: 7 },
        ],
        topRiskFactors: [
          { factor: 'Unknown Merchant', count: 25 },
          { factor: 'Suspicious Pattern', count: 18 },
          { factor: 'Blacklisted UPI', count: 12 },
        ],
      }

      res.json(breakdown)
    } catch (error) {
      console.error('Breakdown error:', error)
      res.status(500).json({ error: error.message })
    }
  }
}

export default AnalysisController
