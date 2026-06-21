import User from "../models/User.js";
import Investment from "../models/Investment.js";

export const getDashboard = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const investments =
      await Investment.aggregate([
        {
          $match: {
            user: user._id,
          },
        },
        {
          $group: {
            _id: null,
            totalInvestment: {
              $sum: "$amount",
            },
          },
        },
      ]);

    const activeInvestments =
      await Investment.countDocuments({
        user: user._id,
        status: "ACTIVE",
      });

    const totalReferrals =
      await User.countDocuments({
        referredBy: user._id,
      });

    res.json({
      success: true,

      walletBalance:
        user.walletBalance,

      totalROIEarned:
        user.totalROIEarned,

      totalLevelIncome:
        user.totalLevelIncomeEarned,

      totalInvestment:
        investments[0]
          ?.totalInvestment || 0,

      activeInvestments,

      totalReferrals,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};