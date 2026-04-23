import { create } from "zustand";
import {
  loginService,
  registerService,
  getProfileService,
  sendOtpService,
  verifyOtpService,
} from "../service/login.service";

const isClient = typeof window !== "undefined";

// Read token from localStorage on initial store creation
const getInitialToken = () => {
  if (isClient) {
    return localStorage.getItem("token");
  }
  return null;
};

export const useAuthStore = create((set, get) => ({
  user: null,
  token: getInitialToken(),   // ✅ token is now loaded from storage
  loading: false,
  error: null,
  success: false,

  reset: () => set({ error: null, success: false }),

  // LOGIN
  login: async (data) => {
    set({ loading: true, error: null, success: false });
    try {
      const res = await loginService(data);
      if (res?.token) {
        if (isClient) localStorage.setItem("token", res.token);
        set({ token: res.token, loading: false, success: true });
      } else throw new Error("No token received");
      return res;
    } catch (error) {
      set({ error: error?.message || "Login failed", loading: false, success: false });
    }
  },

  // SEND OTP
  sendOtp: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await sendOtpService(data);
      set({ loading: false, success: true });
      return res;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || "Failed to send OTP" });
    }
  },

  // VERIFY OTP
  verifyOtp: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await verifyOtpService(data);
      if (res?.token) {
        if (isClient) localStorage.setItem("token", res.token);
        set({ loading: false, success: true, token: res.token });
      } else throw new Error("No token in OTP response");
      return res;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || "Invalid OTP" });
    }
  },

  // REGISTER
  register: async (data) => {
    set({ loading: true, error: null, success: false });
    try {
      await registerService(data);
      set({ loading: false, success: true });
    } catch (error) {
      set({ error: error?.message || "Register failed", loading: false, success: false });
    }
  },

  // GET PROFILE
  getProfile: async () => {
    const state = get();
    if (state.loading || state.user) return;
    set({ loading: true, error: null });
    try {
      const data = await getProfileService();
      const userData = data?.student || data;
      set({ user: userData, loading: false });
    } catch (error) {
      set({ error: error?.message || "Fetch profile failed", loading: false });
      if (error?.response?.status === 401 && isClient) {
        localStorage.removeItem("token");
        set({ token: null, user: null });
      }
    }
  },

  // LOGOUT
  logout: () => {
    if (isClient) {
      localStorage.removeItem("token");
      sessionStorage.clear();
    }
    set({ user: null, token: null, loading: false, error: null, success: false });
  },
}));