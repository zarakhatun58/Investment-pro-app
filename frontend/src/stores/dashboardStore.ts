import { create } from "zustand";
import api from "../lib/api";

interface DashboardState {

  dashboard:any;

  fetchDashboard:()=>Promise<void>;

}

export const useDashboardStore =
create<DashboardState>((set)=>({

dashboard:null,

fetchDashboard:async()=>{

const res =
await api.get(
"/dashboard"
);

set({
dashboard:res.data
});

}

}));