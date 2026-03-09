/**
 * Fraud Detection Service
 * Calculates risk score and fraud indicators
 */

import { config } from '../config/constants.js'

export class FraudDetectionService {
  constructor() {
    this.weights = config.riskFactorWeights
    this.thresholds = config.fraudThresholds
  }

  /**
   * Analyze QR data and calculate fraud risk
   * @param {Object} qrData - Parsed QR data
   * @returns {Object} - Analysis result with risk score and factors
   */
  analyzeQRData(qrData) {
    const riskFactors = []
    let riskScore = 0

    // Extract UPI details
    const upiId = qrData.pa || 'unknown'
    const merchant = qrData.pn || 'Unknown Merchant'
    const amount = parseFloat(qrData.am) || 0
    const transactionType = this.getTransactionType(qrData)

    // Check for risk factors
    if (this.isUnknownMerchant(merchant)) {
      riskScore += this.weights.unknownMerchant
      riskFactors.push('Unknown or unverified merchant')
    }

    if (this.hasSuspiciousPattern(qrData)) {
      riskScore += this.weights.suspiciousPattern
      riskFactors.push('Suspicious transaction pattern detected')
    }

    if (this.isLargeAmount(amount)) {
      riskScore += this.weights.largeAmount
      riskFactors.push('Unusually large transaction amount')
    }

    if (this.isBlacklistedUPI(upiId)) {
      riskScore += this.weights.blacklistedUPI
      riskFactors.push('UPI ID on fraud watchlist')
    }

    if (this.hasInvalidFormat(qrData)) {
      riskScore += 0.2
      riskFactors.push('Invalid or malformed QR data')
    }

    // Normalize risk score to 0-1
    riskScore = Math.min(riskScore, 1.0)

    // Determine risk level
    const riskLevel = this.getRiskLevel(riskScore)

    return {
      upiId,
      merchant,
      amount,
      transactionType,
      riskScore,
      riskLevel,
      riskFactors,
      analysis: {
        isPhishingLikely: riskScore > 0.7,
        isMalwareLikely: riskScore > 0.8,
        isLegitimate: riskScore < 0.3,
      },
    }
  }

  /**
   * Determine risk level based on score
   */
  getRiskLevel(score) {
    if (score <= this.thresholds.green) return 'green'
    if (score <= this.thresholds.yellow) return 'yellow'
    return 'red'
  }

  /**
   * Check if merchant is unknown/unverified
   */
  isUnknownMerchant(merchant) {
    const knownMerchants = [
      'amazon',
      'flipkart',
      'paytm',
      'gpay',
      'phonepe',
      'whatsapp',
      'uber',
      'ola',
    ]
    return !knownMerchants.some(m => merchant.toLowerCase().includes(m))
  }

  /**
   * Check for suspicious patterns
   */
  hasSuspiciousPattern(qrData) {
    // Check for encoding issues
    if (qrData.raw && qrData.raw.includes('..')) return true
    
    // Check for unusual characters
    const upiId = qrData.pa || ''
    if (!/^[\w\.\-@]+$/.test(upiId)) return true

    return false
  }

  /**
   * Check if transaction amount is unusually large
   */
  isLargeAmount(amount) {
    return amount > 100000 // > 100k rupees
  }

  /**
   * Check if UPI is on fraud watchlist (simulated)
   */
  isBlacklistedUPI(upiId) {
    const blacklist = [
      'fraud@upi',
      'scam@okhdfcbank',
      'phishing@upi',
    ]
    return blacklist.includes(upiId.toLowerCase())
  }

  /**
   * Validate QR data format
   */
  hasInvalidFormat(qrData) {
    // Must have UPI payment address (pa)
    if (!qrData.pa) return true
    
    // UPI format validation
    const upiRegex = /^[a-zA-Z0-9.\-_]+@[a-zA-Z]{3,}$/
    return !upiRegex.test(qrData.pa)
  }

  /**
   * Determine transaction type
   */
  getTransactionType(qrData) {
    if (qrData.tr === 'P') return 'payment'
    if (qrData.tr === 'R') return 'request'
    return 'transfer'
  }

  /**
   * Parse UPI string format
   * Format: upi://pay?pa=upiid&pn=name&am=amount
   */
  static parseQRData(qrString) {
    try {
      if (qrString.startsWith('upi://')) {
        const params = new URLSearchParams(qrString.replace('upi://pay?', ''))
        return Object.fromEntries(params)
      }
      // If it's already an object
      if (typeof qrString === 'object') return qrString
      return null
    } catch (error) {
      return null
    }
  }
}

export default new FraudDetectionService()
