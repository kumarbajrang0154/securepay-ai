import TransactionService from '../services/transactionService.js'

export class TransactionController {
  /**
   * Get transaction history
   * GET /api/transactions/history
   */
  static async getHistory(req, res) {
    try {
      const { limit = 20, offset = 0 } = req.query

      const result = await TransactionService.getHistory(
        parseInt(limit),
        parseInt(offset)
      )

      res.json(result)
    } catch (error) {
      console.error('History error:', error)
      res.status(500).json({ error: error.message })
    }
  }

  /**
   * Get transaction by ID
   * GET /api/transactions/:id
   */
  static async getTransaction(req, res) {
    try {
      const { id } = req.params

      const transaction = await TransactionService.getTransactionById(id)

      res.json(transaction)
    } catch (error) {
      console.error('Get transaction error:', error)
      res.status(404).json({ error: error.message })
    }
  }

  /**
   * Get transaction statistics/summary
   * GET /api/transactions/summary
   */
  static async getSummary(req, res) {
    try {
      const stats = await TransactionService.getStatistics()
      res.json(stats)
    } catch (error) {
      console.error('Summary error:', error)
      res.status(500).json({ error: error.message })
    }
  }

  /**
   * Filter transactions by risk level
   * GET /api/transactions/filter?riskLevel=red
   */
  static async filterByRiskLevel(req, res) {
    try {
      const { riskLevel, limit = 20 } = req.query

      if (!riskLevel) {
        return res.status(400).json({ error: 'Risk level is required' })
      }

      const transactions = await TransactionService.filterByRiskLevel(riskLevel, parseInt(limit))

      res.json(transactions)
    } catch (error) {
      console.error('Filter error:', error)
      res.status(500).json({ error: error.message })
    }
  }
}

export default TransactionController
