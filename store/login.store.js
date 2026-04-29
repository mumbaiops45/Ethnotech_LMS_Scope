import { create } from "zustand";
import {
  loginService,
  registerService,
  getProfileService,
  sendOtpService,
  verifyOtpService,
  adminLoginService,
  instructorLoginService,
  getInstructorProfileService,      // add this import
  updateInstructorProfileService,   // add this import
} from "../service/login.service";

const isClient = typeof window !== "undefined";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  success: false,
  _hasHydrated: false,

  reset: () => set({ error: null, success: false }),

hydrate: () => {
  if (!isClient) return;
  const storedToken = localStorage.getItem("token");
  if (storedToken && !get().token) {
    // 1. Set loading = true so profile page shows spinner
    set({ token: storedToken, _hasHydrated: true, loading: true });
    
    // 2. Get the stored role from localStorage
    const storedRole = localStorage.getItem("user_role") || "";
    const roleLower = storedRole.toLowerCase();
    
    // 3. Call correct profile fetcher based on role
    if (roleLower === "instructor") {
      get().fetchInstructorProfile();
    } else if (roleLower === "student") {
      get().getProfile();
    } else {
      // fallback – try student profile
      get().getProfile();
    }
  } else {
    set({ _hasHydrated: true });
  }
},

  login: async (credentials, role) => {
    set({ loading: true, error: null });
    try {
      let response;
      if (role === "student") response = await loginService(credentials);
      else if (role === "instructor") response = await instructorLoginService(credentials);
      else response = await adminLoginService(credentials);

      let token, user;
      if (role === "instructor") {
        token = response.token;
        user = response.instructor;
      } else {
        token = response.token;
        user = response.user;
      }

      set({ token, user, loading: false });
      localStorage.setItem("token", token);
      localStorage.setItem("user_role", user?.role || role);
      document.cookie = `auth_token=${token}; path=/`;
      if (user?.role) document.cookie = `user_role=${user.role}; path=/`;

      // After login, fetch full profile for students or instructors
      if (role === "student") await get().getProfile(true);
      else if (role === "instructor") await get().fetchInstructorProfile();

      set({ success: true });
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // ----- NEW: fetch instructor profile -----
  fetchInstructorProfile: async (force = false) => {
    const state = get();
    if (!force && (state.loading || state.user?.fullName)) return;
    set({ loading: true, error: null });
    try {
      const data = await getInstructorProfileService();
      set({ user: data, loading: false });
    } catch (error) {
      set({ error: error?.message || "Failed to load instructor profile", loading: false });
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        set({ token: null, user: null });
      }
    }
  },

  // ----- update instructor profile (called from profile page) -----
  updateInstructorProfile: async (formData) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateInstructorProfileService(formData);
      set({ user: { ...get().user, ...updated }, loading: false });
      return updated;
    } catch (error) {
      set({ error: error?.message || "Update failed", loading: false });
      throw error;
    }
  },

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

  verifyOtp: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await verifyOtpService(data);
      if (res?.token) {
        if (isClient) localStorage.setItem("token", res.token);
        set({ token: res.token, loading: false, success: true, _hasHydrated: true });
        await get().getProfile();
        return res;
      } else throw new Error("No token in OTP response");
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || "Invalid OTP" });
    }
  },

  register: async (data) => {
    set({ loading: true, error: null, success: false });
    try {
      await registerService(data);
      set({ loading: false, success: true });
    } catch (error) {
      set({ error: error?.message || "Register failed", loading: false, success: false });
    }
  },

  // Student-only profile
  getProfile: async (force = false) => {
    const state = get();
    if (state.user?.role && state.user.role !== "Student") return;
    if (!force && (state.loading || state.user)) return;
    set({ loading: true, error: null });
    try {
      const data = await getProfileService();
      set({ user: data, loading: false });
    } catch (error) {
      if (error?.response?.status === 404) {
        set({ user: {}, loading: false });
      } else {
        set({ error: error?.message || "Fetch profile failed", loading: false });
        if (error?.response?.status === 401 && isClient) {
          localStorage.removeItem("token");
          set({ token: null, user: null });
        }
      }
    }
  },

  logout: () => {
    if (isClient) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_role");
      sessionStorage.clear();
    }
    set({ user: null, token: null, loading: false, error: null, success: false, _hasHydrated: true });
  },
}));

if (isClient) {
  useAuthStore.getState().hydrate();
}