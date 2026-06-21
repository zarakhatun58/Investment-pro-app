import { create } from "zustand";
import api from "../lib/api";
import { Plan } from "../types";

interface DashboardStats {
  totalInvestment: number;
  totalROIEarned: number;
  totalLevelIncome: number;
  walletBalance: number;
  activeInvestments: number;
  totalReferrals: number;
}

interface DataState {
  dashboard: DashboardStats | null;
  plans: Plan[];
  investments: any[];
  roiHistory: any[];
  referralIncome: any[];
  directReferrals: any[];
  referralTree: any | null;

  isLoading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  fetchInvestments: () => Promise<void>;
  fetchROIHistory: () => Promise<void>;
  fetchReferralIncome: () => Promise<void>;
  fetchDirectReferrals: () => Promise<void>;
  fetchReferralTree: () => Promise<void>;

  createInvestment: (data: {
    amount: number;
    planName: string;
    dailyROI: number;
    durationDays: number;
  }) => Promise<void>;

  clearError: () => void;
}

export const useDataStore = create<DataState>((set) => ({
  dashboard: null,
  plans: [],
  investments: [],
  roiHistory: [],
  referralIncome: [],
  directReferrals: [],
  referralTree: null,

  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    try {
      set({ isLoading: true });

      const res =
        await api.get("/dashboard");

      set({
        dashboard: res.data,
      });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ||
          "Dashboard fetch failed",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchInvestments: async () => {
    try {
      set({ isLoading: true });

      const res =
        await api.get("/investments");

      set({
        investments:
          Array.isArray(res.data)
            ? res.data
            : res.data.investments || [],
      });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ||
          "Investment fetch failed",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchROIHistory: async () => {
    try {
      const res =
        await api.get("/roi-history");

      set({
        roiHistory: res.data.history || [],
      });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message,
      });
    }
  },
  fetchPlans: async () => {
    try {
      const res =
        await api.get("/plans");

      set({
        plans: res.data.plans,
      });
    } catch (error) {
      console.error(error);
    }
  },

  fetchReferralIncome: async () => {
    try {
      const res =
        await api.get(
          "/referrals/referral-income"
        );

      set({
        referralIncome: res.data.income || [],
      });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message,
      });
    }
  },

  fetchDirectReferrals: async () => {
    try {
      const res =
        await api.get(
          "/referrals/direct"
        );

      set({
        directReferrals: res.data.referrals || [],
      });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message,
      });
    }
  },

  fetchReferralTree: async () => {
    try {
      const res =
        await api.get(
          "/referrals/tree"
        );

      set({
        referralTree: res.data.tree || null,
      });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message,
      });
    }
  },

  createInvestment:
    async (data) => {
      try {
        await api.post(
          "/investments",
          data
        );
      } catch (err: any) {
        set({
          error:
            err.response?.data?.message,
        });
      }
    },

  clearError: () =>
    set({
      error: null,
    }),
}));