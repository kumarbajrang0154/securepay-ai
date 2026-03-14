import FraudReport from "../models/FraudReport.js";
import FraudStats from "../models/FraudStats.js";
import crypto from "crypto";

export const reportFraud = async (req, res) => {
  try {
    const { mobile, merchant, upiId, amount, reason, qrData } = req.body;

    console.log("Received fraud report data:", { mobile, merchant, upiId, amount, reason, qrData: qrData ? qrData.substring(0, 50) + "..." : qrData });

    if (!mobile || !upiId || !reason) {
      console.log("Validation failed: missing required fields");
      return res.status(400).json({
        success: false,
        message: "Mobile, UPI ID, and reason are required",
      });
    }

    // Check if user already reported this UPI
    const existingReport = await FraudReport.findOne({ mobile, upiId });
    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "You have already reported this UPI ID as fraud",
      });
    }

    // Generate QR hash
    const qrHash = crypto.createHash("sha256").update(qrData || "").digest("hex");

    // Store fraud report
    const report = await FraudReport.create({
      qrHash,
      mobile,
      merchant,
      upiId,
      amount,
      reason,
      qrData,
      reportedAt: new Date(),
    });

    console.log("Fraud report created successfully:", report._id);

    // Update FraudStats
    const existingStats = await FraudStats.findOne({ upiId });

    if (existingStats) {
      existingStats.reports += 1;
      existingStats.lastReported = new Date();
      await existingStats.save();
      console.log("Updated existing FraudStats for upiId:", upiId);
    } else {
      await FraudStats.create({
        upiId,
        merchant,
        reports: 1,
      });
      console.log("Created new FraudStats for upiId:", upiId);
    }

    res.status(201).json({
      success: true,
      message: "Fraud report saved successfully",
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error submitting fraud report",
    });
  }
};

export const getMyReports = async (req, res) => {
  try {
    let mobile = (req.query.mobile || "").trim();

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    // Query string encoding can turn '+' into spaces, so normalize back
    mobile = mobile.replace(/\s+/g, "+");

    const reports = await FraudReport.find({ mobile }).sort({ reportedAt: -1 });

    res.json({
      success: true,
      totalReports: reports.length,
      reports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching reports",
    });
  }
};