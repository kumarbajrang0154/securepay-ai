import mongoose from "mongoose";

const fraudStatsSchema = new mongoose.Schema({
  upiId: {
    type: String,
    required: true,
    unique: true,
  },
  merchant: {
    type: String,
  },
  reports: {
    type: Number,
    default: 1,
  },
  lastReported: {
    type: Date,
    default: Date.now,
  },
  isBlacklisted: {
    type: Boolean,
    default: false,
  },
});

const FraudStats = mongoose.model("FraudStats", fraudStatsSchema);

export default FraudStats;