// Fraud Detection Engine with AI-powered analysis

import { predictFraud, getRiskLevel } from '../ai/fraudModel.js';
import aiFraudService from './aiFraudService.js';

/**
 * Analyzes transaction for fraud using AI model and rule-based system
 * @param {Object} data - Transaction data
 * @param {Object} additionalFeatures - Additional features for AI model
 * @returns {Object} Analysis result with fraud score, probability, and risk level
 */
async function analyzeFraud(data, additionalFeatures = {}) {
  const merchant = (data.merchant || "").toLowerCase();
  const upiId = (data.upiId || "").toLowerCase();
  const amount = Number(data.amount || 0);

  // Extract features for AI model
  const features = {
    amount,
    communityReports: additionalFeatures.communityReports || 0,
    previouslyReported: additionalFeatures.previouslyReported || false,
    isBlacklisted: additionalFeatures.isBlacklisted || false,
    keywordRisk: false, // Will be set below
    upiRisk: additionalFeatures.upiRisk || 0
  };

  let warnings = [];

  // Rule-based keyword detection (for compatibility and additional insights)
  const suspiciousKeywords = [
    "gift",
    "reward",
    "free",
    "offer",
    "bonus",
    "lottery"
  ];

  for (const word of suspiciousKeywords) {
    if (merchant.includes(word)) {
      features.keywordRisk = true;
      warnings.push("Suspicious merchant keyword detected");
      break;
    }
  }

  // Additional rule-based checks for warnings
  if (upiId.includes("scam") || upiId.includes("test")) {
    warnings.push("Suspicious UPI ID detected");
  }

  if (amount > 3000) {
    warnings.push("High payment request");
  }

  if (amount === 0) {
    warnings.push("Zero amount request (possible scam)");
  }

  // AI-powered fraud prediction (primary method)
  let fraudProbability = null;
  let aiPrediction = null;

  try {
    aiPrediction = await aiFraudService.predictFraud(data, additionalFeatures);
    if (aiPrediction !== null) {
      fraudProbability = aiPrediction;
    }
  } catch (error) {
    console.warn('AI prediction failed, using fallback:', error.message);
  }

  // Fallback to simple probability model if AI is unavailable
  if (fraudProbability === null) {
    fraudProbability = predictFraud(features);
  }

  const fraudScore = Math.round(fraudProbability * 100);
  const riskLevel = getRiskLevel(fraudProbability);

  return {
    fraudScore,
    fraudProbability,
    riskLevel,
    warnings,
    features: {
      amount,
      communityReports: features.communityReports,
      previouslyReported: features.previouslyReported,
      isBlacklisted: features.isBlacklisted,
      keywordRisk: features.keywordRisk,
      upiRisk: features.upiRisk
    },
    aiUsed: aiPrediction !== null // Indicates if real AI was used vs fallback
  };
}

export default analyzeFraud;