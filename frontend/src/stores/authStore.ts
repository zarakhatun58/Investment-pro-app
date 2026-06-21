import { create } from "zustand";
import api from "../lib/api";

interface User {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  referralCode: string;
  walletBalance: number;
  totalROIEarned: number;
  totalLevelIncomeEarned: number;
}

interface AuthState {
  user: User | null;
  token: string | null;

  loading: boolean;
  error: string | null;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (data: {
    fullName: string;
    email: string;
    mobile: string;
    password: string;
    referralCode?: string;
  }) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => void;

  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  token: localStorage.getItem("token"),

  loading: false,

  error: null,

  login: async (email, password) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        res.data.token
      );

      set({
        token: res.data.token,
        user: res.data.user,
      });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ||
          "Login failed",
      });

      throw err;
    } finally {
      set({
        loading: false,
      });
    }
  },

  register: async (data) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await api.post(
        "/auth/register",
        data
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      set({
        token: res.data.token,
        user: res.data.user,
      });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ||
          "Registration failed",
      });

      throw err;
    } finally {
      set({
        loading: false,
      });
    }
  },
  fetchUser: async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) return;

      const res =
        await api.get("/auth/profile");

      set({
        user: res.data.user,
      });
    } catch (err) {
      localStorage.removeItem("token");
    }
  },
  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
    });
  },

  clearError: () =>
    set({
      error: null,
    }),
}));