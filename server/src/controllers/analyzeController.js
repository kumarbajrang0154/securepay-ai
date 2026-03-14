import { parseQR } from "../utils/qrParser.js";
import analyzeFraud from "../services/fraudEngine.js";
import FraudStats from "../models/FraudStats.js";

export const analyzeQR = async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({
        message: "QR data is required",
      });
    }

    // Step 1: Parse QR
    const parsedData = parseQR(qrData);

    const merchant = parsedData.merchant || "Unknown Merchant";
    const upiId = parsedData.upiId || "";
    const amount = parsedData.amount || 0;

    // Step 2: Run fraud engine
    let { fraudScore, warnings } = analyzeFraud(parsedData);

    // Step 3: Check community fraud reports
    let communityReports = 0;

    if (upiId) {
      const stats = await FraudStats.findOne({ upiId });

      if (stats) {
        communityReports = stats.reports;

        // If many users reported → increase fraud score
        if (communityReports >= 3) {
          fraudScore += 30;

          warnings.push(
            `Community alert: ${communityReports} users reported this UPI as fraud`
          );
        }
      }
    }

    // Step 4: Determine risk level
    let riskLevel = "SAFE";

    if (fraudScore > 60) {
      riskLevel = "FRAUD";
    } else if (fraudScore > 30) {
      riskLevel = "SUSPICIOUS";
    }

    // Step 5: Send response
    res.json({
      merchant,
      upiId,
      amount,
      fraudScore,
      riskLevel,
      communityReports,
      warnings,
    });
  } catch (error) {
    console.error("Analyze error:", error);

    res.status(500).json({
      message: "Error analyzing QR",
    });
  }
};