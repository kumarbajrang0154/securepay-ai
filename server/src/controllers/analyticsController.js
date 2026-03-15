import Transaction from "../models/Transaction.js";
import FraudStats from "../models/FraudStats.js";
import FraudReport from "../models/FraudReport.js";

export const getDashboardStats = async (req, res) => {
  try {
    const total = await Transaction.countDocuments();
    const safe = await Transaction.countDocuments({ riskLevel: "SAFE" });
    const suspicious = await Transaction.countDocuments({ riskLevel: "SUSPICIOUS" });
    const fraud = await Transaction.countDocuments({ riskLevel: "FRAUD" });
    const blacklistedCount = await FraudStats.countDocuments({ isBlacklisted: true });

    // Get most reported merchants for backward compatibility
    const mostReportedMerchants = await FraudStats.aggregate([
      { $match: { merchant: { $ne: null } } },
      { $group: { _id: "$merchant", reports: { $sum: "$reports" } } },
      { $sort: { reports: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        total,
        safe,
        suspicious,
        fraud,
        blacklistedCount,
        mostReportedMerchants
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats"
    });
  }
};

export const getTopFraudUpi = async (req, res) => {
  try {
    const topFraudUpis = await FraudStats.find({ reports: { $gte: 1 } })
      .sort({ reports: -1 })
      .limit(5)
      .select("upiId merchant reports isBlacklisted");

    res.json({
      success: true,
      data: topFraudUpis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching top fraud UPIs"
    });
  }
};

export const getTopFraudMerchants = async (req, res) => {
  try {
    const topMerchants = await FraudStats.aggregate([
      { $match: { merchant: { $ne: null } } },
      { $group: { _id: "$merchant", reports: { $sum: "$reports" } } },
      { $sort: { reports: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: topMerchants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching top fraud merchants"
    });
  }
};

export const getDailyScanStats = async (req, res) => {
  try {
    const dailyStats = await Transaction.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$scannedAt" }
          },
          safe: { $sum: { $cond: [{ $eq: ["$riskLevel", "SAFE"] }, 1, 0] } },
          suspicious: { $sum: { $cond: [{ $eq: ["$riskLevel", "SUSPICIOUS"] }, 1, 0] } },
          fraud: { $sum: { $cond: [{ $eq: ["$riskLevel", "FRAUD"] }, 1, 0] } },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id": -1 } },
      { $limit: 7 }
    ]);

    res.json({
      success: true,
      data: dailyStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching daily scan stats"
    });
  }
};

export const getAnalytics = async (req, res) => {

  try {

    const total = await Transaction.countDocuments();

    const safe = await Transaction.countDocuments({
      riskLevel: "SAFE"
    });

    const suspicious = await Transaction.countDocuments({
      riskLevel: "SUSPICIOUS"
    });

    const fraud = await Transaction.countDocuments({
      riskLevel: "FRAUD"
    });

    // Blacklist analytics
    const blacklistedCount = await FraudStats.countDocuments({
      isBlacklisted: true
    });

    // Most reported merchants (top 5)
    const mostReportedMerchants = await FraudStats.aggregate([
      { $match: { merchant: { $ne: null } } },
      { $group: { _id: "$merchant", reports: { $sum: "$reports" } } },
      { $sort: { reports: -1 } },
      { $limit: 5 }
    ]);

    // Top fraud UPI IDs (top 5 by reports)
    const topFraudUpis = await FraudStats.find({ reports: { $gte: 1 } })
      .sort({ reports: -1 })
      .limit(5)
      .select("upiId merchant reports isBlacklisted");

    res.json({
      success: true,
      data: {
        total,
        safe,
        suspicious,
        fraud,
        blacklistedCount,
        mostReportedMerchants,
        topFraudUpis
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Analytics fetch failed"
    });

  }

};