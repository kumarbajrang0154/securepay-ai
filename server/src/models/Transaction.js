import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    merchant: {
      type: String,
      required: true
    },

    upiId: {
      type: String,
      required: true
    },

    amount: {
      type: String,
      default: "0"
    },

    currency: {
      type: String,
      default: "INR"
    },

    fraudScore: {
      type: Number,
      default: 0
    },

    riskLevel: {
      type: String,
      enum: ["SAFE", "SUSPICIOUS", "FRAUD"],
      default: "SAFE"
    },

    reasons: {
      type: [String],
      default: []
    },

    raw: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;