import mongoose from "mongoose";

import User from "../models/User.js";
import Investment from "../models/Investment.js";
import ROIHistory from "../models/ROIHistory.js";
import Transaction from "../models/Transaction.js";

const processDailyROI = async () => {

  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const activeInvestments =
      await Investment.find({
        status: "ACTIVE"
      });

    for (const investment of activeInvestments) {

      const alreadyProcessed =
        await ROIHistory.findOne({
          investment: investment._id,
          date: today
        });

      if (alreadyProcessed) {
        continue;
      }

      const roiAmount =
        (investment.amount * investment.dailyROI) / 100;

      await ROIHistory.create([{
        user: investment.user,
        investment: investment._id,
        roiAmount,
        date: today,
        status: "CREDITED"
      }], { session });

      await User.findByIdAndUpdate(
        investment.user,
        {
          $inc: {
            walletBalance: roiAmount,
            totalROIEarned: roiAmount
          }
        },
        { session }
      );

      await Transaction.create([{
        user: investment.user,
        type: "ROI",
        amount: roiAmount,
        remark: "Daily ROI Credit"
      }], { session });

      if (
        investment.endDate &&
        new Date() > investment.endDate
      ) {

        investment.status = "COMPLETED";

        await investment.save({
          session
        });

      }

    }

    await session.commitTransaction();

  } catch (error) {

    await session.abortTransaction();

    console.error(error);

  } finally {

    session.endSession();

  }

};

export { processDailyROI };
export default processDailyROI;