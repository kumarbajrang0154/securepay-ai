import Transaction from "../models/Transaction.js";

export const getTransactions = async (req, res) => {
  try {
    let mobile = (req.query.mobile || "").trim();

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    // Normalize mobile (handle + encoding)
    mobile = mobile.replace(/\s+/g, "+");

    const transactions = await Transaction.find({ mobile }).sort({ scannedAt: -1 });

    res.json({
      success: true,
      totalTransactions: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching transactions",
    });
  }
};