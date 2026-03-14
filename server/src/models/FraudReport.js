import mongoose from "mongoose";

const fraudReportSchema = new mongoose.Schema(
  {
    qrHash: {
      type: String,
      required: true,
      index: true,
    },

    mobile: {
      type: String,
      required: false,
      default: "",
    },

    merchant: {
      type: String,
      required: false,
      default: "",
    },

    upiId: {
      type: String,
      required: false,
      default: "",
    },

    amount: {
      type: Number,
      default: 0,
    },

    reason: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    qrData: {
      type: String,
      default: "",
    },

    reporterEmail: {
      type: String,
      default: "",
    },

    reporterIP: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "verified", "false_positive"],
      default: "pending",
    },

    verificationNotes: {
      type: String,
      default: "",
    },

    verifiedAt: {
      type: Date,
    },

    reportedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("FraudReport", fraudReportSchema);
