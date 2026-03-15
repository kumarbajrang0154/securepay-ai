// Fraud Detection Engine with AI-powered analysis

import { predictFraud } from '../ai/fraudModel.js';
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
    console.log("🤖 Attempting AI prediction...");
    aiPrediction = await aiFraudService.predictFraud(data, additionalFeatures);
    if (aiPrediction !== null) {
      fraudProbability = aiPrediction;
      console.log(`✅ AI prediction successful: ${(fraudProbability * 100).toFixed(1)}%`);
    } else {
      console.log("⚠️ AI service unavailable, using fallback");
    }
  } catch (error) {
    console.warn('AI prediction failed, using fallback:', error.message);
  }

  // Fallback to simple probability model if AI is unavailable
  if (fraudProbability === null) {
    console.log("🔄 Using rule-based fraud detection");
    fraudProbability = predictFraud(features);
    console.log(`📊 Rule-based prediction: ${(fraudProbability * 100).toFixed(1)}%`);
  }

  // STEP 2: Calculate rule-based score for hybrid scoring
  let ruleScore = 0.0;

  // Keyword risk contributes to rule score
  if (features.keywordRisk) {
    ruleScore += 0.2;
  }

  // Community reports (scaled contribution)
  if (features.communityReports > 0) {
    ruleScore += Math.min(features.communityReports * 0.05, 0.2); // Max 20% from reports
  }

  // Blacklist status (high weight)
  if (features.isBlacklisted) {
    ruleScore += 0.4;
  }

  // Amount-based risk
  if (amount > 3000) {
    ruleScore += 0.1;
  } else if (amount > 1000) {
    ruleScore += 0.05;
  }

  // Previously reported
  if (features.previouslyReported) {
    ruleScore += 0.15;
  }

  // UPI risk patterns
  ruleScore += features.upiRisk * 0.1;

  // Ensure rule score stays within bounds
  ruleScore = Math.min(Math.max(ruleScore, 0), 1);

  // STEP 3: Combine AI + Rule Score (Hybrid Scoring)
  const finalProbability = (fraudProbability * 0.7) + (ruleScore * 0.3);

  // STEP 4: Determine risk level with new thresholds
  let riskLevel;
  if (finalProbability < 0.4) {
    riskLevel = "SAFE";
  } else if (finalProbability < 0.7) {
    riskLevel = "SUSPICIOUS";
  } else {
    riskLevel = "FRAUD";
  }

  // STEP 6: Add logging for debugging
  console.log("🔍 Fraud Analysis Results:", {
    aiProbability: fraudProbability.toFixed(3),
    ruleScore: ruleScore.toFixed(3),
    finalProbability: finalProbability.toFixed(3),
    riskLevel,
    aiUsed: aiPrediction !== null
  });

  const fraudScore = Math.round(finalProbability * 100);

  return {
    fraudScore,
    fraudProbability, // Original AI probability
    ruleScore,        // New: Rule-based score
    finalProbability, // New: Combined final probability
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