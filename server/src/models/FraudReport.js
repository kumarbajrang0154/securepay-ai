import mongoose from 'mongoose'

const fraudReportSchema = new mongoose.Schema(
  {
    qrHash: {
      type: String,
      required: true,
    },
    qrData: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      enum: ['phishing', 'malware', 'money_fraud', 'identity_theft', 'other'],
      required: true,
    },
    description: String,
    reporterEmail: String,
    reporterIP: String,
    status: {
      type: String,
      enum: ['pending', 'verified', 'false_positive', 'unresolved'],
      default: 'pending',
    },
    verificationNotes: String,
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

export const FraudReport = mongoose.model('FraudReport', fraudReportSchema)
