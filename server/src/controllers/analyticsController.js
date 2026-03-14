import Transaction from "../models/Transaction.js";

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

    res.json({
      success: true,
      data: {
        total,
        safe,
        suspicious,
        fraud
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Analytics fetch failed"
    });

  }

};