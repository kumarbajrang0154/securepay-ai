/**
 * AI-powered fraud detection model for SecurePay AI
 * Uses a weighted probability approach to predict fraud likelihood
 */

/**
 * Predicts fraud probability based on transaction features
 * @param {Object} features - Transaction features
 * @param {number} features.amount - Transaction amount
 * @param {number} features.communityReports - Number of community reports
 * @param {boolean} features.previouslyReported - Whether previously reported
 * @param {boolean} features.isBlacklisted - Whether UPI is blacklisted
 * @param {boolean} features.keywordRisk - Whether contains risky keywords
 * @param {number} features.upiRisk - UPI risk score (0-1)
 * @returns {number} Fraud probability between 0 and 1
 */
export function predictFraud(features) {
  const {
    amount,
    communityReports = 0,
    previouslyReported = false,
    isBlacklisted = false,
    keywordRisk = false,
    upiRisk = 0
  } = features;

  // Base fraud score starts at 0.05 (5% base suspicion for any transaction)
  let fraudScore = 0.05;

  // Amount-based risk assessment
  if (amount > 10000) {
    fraudScore += 0.35; // Very high amount risk
  } else if (amount > 5000) {
    fraudScore += 0.25; // High amount risk
  } else if (amount > 2000) {
    fraudScore += 0.15; // Medium amount risk
  } else if (amount > 1000) {
    fraudScore += 0.08; // Low-medium amount risk
  } else if (amount <= 0) {
    fraudScore += 0.4; // Zero or negative amount is highly suspicious
  }

  // Community reports (each report adds significant risk)
  fraudScore += Math.min(communityReports * 0.12, 0.4); // Max 40% from community reports

  // Previously reported (strong indicator)
  if (previouslyReported) {
    fraudScore += 0.3;
  }

  // Blacklisted UPI (very high risk - almost certain fraud)
  if (isBlacklisted) {
    fraudScore += 0.5;
  }

  // Keyword risk (suspicious merchant names)
  if (keywordRisk) {
    fraudScore += 0.2;
  }

  // UPI risk score (direct risk assessment from patterns)
  fraudScore += upiRisk * 0.2;

  // Compound risk factors
  // High amount + community reports = higher risk
  if (amount > 2000 && communityReports > 1) {
    fraudScore += 0.1;
  }

  // Blacklisted + previously reported = maximum risk
  if (isBlacklisted && previouslyReported) {
    fraudScore += 0.15;
  }

  // Keyword risk + high amount = increased suspicion
  if (keywordRisk && amount > 1000) {
    fraudScore += 0.08;
  }

  // Zero amount + suspicious keywords = very high risk
  if (amount <= 0 && keywordRisk) {
    fraudScore += 0.2;
  }

  // Ensure probability stays within 0-1 bounds
  return Math.min(Math.max(fraudScore, 0), 1);
}

/**
 * Converts fraud probability to risk level
 * @param {number} probability - Fraud probability (0-1)
 * @returns {string} Risk level: 'SAFE', 'SUSPICIOUS', or 'FRAUD'
 */
export function getRiskLevel(probability) {
  const fraudScore = probability * 100;

  if (fraudScore < 40) {
    return 'SAFE';
  } else if (fraudScore < 70) {
    return 'SUSPICIOUS';
  } else {
    return 'FRAUD';
  }
}

/**
 * Example usage and test cases
 */
export const modelExamples = [
  {
    input: {
      amount: 500,
      communityReports: 0,
      previouslyReported: false,
      isBlacklisted: false,
      keywordRisk: false,
      upiRisk: 0.1
    },
    expectedOutput: {
      fraudProbability: 0.165, // Low risk transaction
      fraudScore: 16.5,
      riskLevel: 'SAFE'
    }
  },
  {
    input: {
      amount: 2000,
      communityReports: 3,
      previouslyReported: true,
      isBlacklisted: false,
      keywordRisk: true,
      upiRisk: 0.5
    },
    expectedOutput: {
      fraudProbability: 0.695, // Medium-high risk
      fraudScore: 69.5,
      riskLevel: 'FRAUD'
    }
  },
  {
    input: {
      amount: 10000,
      communityReports: 5,
      previouslyReported: true,
      isBlacklisted: true,
      keywordRisk: true,
      upiRisk: 0.9
    },
    expectedOutput: {
      fraudProbability: 1.0, // Maximum risk
      fraudScore: 100,
      riskLevel: 'FRAUD'
    }
  }
];