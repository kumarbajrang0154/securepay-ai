import { parseQR } from "../utils/qrParser.js";
import { detectFraud } from "../services/fraudEngine.js";

export const analyze = (req, res) => {
  try {

    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({
        message: "QR data missing"
      });
    }

    // Parse QR
    const parsed = parseQR(qrData);

    // Fraud detection
    const fraud = detectFraud(parsed);

    res.json({
      merchant: parsed.merchant,
      upiId: parsed.upiId,
      amount: parsed.amount,
      fraudScore: fraud.fraudScore
    });

  } catch (error) {

    console.error("Analyze error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};