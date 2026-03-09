import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    qrHash: {
      type: String,
      required: true,
      unique: true,
    },
    upiId: {
      type: String,
      required: true,
    },
    merchant: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ['payment', 'request', 'transfer'],
      default: 'payment',
    },
    riskLevel: {
      type: String,
      enum: ['green', 'yellow', 'red'],
      default: 'green',
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 1,
    },
    riskFactors: [String],
    isReported: {
      type: Boolean,
      default: false,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    metadata: {
      userAgent: String,
      ipAddress: String,
      location: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Transaction = mongoose.model('Transaction', transactionSchema)
