import { create } from "zustand";
import {
  loginService,
  registerService,
  getProfileService,          // student: /student/me
  sendOtpService,
  verifyOtpService,
  adminLoginService,          // superadmin login
  instructorLoginService,     // instructor login
  getInstructorProfileService,// instructor: /instructor/profile
  updateInstructorProfileService,
} from "../service/login.service";

const isClient = typeof window !== "undefined";

const normaliseRole = (role) => role?.toLowerCase().trim();

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  success: false,
  _hasHydrated: false,

  reset: () => set({ error: null, success: false }),

  // --------------------------------------------------------------
  // HYDRASTE from localStorage (no API calls for superadmin)
  // --------------------------------------------------------------
  hydrate: () => {
    if (!isClient) return;
    const storedToken = localStorage.getItem("token");
    if (storedToken && !get().token) {
      set({ token: storedToken, _hasHydrated: true, loading: true });
      const storedRole = localStorage.getItem("user_role") || "";
      const roleLower = normaliseRole(storedRole);

      if (roleLower === "instructor") {
        get().fetchInstructorProfile();
      } else if (roleLower === "superadmin") {
        // ✅ restore user from localStorage (no API call)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            if (user?.role) user.role = normaliseRole(user.role);
            set({ user, loading: false });
          } catch (e) {
            set({ loading: false });
          }
        } else {
          set({ loading: false });
        }
      } else {
        // student
        get().getProfile();
      }
    } else {
      set({ _hasHydrated: true });
    }
  },

  // --------------------------------------------------------------
  // LOGIN – stores user & token, fetches extra profile only for student/instructor
  // --------------------------------------------------------------
  login: async (credentials, role) => {
    set({ loading: true, error: null });
    try {
      let response;
      if (role === "student") response = await loginService(credentials);
      else if (role === "instructor") response = await instructorLoginService(credentials);
      else response = await adminLoginService(credentials); // superadmin

      let token, user;
      if (role === "instructor") {
        token = response.token;
        user = response.instructor;
      } else {
        token = response.token;
        user = response.user;
      }

      // Normalise role
      if (user?.role) user.role = normaliseRole(user.role);
      else if (role === "superadmin") user = { ...user, role: "superadmin" };
      else if (role === "instructor") user = { ...user, role: "instructor" };
      else user = { ...user, role: "student" };

      // Persist immediately
      localStorage.setItem("token", token);
      localStorage.setItem("user_role", user.role);
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = `auth_token=${token}; path=/`;
      document.cookie = `user_role=${user.role}; path=/`;

      set({ token, user, loading: false });

      // ✅ Fetch additional profile ONLY for student or instructor
      if (role === "student") {
        await get().getProfile(true);
      } else if (role === "instructor") {
        await get().fetchInstructorProfile();
      }
      // ✅ superadmin: no extra fetch – login data is complete

      set({ success: true });
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // --------------------------------------------------------------
  // STUDENT profile (GET /student/me)
  // --------------------------------------------------------------
  getProfile: async (force = false) => {
    const state = get();
    if (!force && (state.loading || state.user?.fullName)) return;
    set({ loading: true, error: null });
    try {
      const data = await getProfileService();
      const currentRole = state.user?.role || "student";
      // Merge: keep existing role if backend doesn't return it
      const mergedUser = {
        ...state.user,
        ...data,
        role: data?.role ? normaliseRole(data.role) : currentRole,
      };
      set({ user: mergedUser, loading: false });
      localStorage.setItem("user", JSON.stringify(mergedUser));
    } catch (error) {
      if (error?.response?.status === 404) {
        // No student profile yet – keep minimal user (only role)
        const minimalUser = { role: "student" };
        set({ user: minimalUser, loading: false });
        localStorage.setItem("user", JSON.stringify(minimalUser));
      } else {
        set({ error: error?.message || "Fetch profile failed", loading: false });
        if (error?.response?.status === 401 && isClient) {
          localStorage.removeItem("token");
          set({ token: null, user: null });
        }
      }
    }
  },

  // --------------------------------------------------------------
  // INSTRUCTOR profile (GET /instructor/profile)
  // --------------------------------------------------------------
  fetchInstructorProfile: async (force = false) => {
    const state = get();
    if (!force && (state.loading || state.user?.fullName)) return;
    set({ loading: true, error: null });
    try {
      const data = await getInstructorProfileService();
      const currentRole = state.user?.role || "instructor";
      const mergedUser = {
        ...state.user,
        ...data,
        role: data?.role ? normaliseRole(data.role) : currentRole,
      };
      set({ user: mergedUser, loading: false });
      localStorage.setItem("user", JSON.stringify(mergedUser));
    } catch (error) {
      set({ error: error?.message || "Failed to load instructor profile", loading: false });
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        set({ token: null, user: null });
      }
    }
  },

  updateInstructorProfile: async (formData) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateInstructorProfileService(formData);
      if (updated?.role) updated.role = normaliseRole(updated.role);
      const newUser = { ...get().user, ...updated };
      set({ user: newUser, loading: false });
      localStorage.setItem("user", JSON.stringify(newUser));
      return updated;
    } catch (error) {
      set({ error: error?.message || "Update failed", loading: false });
      throw error;
    }
  },

  // --------------------------------------------------------------
  // SUPERADMIN – no profile fetch (no‑op)
  // --------------------------------------------------------------
  fetchSuperadminProfile: async () => {
    // Intentionally empty – superadmin user is complete from login
    return;
  },

  // --------------------------------------------------------------
  // OTP & REGISTER (unchanged)
  // --------------------------------------------------------------
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
        set({ token: res.token, loading: false, success: true });
        await get().getProfile(); // student profile after OTP login
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

  // --------------------------------------------------------------
  // LOGOUT
  // --------------------------------------------------------------
  logout: () => {
    if (isClient) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user");
      sessionStorage.clear();
    }
    set({ user: null, token: null, loading: false, error: null, success: false, _hasHydrated: true });
  },
}));

if (isClient) {
  useAuthStore.getState().hydrate();
}