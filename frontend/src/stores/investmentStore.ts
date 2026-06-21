import { create } from "zustand";
import api from "../lib/api";

interface InvestmentState {

investments:any[];

fetchInvestments:()=>Promise<void>;

createInvestment:
(data:any)=>Promise<void>;

}

export const useInvestmentStore =
create<InvestmentState>((set)=>({

investments:[],

fetchInvestments:async()=>{

const res =
await api.get(
"/investments"
);

set({
investments:
res.data.investments
});

},

createInvestment:
async(data)=>{

await api.post(
"/investments",
data
);

}

}));