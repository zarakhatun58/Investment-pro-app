import { create } from "zustand";
import api from "../lib/api";

export interface ReferralUser {
  _id: string;
  fullName: string;
  email: string;
  referralCode: string;
  createdAt: string;
  children?: ReferralUser[];
}

interface ReferralState {
  directReferrals: any[];
  referralTree: any | null;

  fetchDirectReferrals: () => Promise<void>;
  fetchReferralTree: () => Promise<void>;
}

export const useReferralStore = create<ReferralState>((set) => ({
  directReferrals: [],
  referralTree: null,

  fetchDirectReferrals: async () => {
    try {
      const res = await api.get("/referrals/direct");

      set({
        directReferrals: res.data.referrals || [],
      });
    } catch (err) {
      console.log(err);
    }
  },

  fetchReferralTree: async () => {
    try {
      const res = await api.get("/referrals/tree");

      set({
        referralTree: res.data.tree || null,
      });
    } catch (err) {
      console.log(err);
    }
  },
}));