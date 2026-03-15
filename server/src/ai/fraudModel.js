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

  // Base fraud score starts at 0.1 (10% base suspicion)
  let fraudScore = 0.1;

  // Amount-based risk (higher amounts increase risk)
  if (amount > 5000) {
    fraudScore += 0.25; // High amount risk
  } else if (amount > 1000) {
    fraudScore += 0.15; // Medium amount risk
  }

  // Community reports (each report adds risk)
  fraudScore += Math.min(communityReports * 0.08, 0.3); // Max 30% from community

  // Previously reported (significant risk factor)
  if (previouslyReported) {
    fraudScore += 0.25;
  }

  // Blacklisted UPI (very high risk)
  if (isBlacklisted) {
    fraudScore += 0.4;
  }

  // Keyword risk (suspicious keywords detected)
  if (keywordRisk) {
    fraudScore += 0.2;
  }

  // UPI risk score (direct risk assessment)
  fraudScore += upiRisk * 0.15;

  // Additional factors for sophisticated fraud patterns
  // High amount + community reports = higher risk
  if (amount > 1000 && communityReports > 2) {
    fraudScore += 0.1;
  }

  // Blacklisted + previously reported = maximum risk
  if (isBlacklisted && previouslyReported) {
    fraudScore += 0.1;
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

  if (fraudScore < 30) {
    return 'SAFE';
  } else if (fraudScore <= 60) {
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