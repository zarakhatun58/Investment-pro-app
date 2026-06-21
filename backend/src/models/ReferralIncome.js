import { Schema, model } from "mongoose";

const referralIncomeSchema =
new Schema(
{
  receiver:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },

  generatedBy:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },

  level:Number,

  amount:Number,

  date:{
    type:Date,
    default:Date.now
  }
},
{
  timestamps:true
});

export default
    model(
"ReferralIncome",
referralIncomeSchema
);