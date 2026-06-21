import Investment from "../models/Investment.js";
import { distributeLevelIncome } from "../services/referralService.js";

export const createInvestment = async (req, res) => {
  try {
    const {
      amount,
      planName,
      dailyROI,
      durationDays,
    } = req.body;

    const investment =
      await Investment.create({
        user: req.user.id,
        amount,
        planName,
        dailyROI,
        startDate: new Date(),
        endDate: new Date(
          Date.now() +
            durationDays * 24 * 60 * 60 * 1000
        ),
      });

    await distributeLevelIncome(
      req.user.id,
      amount
    );

    res.status(201).json({
      success: true,
      investment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInvestments = async (
  req,
  res
) => {
  try {
    const investments =
      await Investment.find({
        user: req.user.id,
      }).sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      investments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};