import { Transaction } from '../models/Transaction.js'
import { FraudReport } from '../models/FraudReport.js'
import crypto from 'crypto'

export class TransactionService {
  /**
   * Create transaction record
   */
  static async createTransaction(analysisData, metadata) {
    try {
      // Generate QR hash for identification
      const qrHash = crypto
        .createHash('sha256')
        .update(analysisData.upiId + analysisData.merchant + Date.now())
        .digest('hex')

      const transaction = new Transaction({
        qrHash,
        upiId: analysisData.upiId,
        merchant: analysisData.merchant,
        amount: analysisData.amount,
        transactionType: analysisData.transactionType,
        riskLevel: analysisData.riskLevel,
        riskScore: analysisData.riskScore,
        riskFactors: analysisData.riskFactors,
        metadata,
      })

      await transaction.save()
      return transaction
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error.message}`)
    }
  }

  /**
   * Get transaction history
   */
  static async getHistory(limit = 20, offset = 0) {
    try {
      const transactions = await Transaction.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .lean()

      const total = await Transaction.countDocuments()

      return {
        transactions,
        total,
        limit,
        offset,
      }
    } catch (error) {
      throw new Error(`Failed to fetch history: ${error.message}`)
    }
  }

  /**
   * Get transaction by ID
   */
  static async getTransactionById(id) {
    try {
      const transaction = await Transaction.findById(id)
      if (!transaction) throw new Error('Transaction not found')
      return transaction
    } catch (error) {
      throw error
    }
  }

  /**
   * Get statistics
   */
  static async getStatistics() {
    try {
      const total = await Transaction.countDocuments()
      const greenCount = await Transaction.countDocuments({ riskLevel: 'green' })
      const yellowCount = await Transaction.countDocuments({ riskLevel: 'yellow' })
      const redCount = await Transaction.countDocuments({ riskLevel: 'red' })
      const reportedCount = await Transaction.countDocuments({ isReported: true })

      const avgRiskScore = await Transaction.aggregate([
        {
          $group: {
            _id: null,
            avgScore: { $avg: '$riskScore' },
          },
        },
      ])

      return {
        totalScanned: total,
        greenCount,
        yellowCount,
        redCount,
        reportedCount,
        avgRiskScore: avgRiskScore[0]?.avgScore || 0,
      }
    } catch (error) {
      throw new Error(`Failed to fetch statistics: ${error.message}`)
    }
  }
}

export default TransactionService
