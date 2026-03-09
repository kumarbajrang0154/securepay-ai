import express from 'express'
import TransactionController from '../controllers/transactionController.js'

const router = express.Router()

// GET /api/transactions/history - Get transaction history
router.get('/history', TransactionController.getHistory)

// GET /api/transactions/summary - Get summary statistics
router.get('/summary', TransactionController.getSummary)

// GET /api/transactions/:id - Get transaction by ID
router.get('/:id', TransactionController.getTransaction)

// GET /api/transactions/filter - Filter by risk level
router.get('/filter', TransactionController.filterByRiskLevel)

export default router
