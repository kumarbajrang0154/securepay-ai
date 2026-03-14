import FraudReport from "../models/FraudReport.js";

export const createFraudReport = async (req, res) => {

try {

const {
mobile,
merchant,
upiId,
amount,
reason,
qrData
} = req.body;

const report = await FraudReport.create({

mobile,
merchant,
upiId,
amount,
reason,
qrData

});

res.json({
success: true,
report
});

} catch (error) {

console.error(error);

res.status(500).json({
error: "Failed to save report"
});

}

};

export const getUserReports = async (req, res) => {

try {

const { mobile } = req.params;

const reports = await FraudReport.find({
mobile
}).sort({ reportedAt: -1 });

res.json(reports);

} catch (error) {

res.status(500).json({
error: "Failed to fetch reports"
});

}

};