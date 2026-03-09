import express from 'express'
import FraudController from '../controllers/fraudController.js'

const router = express.Router()

// POST /api/fraud/report - Report fraudulent QR
router.post('/report', FraudController.reportFraud)

// GET /api/fraud/reports - Get fraud reports
router.get('/reports', FraudController.getReports)

// PUT /api/fraud/reports/:id/verify - Verify fraud report
router.put('/reports/:id/verify', FraudController.verifyReport)

// GET /api/fraud/statistics - Get fraud statistics
router.get('/statistics', FraudController.getFraudStatistics)

export default router
