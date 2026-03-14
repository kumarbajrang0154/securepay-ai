import FraudReport from "../models/FraudReport.js";
import FraudStats from "../models/FraudStats.js";

export const reportFraud = async (req, res) => {
  try {
    const { mobile, merchant, upiId, amount, reason, qrData } = req.body;

    // Store fraud report
    const report = await FraudReport.create({
      mobile,
      merchant,
      upiId,
      amount,
      reason,
      qrData,
    });

    // Update FraudStats
    const existingStats = await FraudStats.findOne({ upiId });

    if (existingStats) {
      existingStats.reports += 1;
      existingStats.lastReported = new Date();
      await existingStats.save();
    } else {
      await FraudStats.create({
        upiId,
        merchant,
        reports: 1,
      });
    }

    res.status(201).json({
      message: "Fraud report submitted successfully",
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error submitting fraud report",
    });
  }
};