import Transaction from "../models/Transaction.js";

export const getTransactions = async (
  req,
  res
) => {
  try {
    const transactions =
      await Transaction.find({
        user: req.user.id,
      }).sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};