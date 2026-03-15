/**
 * AI Fraud Service - Node.js integration with Python ML API
 * Communicates with Flask prediction API for real-time fraud detection
 */

import fetch from 'node-fetch';

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5001';

class AIFraudService {
  constructor() {
    this.apiUrl = FLASK_API_URL;
    this.isConnected = false;
  }

  /**
   * Check if Flask API is available
   * @returns {Promise<boolean>} True if API is responding
   */
  async checkConnection() {
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        timeout: 5000 // 5 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        this.isConnected = data.model_loaded || false;
        return this.isConnected;
      }

      this.isConnected = false;
      return false;
    } catch (error) {
      console.warn('AI Service not available:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Extract features from transaction data for ML prediction
   * @param {Object} transactionData - Transaction data
   * @param {Object} additionalFeatures - Additional features
   * @returns {Object} ML features
   */
  extractFeatures(transactionData, additionalFeatures = {}) {
    const merchant = (transactionData.merchant || '').toLowerCase();
    const upiId = (transactionData.upiId || '').toLowerCase();

    // Suspicious keywords detection
    const suspiciousKeywords = ['gift', 'reward', 'free', 'offer', 'bonus', 'lottery', 'prize', 'cashback'];
    const keywordRisk = suspiciousKeywords.some(keyword => merchant.includes(keyword)) ? 1 : 0;

    // UPI pattern risk detection
    const highRiskPatterns = ['scam', 'test', 'fake', 'fraud'];
    const upiPatternRisk = highRiskPatterns.some(pattern => upiId.includes(pattern)) ? 1 : 0;

    return {
      amount: Number(transactionData.amount) || 0,
      communityReports: Number(additionalFeatures.communityReports) || 0,
      previouslyReported: Boolean(additionalFeatures.previouslyReported),
      isBlacklisted: Boolean(additionalFeatures.isBlacklisted),
      keywordRisk: keywordRisk,
      upiPatternRisk: upiPatternRisk
    };
  }

  /**
   * Predict fraud probability using ML model
   * @param {Object} transactionData - Transaction data
   * @param {Object} additionalFeatures - Additional features
   * @returns {Promise<number>} Fraud probability (0-1) or null if failed
   */
  async predictFraud(transactionData, additionalFeatures = {}) {
    try {
      // Check connection first
      if (!this.isConnected) {
        const connected = await this.checkConnection();
        if (!connected) {
          console.warn('AI Service unavailable, falling back to rule-based detection');
          return null;
        }
      }

      // Extract features
      const features = this.extractFeatures(transactionData, additionalFeatures);

      // Make API request to Flask
      const response = await fetch(`${this.apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(features),
        timeout: 10000 // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      const fraudProbability = result.fraudProbability;

      // Validate probability range
      if (typeof fraudProbability !== 'number' || fraudProbability < 0 || fraudProbability > 1) {
        throw new Error('Invalid fraud probability returned');
      }

      console.log(`🤖 AI Prediction: ${(fraudProbability * 100).toFixed(1)}% fraud probability`);
      return fraudProbability;

    } catch (error) {
      console.error('AI prediction failed:', error.message);
      console.warn('Falling back to rule-based fraud detection');
      return null; // Return null to indicate fallback to rule-based system
    }
  }

  /**
   * Get AI service status
   * @returns {Promise<Object>} Service status information
   */
  async getStatus() {
    try {
      const connected = await this.checkConnection();
      return {
        available: connected,
        apiUrl: this.apiUrl,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      return {
        available: false,
        apiUrl: this.apiUrl,
        error: error.message,
        lastChecked: new Date().toISOString()
      };
    }
  }
}

// Export singleton instance
const aiFraudService = new AIFraudService();

export default aiFraudService;