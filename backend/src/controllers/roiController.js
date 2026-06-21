import ROIHistory from "../models/ROIHistory.js";

export const getROIHistory = async (req, res) => {
  try {
    const history = await ROIHistory.find({
      user: req.user.id,
    })
      .populate("investment")
      .sort({ date: -1 });

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};