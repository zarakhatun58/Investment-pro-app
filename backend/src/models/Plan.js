import { Schema, model } from "mongoose";

const planSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    minAmount: {
      type: Number,
      required: true,
    },

    maxAmount: {
      type: Number,
      required: true,
    },

    dailyROI: {
      type: Number,
      required: true,
    },

    durationDays: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Plan", planSchema);