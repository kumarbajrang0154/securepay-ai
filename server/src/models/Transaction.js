import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
    },
    merchant: {
      type: String,
      required: true,
    },
    upiId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    fraudScore: {
      type: Number,
      required: true,
    },
    fraudProbability: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    riskLevel: {
      type: String,
      required: true,
      enum: ["SAFE", "SUSPICIOUS", "FRAUD"],
    },
    communityReports: {
      type: Number,
      default: 0,
    },
    previouslyReported: {
      type: Boolean,
      default: false,
    },
    scannedAt: {
      type: Date,
      default: Date.now,
    },
    paymentAttempted: {
      type: Boolean,
      default: false,
    },
    paymentCompleted: {
      type: Boolean,
      default: false,
    },
    paymentCancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transactionSchema, "Transactions");
