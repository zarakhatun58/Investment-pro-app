export interface User {

_id:string;

fullName:string;

email:string;

mobile:string;

referralCode:string;

walletBalance:number;

totalROIEarned:number;

totalLevelIncomeEarned:number;

}

export interface Investment {

_id:string;

amount:number;

planName:string;

dailyROI:number;

startDate:string;

endDate:string;

status:string;

}

export interface Plan {
  _id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  dailyROI: number;
  durationDays: number;
}
export interface ReferralUser {
  _id: string;
  fullName: string;
  email: string;
  referralCode: string;
  createdAt: string;
  children?: ReferralUser[];
}

