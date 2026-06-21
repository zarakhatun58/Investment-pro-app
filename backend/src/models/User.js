import { Schema, model } from "mongoose";

const userSchema = new Schema(
{
  fullName:{
    type:String,
    required:true
  },

  email:{
    type:String,
    unique:true,
    required:true,
    index:true
  },

  mobile:{
    type:String,
    unique:true,
    required:true
  },

  password:{
    type:String,
    required:true
  },

  referralCode:{
    type:String,
    unique:true,
    index:true
  },

  referredBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    default:null,
    index:true
  },

  walletBalance:{
    type:Number,
    default:0
  },

  totalROIEarned:{
    type:Number,
    default:0
  },

  totalLevelIncomeEarned:{
    type:Number,
    default:0
  },

  status:{
    type:String,
    enum:["ACTIVE","BLOCKED"],
    default:"ACTIVE"
  }
},
{
  timestamps:true
});

export default
    model("User", userSchema);