import express from 'express'
import AnalysisController from '../controllers/analysisController.js'

const router = express.Router()

// POST /api/analysis/analyze - Analyze QR code
router.post('/analyze', AnalysisController.analyzeQR)

// GET /api/analysis/stats - Get statistics
router.get('/stats', AnalysisController.getStatistics)

// GET /api/analysis/breakdown - Get risk breakdown
router.get('/breakdown', AnalysisController.getRiskBreakdown)

export default router
