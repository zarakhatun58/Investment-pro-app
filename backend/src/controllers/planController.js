import Plan from "../models/Plan.js";

export const createPlan = async (req, res) => {
  try {
    const {
      name,
      minAmount,
      maxAmount,
      dailyROI,
      durationDays,
    } = req.body;

    const plan = await Plan.create({
      name,
      minAmount,
      maxAmount,
      dailyROI,
      durationDays,
    });

    res.status(201).json({
      success: true,
      plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({
      isActive: true,
    }).sort({
      minAmount: 1,
    });

    res.json({
      success: true,
      plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPlanById = async (
  req,
  res
) => {
  try {
    const plan = await Plan.findById(
      req.params.id
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    res.json({
      success: true,
      plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePlan = async (
  req,
  res
) => {
  try {
    const plan =
      await Plan.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json({
      success: true,
      plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePlan = async (
  req,
  res
) => {
  try {
    await Plan.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Plan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};