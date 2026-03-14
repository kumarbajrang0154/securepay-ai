import mongoose from "mongoose";

const fraudReportSchema = new mongoose.Schema({

mobile: {
type: String,
required: true
},

merchant: {
type: String,
required: true
},

upiId: {
type: String,
required: true
},

amount: {
type: Number,
default: 0
},

reason: {
type: String,
required: true
},

qrData: {
type: String
},

reportedAt: {
type: Date,
default: Date.now
}

});

export default mongoose.model(
"FraudReport",
fraudReportSchema
);