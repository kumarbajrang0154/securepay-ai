import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    qrHash: {
      type: String,
      required: true,
      index: true,
    },

    merchant: {
      type: String,
      default: "Unknown Merchant",
    },

    upiId: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    fraudScore: {
      type: Number,
      default: 0,
    },

    riskLevel: {
      type: String,
      enum: ["SAFE", "SUSPICIOUS", "FRAUD"],
      default: "SAFE",
    },

    reasons: {
      type: [String],
      default: [],
    },

    raw: {
      type: String,
      default: "",
    },

    isReported: {
      type: Boolean,
      default: false,
    },

    reportCount: {
      type: Number,
      default: 0,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
