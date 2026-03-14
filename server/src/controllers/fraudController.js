import FraudService from '../services/fraudService.js'

export class FraudController {
  /**
   * Report fraudulent QR
   * POST /api/fraud/report
   */
  static async reportFraud(req, res) {
    try {
      const {
        qrData,
        mobile,
        merchant,
        upiId,
        amount,
        reason,
        description,
        email,
      } = req.body;

      if (!qrData || !reason) {
        return res.status(400).json({
          success: false,
          message: "QR data and reason are required",
        });
      }

      const ipAddress = req.ip;

      const report = await FraudService.reportFraud({
        qrData,
        mobile,
        merchant,
        upiId,
        amount,
        reason,
        description,
        reporterEmail: email,
        reporterIP: ipAddress,
      });

      res.status(201).json({
        success: true,
        message: "Fraud report submitted successfully",
        reportId: report._id,
      });
    } catch (error) {
      console.error("Report error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get fraud reports (admin only)
   * GET /api/fraud/reports
   */
  static async getReports(req, res) {
    try {
      const { status, limit = 20 } = req.query

      const reports = await FraudService.getReports(status, parseInt(limit))

      res.json({
        count: reports.length,
        reports,
      })
    } catch (error) {
      console.error('Get reports error:', error)
      res.status(500).json({ error: error.message })
    }
  }

  /**
   * Verify fraud report (admin only)
   * PUT /api/fraud/reports/:id/verify
   */
  static async verifyReport(req, res) {
    try {
      const { id } = req.params
      const { isVerified, notes } = req.body

      const report = await FraudService.verifyReport(id, isVerified, notes)

      res.json({
        success: true,
        message: 'Report verified',
        report,
      })
    } catch (error) {
      console.error('Verify error:', error)
      res.status(500).json({ error: error.message })
    }
  }

  /**
   * Get fraud statistics
   * GET /api/fraud/statistics
   */
  static async getFraudStatistics(req, res) {
    try {
      const stats = await FraudService.getFraudStatistics()
      res.json(stats)
    } catch (error) {
      console.error('Stats error:', error)
      res.status(500).json({ error: error.message })
    }
  }
}

export default FraudController
