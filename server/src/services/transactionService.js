import Transaction from '../models/Transaction.js'
import FraudReport from '../models/FraudReport.js'
import crypto from 'crypto'

export class TransactionService {
  /**
   * Create transaction record
   */
  static async createTransaction(analysisData = {}, metadata = {}) {
    try {
      // Generate deterministic QR hash (based on QR payload) for linking reports
      const raw = String(analysisData.qrData || analysisData.raw || "").trim();
      const qrHash = crypto.createHash("sha256").update(raw).digest("hex");

      const transaction = new Transaction({
        qrHash,
        upiId: analysisData.upiId || "",
        merchant: analysisData.merchant || "",
        amount: Number(analysisData.amount) || 0,
        currency: analysisData.currency || "INR",
        fraudScore: Number(analysisData.fraudScore ?? analysisData.riskScore) || 0,
        riskLevel: analysisData.riskLevel || "SAFE",
        reasons: analysisData.warnings || analysisData.riskFactors || [],
        raw,
        metadata,
      });

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
    const safeCount = await Transaction.countDocuments({ riskLevel: 'SAFE' })
    const suspiciousCount = await Transaction.countDocuments({ riskLevel: 'SUSPICIOUS' })
    const fraudCount = await Transaction.countDocuments({ riskLevel: 'FRAUD' })
    const reportedCount = await Transaction.countDocuments({ isReported: true })

    const avgFraudScore = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$fraudScore' },
        },
      ])

      return {
        totalScanned: total,
        safeCount,
        suspiciousCount,
        fraudCount,
        reportedCount,
        avgFraudScore: avgFraudScore[0]?.avgScore || 0,
      }
    } catch (error) {
      throw new Error(`Failed to fetch statistics: ${error.message}`)
    }
  }
}

export default TransactionService
