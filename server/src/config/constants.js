// Environment Configuration
export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/securepay-ai',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  fraudThresholds: {
    green: 0.3,    // 0-30%
    yellow: 0.7,   // 30-70%
    red: 1.0,      // 70-100%
  },
  riskFactorWeights: {
    unknownMerchant: 0.15,
    suspiciousPattern: 0.2,
    newAccount: 0.1,
    largeAmount: 0.15,
    frequentTransactions: 0.1,
    blacklistedUPI: 0.3,
  },
}

export default config
