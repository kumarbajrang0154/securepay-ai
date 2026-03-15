import Transaction from "../models/Transaction.js";

/**
 * Get user behavior statistics for a specific UPI ID
 * @param {string} upiId - The UPI ID to analyze
 * @returns {Object} Behavior statistics
 */
export const getUserBehaviorStats = async (upiId) => {
  try {
    if (!upiId) {
      return {
        cancelCount: 0,
        attemptCount: 0,
        completionRate: 0,
        totalScans: 0
      };
    }

    // Get all transactions for this UPI ID
    const transactions = await Transaction.find({ upiId });

    let cancelCount = 0;
    let attemptCount = 0;
    let completionCount = 0;
    const totalScans = transactions.length;

    transactions.forEach(transaction => {
      if (transaction.paymentAttempted) {
        attemptCount++;
        if (transaction.paymentCancelled) {
          cancelCount++;
        } else if (transaction.paymentCompleted) {
          completionCount++;
        }
      }
    });

    const completionRate = attemptCount > 0 ? (completionCount / attemptCount) * 100 : 0;

    return {
      cancelCount,
      attemptCount,
      completionCount,
      completionRate: Math.round(completionRate * 100) / 100, // Round to 2 decimal places
      totalScans
    };
  } catch (error) {
    console.error("Error getting user behavior stats:", error);
    return {
      cancelCount: 0,
      attemptCount: 0,
      completionRate: 0,
      totalScans: 0
    };
  }
};

/**
 * Generate smart fraud warnings based on multiple factors
 * @param {Object} analysisData - Analysis data from fraud engine
 * @param {Object} behaviorStats - User behavior statistics
 * @returns {Array} Array of warning messages
 */
export const generateSmartWarnings = (analysisData, behaviorStats) => {
  const warnings = [];

  const {
    fraudProbability,
    communityReports,
    isBlacklisted,
    riskLevel
  } = analysisData;

  const {
    cancelCount,
    attemptCount,
    completionRate,
    totalScans
  } = behaviorStats;

  // Critical warnings (highest priority)
  if (isBlacklisted) {
    warnings.push("🚫 CRITICAL: This UPI ID is blacklisted by the SecurePay AI community");
  }

  // High fraud probability warnings
  if (fraudProbability > 0.8) {
    warnings.push(`🔴 EXTREME RISK: ${Math.round(fraudProbability * 100)}% fraud probability detected`);
  } else if (fraudProbability > 0.7) {
    warnings.push(`🔴 HIGH RISK: ${Math.round(fraudProbability * 100)}% fraud probability detected`);
  } else if (fraudProbability > 0.5) {
    warnings.push(`🟠 MODERATE RISK: ${Math.round(fraudProbability * 100)}% fraud probability detected`);
  }

  // Community-based warnings
  if (communityReports >= 10) {
    warnings.push(`👥 COMMUNITY ALERT: Reported by ${communityReports} users as fraudulent`);
  } else if (communityReports >= 5) {
    warnings.push(`⚠️ COMMUNITY WARNING: Reported by ${communityReports} users`);
  } else if (communityReports >= 3) {
    warnings.push(`ℹ️ COMMUNITY NOTE: Reported by ${communityReports} users`);
  }

  // Behavioral warnings based on payment cancellation patterns
  if (cancelCount >= 15) {
    warnings.push(`🚨 BEHAVIORAL ALERT: ${cancelCount} users cancelled payments for this UPI ID`);
  } else if (cancelCount >= 10) {
    warnings.push(`⚠️ PAYMENT PATTERN: ${cancelCount} users cancelled payments - exercise caution`);
  } else if (cancelCount >= 5 && completionRate < 30) {
    warnings.push(`⚠️ SUSPICIOUS PATTERN: High cancellation rate (${cancelCount} cancellations, ${completionRate}% completion)`);
  }

  // Low completion rate warnings
  if (attemptCount >= 10 && completionRate < 20) {
    warnings.push(`📉 LOW SUCCESS RATE: Only ${completionRate}% of payment attempts completed`);
  } else if (attemptCount >= 5 && completionRate < 40) {
    warnings.push(`📊 COMPLETION RATE: ${completionRate}% of payments completed successfully`);
  }

  // Risk level based warnings
  if (riskLevel === "FRAUD") {
    warnings.push("🚫 FRAUD DETECTED: This transaction shows strong indicators of fraud");
  } else if (riskLevel === "SUSPICIOUS") {
    warnings.push("⚠️ SUSPICIOUS: This transaction requires careful review");
  }

  // Scan frequency warnings
  if (totalScans >= 50) {
    warnings.push(`📈 HIGH ACTIVITY: This UPI ID has been scanned ${totalScans} times`);
  }

  return warnings;
};

/**
 * Update transaction with payment attempt
 * @param {string} mobile - User mobile number
 * @param {string} upiId - UPI ID
 * @returns {boolean} Success status
 */
export const trackPaymentAttempt = async (mobile, upiId) => {
  try {
    if (!mobile || !upiId) return false;

    // Find the most recent transaction for this user and UPI ID
    const transaction = await Transaction.findOne(
      { mobile, upiId },
      {},
      { sort: { scannedAt: -1 } }
    );

    if (transaction && !transaction.paymentAttempted) {
      transaction.paymentAttempted = true;
      await transaction.save();
      console.log(`Payment attempt tracked for ${mobile} on UPI ${upiId}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error tracking payment attempt:", error);
    return false;
  }
};

/**
 * Update transaction with payment cancellation
 * @param {string} mobile - User mobile number
 * @param {string} upiId - UPI ID
 * @returns {boolean} Success status
 */
export const trackPaymentCancellation = async (mobile, upiId) => {
  try {
    if (!mobile || !upiId) return false;

    // Find the most recent transaction for this user and UPI ID
    const transaction = await Transaction.findOne(
      { mobile, upiId },
      {},
      { sort: { scannedAt: -1 } }
    );

    if (transaction && transaction.paymentAttempted && !transaction.paymentCompleted) {
      transaction.paymentCancelled = true;
      await transaction.save();
      console.log(`Payment cancellation tracked for ${mobile} on UPI ${upiId}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error tracking payment cancellation:", error);
    return false;
  }
};

/**
 * Update transaction with payment completion
 * @param {string} mobile - User mobile number
 * @param {string} upiId - UPI ID
 * @returns {boolean} Success status
 */
export const trackPaymentCompletion = async (mobile, upiId) => {
  try {
    if (!mobile || !upiId) return false;

    // Find the most recent transaction for this user and UPI ID
    const transaction = await Transaction.findOne(
      { mobile, upiId },
      {},
      { sort: { scannedAt: -1 } }
    );

    if (transaction && transaction.paymentAttempted && !transaction.paymentCompleted) {
      transaction.paymentCompleted = true;
      transaction.paymentCancelled = false; // Ensure cancelled is false
      await transaction.save();
      console.log(`Payment completion tracked for ${mobile} on UPI ${upiId}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error tracking payment completion:", error);
    return false;
  }
};