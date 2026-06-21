import { Schema, model } from "mongoose";

const roiHistorySchema =
new Schema(
{
  user:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },

  investment:{
    type:Schema.Types.ObjectId,
    ref:"Investment"
  },

  roiAmount:Number,

  date:{
    type:Date,
    required:true
  },

  status:{
    type:String,
    default:"CREDITED"
  }
},
{
  timestamps:true
});

roiHistorySchema.index(
{
  investment:1,
  date:1
},
{
  unique:true
});

export default
    model(
"ROIHistory",
roiHistorySchema
);