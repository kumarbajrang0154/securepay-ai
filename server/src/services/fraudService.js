import FraudReport from '../models/FraudReport.js'
import Transaction from '../models/Transaction.js'
import crypto from 'crypto'

export class FraudService {
  /**
   * Report fraudulent QR
   */
  static async reportFraud({
    qrData,
    mobile,
    merchant,
    upiId,
    amount,
    reason,
    description,
    reporterEmail,
    reporterIP,
  }) {
    try {
      const raw = String(qrData || "").trim();
      const qrHash = crypto.createHash("sha256").update(raw).digest("hex");

      const fraudReport = new FraudReport({
        qrHash,
        qrData: raw,
        mobile,
        merchant,
        upiId,
        amount: Number(amount) || 0,
        reason,
        description,
        reporterEmail,
        reporterIP,
        status: "pending",
      });

      await fraudReport.save();

      // Increment report count in matching transactions
      await Transaction.updateMany(
        { qrHash },
        {
          $inc: { reportCount: 1 },
          $set: { isReported: true },
        }
      );

      return fraudReport;
    } catch (error) {
      throw new Error(`Failed to report fraud: ${error.message}`);
    }
  }

  /**
   * Get fraud reports
   */
  static async getReports(status = null, limit = 20) {
    try {
      const query = status ? { status } : {}
      const reports = await FraudReport.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()

      return reports
    } catch (error) {
      throw new Error(`Failed to fetch fraud reports: ${error.message}`)
    }
  }

  /**
   * Verify fraud report
   */
  static async verifyReport(reportId, isVerified, notes) {
    try {
      const report = await FraudReport.findByIdAndUpdate(
        reportId,
        {
          status: isVerified ? 'verified' : 'false_positive',
          verificationNotes: notes,
        },
        { new: true }
      )

      return report
    } catch (error) {
      throw new Error(`Failed to verify report: ${error.message}`)
    }
  }

  /**
   * Get fraud statistics
   */
  static async getFraudStatistics() {
    try {
      const totalReports = await FraudReport.countDocuments()
      const verifiedReports = await FraudReport.countDocuments({ status: 'verified' })
      const pendingReports = await FraudReport.countDocuments({ status: 'pending' })

      const reportsByReason = await FraudReport.aggregate([
        {
          $group: {
            _id: '$reason',
            count: { $sum: 1 },
          },
        },
      ])

      return {
        totalReports,
        verifiedReports,
        pendingReports,
        reportsByReason,
      }
    } catch (error) {
      throw new Error(`Failed to fetch fraud statistics: ${error.message}`)
    }
  }
}

export default FraudService
