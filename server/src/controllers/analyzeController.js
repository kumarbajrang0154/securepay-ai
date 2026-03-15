import { parseQR } from "../utils/qrParser.js";
import analyzeFraud from "../services/fraudEngine.js";
import FraudStats from "../models/FraudStats.js";
import FraudReport from "../models/FraudReport.js";
import Transaction from "../models/Transaction.js";
import {
  getUserBehaviorStats,
  generateSmartWarnings,
  trackPaymentAttempt,
  trackPaymentCancellation,
  trackPaymentCompletion
} from "../services/behavioralFraudService.js";

export const analyzeQR = async (req, res) => {
  try {
    const { qrData, mobile } = req.body;

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

    // Step 2: Check community fraud reports and gather features for AI model
    let communityReports = 0;
    let isBlacklisted = false;
    let upiRisk = 0;

    if (upiId) {
      const stats = await FraudStats.findOne({ upiId });

      if (stats) {
        communityReports = stats.reports;
        isBlacklisted = stats.isBlacklisted || false;

        // Calculate UPI risk score based on reports and blacklist status
        upiRisk = Math.min(communityReports * 0.1, 0.5); // Max 50% from reports
        if (isBlacklisted) {
          upiRisk = 1.0; // 100% risk if blacklisted
        }
      }
    }

    // Step 3: Check if the user already reported this UPI
    let previouslyReported = false;
    const mobileNormalized = (mobile || "").trim();
    if (upiId && mobileNormalized) {
      const existing = await FraudReport.findOne({ mobile: mobileNormalized, upiId });
      previouslyReported = !!existing;
    }

    // Step 4: Get user behavior statistics for this UPI ID
    const behaviorStats = await getUserBehaviorStats(upiId);

    // Step 5: Run AI-powered fraud engine
    const additionalFeatures = {
      communityReports,
      previouslyReported,
      isBlacklisted,
      upiRisk,
      cancelCount: behaviorStats.cancelCount,
      attemptCount: behaviorStats.attemptCount,
      completionRate: behaviorStats.completionRate
    };

    const analysisResult = await analyzeFraud(parsedData, additionalFeatures);

    const {
      fraudScore,
      fraudProbability,
      riskLevel,
      warnings,
      features
    } = analysisResult;

    // Step 6: Generate smart warnings combining all factors
    const smartWarnings = generateSmartWarnings({
      fraudProbability,
      communityReports,
      isBlacklisted,
      riskLevel
    }, behaviorStats);

    // Combine AI warnings with smart warnings
    const allWarnings = [...warnings, ...smartWarnings];

    // Step 7: Send response with AI-powered analysis and smart warnings
    res.json({
      merchant,
      upiId,
      amount,
      fraudScore,
      fraudProbability,
      riskLevel,
      communityReports,
      previouslyReported,
      isBlacklisted,
      warnings: allWarnings,
      behaviorStats: {
        cancelCount: behaviorStats.cancelCount,
        attemptCount: behaviorStats.attemptCount,
        completionRate: behaviorStats.completionRate,
        totalScans: behaviorStats.totalScans
      },
      aiFeatures: features // Include AI model features for transparency
    });

    // Step 7: Store transaction record (non-blocking)
    try {
      await Transaction.create({
        mobile: mobileNormalized,
        merchant,
        upiId,
        amount,
        fraudScore,
        fraudProbability,
        riskLevel,
        communityReports,
        previouslyReported,
        scannedAt: new Date(),
      });
      console.log("Transaction saved for mobile:", mobileNormalized);
    } catch (error) {
      console.error("Failed to save transaction:", error);
      // Don't crash the API
    }
  } catch (error) {
    console.error("Error analyzing QR:", error);
    res.status(500).json({
      message: "Error analyzing QR",
    });
  }
};

/**
 * Track payment attempt when user clicks "Continue Anyway"
 */
export const trackPaymentAttemptEndpoint = async (req, res) => {
  try {
    const { mobile, upiId } = req.body;

    if (!mobile || !upiId) {
      return res.status(400).json({
        message: "Mobile number and UPI ID are required",
      });
    }

    const success = await trackPaymentAttempt(mobile, upiId);

    res.json({
      success,
      message: success ? "Payment attempt tracked" : "No transaction found to update"
    });
  } catch (error) {
    console.error("Error tracking payment attempt:", error);
    res.status(500).json({
      message: "Error tracking payment attempt",
    });
  }
};

/**
 * Track payment cancellation when user returns without completing
 */
export const trackPaymentCancellationEndpoint = async (req, res) => {
  try {
    const { mobile, upiId } = req.body;

    if (!mobile || !upiId) {
      return res.status(400).json({
        message: "Mobile number and UPI ID are required",
      });
    }

    const success = await trackPaymentCancellation(mobile, upiId);

    res.json({
      success,
      message: success ? "Payment cancellation tracked" : "No transaction found to update"
    });
  } catch (error) {
    console.error("Error tracking payment cancellation:", error);
    res.status(500).json({
      message: "Error tracking payment cancellation",
    });
  }
};

/**
 * Track payment completion (for future use)
 */
export const trackPaymentCompletionEndpoint = async (req, res) => {
  try {
    const { mobile, upiId } = req.body;

    if (!mobile || !upiId) {
      return res.status(400).json({
        message: "Mobile number and UPI ID are required",
      });
    }

    const success = await trackPaymentCompletion(mobile, upiId);

    res.json({
      success,
      message: success ? "Payment completion tracked" : "No transaction found to update"
    });
  } catch (error) {
    console.error("Error tracking payment completion:", error);
    res.status(500).json({
      message: "Error tracking payment completion",
    });
  }
};