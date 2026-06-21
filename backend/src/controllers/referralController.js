import User from "../models/User.js";
import buildTree from "../services/treeService.js";
import ReferralIncome from "../models/ReferralIncome.js";

export const directReferrals = async (req, res) => {
  try {
    const referrals = await User.find({
      referredBy: req.user.id,
    });

    res.json({
      success: true,
      referrals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const referralTree = async (req, res) => {
  try {
    const tree = await buildTree(
      req.user.id
    );

    res.json({
      success: true,
      tree,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getReferralIncomeHistory = async (
  req,
  res
) => {
  try {
    const income =
      await ReferralIncome.find({
        receiver: req.user.id,
      })
        .populate(
          "generatedBy",
          "fullName email"
        )
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};