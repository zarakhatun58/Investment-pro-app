import { Schema, model } from "mongoose";

const investmentSchema =
new Schema(
{
  user:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
    index:true
  },

  amount:{
    type:Number,
    required:true
  },

  planName:String,

  startDate:Date,

  endDate:Date,

  dailyROI:Number,

  status:{
    type:String,
    enum:[
      "ACTIVE",
      "COMPLETED",
      "CANCELLED"
    ],
    default:"ACTIVE"
  }
},
{
  timestamps:true
});

investmentSchema.index({
  user:1,
  status:1
});



export default
    model(
"Investment",
investmentSchema
);