import Transaction from "../models/Transaction.js";

export const getTransactions = async (req, res) => {
  try {

    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: transactions
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions"
    });

  }
};