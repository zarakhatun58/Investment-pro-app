import { Schema, model } from "mongoose";

const transactionSchema =
new Schema(
{
  user:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },

  type:{
    type:String,
    enum:[
      "ROI",
      "LEVEL_INCOME",
      "WITHDRAW",
      "DEPOSIT"
    ]
  },

  amount:Number,

  remark:String
},
{
  timestamps:true
});

export default
    model(
"Transaction",
transactionSchema
);