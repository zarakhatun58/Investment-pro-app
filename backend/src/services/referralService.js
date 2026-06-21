import User from "../models/User.js";
import ReferralIncome from "../models/ReferralIncome.js";
import Transaction from "../models/Transaction.js";

const LEVEL_PERCENTAGES = {
  1: 10,
  2: 5,
  3: 3,
  4: 2,
  5: 1,
};

export const distributeLevelIncome = async (
  userId,
  investmentAmount
) => {
  let currentUser =
    await User.findById(userId);

  let level = 1;

  while (
    currentUser &&
    currentUser.referredBy &&
    level <= 5
  ) {
    const parent =
      await User.findById(
        currentUser.referredBy
      );

    if (!parent) break;

    const amount =
      (investmentAmount *
        LEVEL_PERCENTAGES[level]) /
      100;

    await User.findByIdAndUpdate(
      parent._id,
      {
        $inc: {
          walletBalance: amount,
          totalLevelIncomeEarned: amount,
        },
      }
    );

    await ReferralIncome.create({
      receiver: parent._id,
      generatedBy: userId,
      level,
      amount,
    });

    await Transaction.create({
      user: parent._id,
      type: "LEVEL_INCOME",
      amount,
      remark: `Level ${level} Income`,
    });

    currentUser = parent;
    level++;
  }
};

export default distributeLevelIncome;