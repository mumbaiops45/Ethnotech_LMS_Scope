// // // import { create } from "zustand";
// // // import {
// // //   loginService,
// // //   registerService,
// // //   getProfileService,
// // //   sendOtpService,
// // //   verifyOtpService,
// // // } from "../service/login.service";

// // // const isClient = typeof window !== "undefined";

// // // export const useAuthStore = create((set, get) => ({
// // //   user: null,
// // //   token: null,
// // //   loading: false,
// // //   error: null,
// // //   success: false,
// // //   _hasHydrated: false,   // ✅ track hydration state

// // //   reset: () => set({ error: null, success: false }),

// // //   // ✅ Hydrate: load token from localStorage and set _hasHydrated to true
// // //   hydrate: () => {
// // //     if (!isClient) return;
// // //     const storedToken = localStorage.getItem("token");
// // //     if (storedToken) {
// // //       set({ token: storedToken, _hasHydrated: true });
// // //       // Optionally fetch profile after hydration
// // //       setTimeout(() => {
// // //         if (!get().user && !get().loading) {
// // //           get().getProfile();
// // //         }
// // //       }, 100);
// // //     } else {
// // //       set({ _hasHydrated: true });
// // //     }
// // //   },

// // //   // LOGIN – remains mostly the same, but after login we can optionally call hydrate again
// // //   login: async (data) => {
// // //     set({ loading: true, error: null, success: false });
// // //     try {
// // //       const res = await loginService(data);
// // //       if (res?.token) {
// // //         if (isClient) localStorage.setItem("token", res.token);
// // //         set({ token: res.token, loading: false, _hasHydrated: true });
// // //         // Fetch profile after login
// // //         await get().getProfile();
// // //         set({ success: true });
// // //         return res;
// // //       } else throw new Error("No token received");
// // //     } catch (error) {
// // //       set({ error: error?.message || "Login failed", loading: false, success: false });
// // //     }
// // //   },

// // //   // SEND OTP (unchanged)
// // //   sendOtp: async (data) => {
// // //     set({ loading: true, error: null });
// // //     try {
// // //       const res = await sendOtpService(data);
// // //       set({ loading: false, success: true });
// // //       return res;
// // //     } catch (error) {
// // //       set({ loading: false, error: error.response?.data?.message || "Failed to send OTP" });
// // //     }
// // //   },

// // //   // VERIFY OTP
// // //   verifyOtp: async (data) => {
// // //     set({ loading: true, error: null });
// // //     try {
// // //       const res = await verifyOtpService(data);
// // //       if (res?.token) {
// // //         if (isClient) localStorage.setItem("token", res.token);
// // //         set({ token: res.token, loading: false, success: true, _hasHydrated: true });
// // //         await get().getProfile();
// // //       } else throw new Error("No token in OTP response");
// // //       return res;
// // //     } catch (error) {
// // //       set({ loading: false, error: error.response?.data?.message || "Invalid OTP" });
// // //     }
// // //   },

// // //   // REGISTER (unchanged)
// // //   register: async (data) => {
// // //     set({ loading: true, error: null, success: false });
// // //     try {
// // //       await registerService(data);
// // //       set({ loading: false, success: true });
// // //     } catch (error) {
// // //       set({ error: error?.message || "Register failed", loading: false, success: false });
// // //     }
// // //   },

// // //   // GET PROFILE
// // //  getProfile: async (force = false) => {
// // //   const state = get();
// // //   if (!force && (state.loading || state.user)) return;
// // //   set({ loading: true, error: null });
// // //   try {
// // //     const data = await getProfileService();
// // //     const userData = data?.student || data;
// // //     set({ user: userData, loading: false });
// // //   } catch (error) {
// // //     set({ error: error?.message || "Fetch profile failed", loading: false });
// // //     if (error?.response?.status === 401 && isClient) {
// // //       localStorage.removeItem("token");
// // //       set({ token: null, user: null });
// // //     }
// // //   }
// // // },

// // //   // LOGOUT
// // //   logout: () => {
// // //     if (isClient) {
// // //       localStorage.removeItem("token");
// // //       sessionStorage.clear();
// // //     }
// // //     set({ user: null, token: null, loading: false, error: null, success: false, _hasHydrated: true });
// // //   },
// // // }));

// // // // Auto‑hydrate as soon as the store is created (client‑side only)
// // // if (isClient) {
// // //   useAuthStore.getState().hydrate();
// // // }



// // import { create } from "zustand";
// // import {
// //   loginService,
// //   registerService,
// //   getProfileService,
// //   sendOtpService,
// //   verifyOtpService,
// //   adminLoginService,
// // } from "../service/login.service";

// // const isClient = typeof window !== "undefined";

// // export const useAuthStore = create((set, get) => ({
// //   user: null,
// //   token: null,
// //   loading: false,
// //   error: null,
// //   success: false,
// //   _hasHydrated: false,

// //   reset: () => set({ error: null, success: false }),

// //   hydrate: () => {
// //     if (!isClient) return;
// //     const storedToken = localStorage.getItem("token");
// //     if (storedToken && !get().token) {
// //       set({ token: storedToken, _hasHydrated: true });
// //       setTimeout(() => {
// //         if (!get().user && !get().loading) get().getProfile();
// //       }, 100);
// //     } else {
// //       set({ _hasHydrated: true });
// //     }
// //   },

// //   // Unified login – 'role' can be "student", "superadmin", or "instructor"
// //   login: async (data, role) => {
// //     set({ loading: true, error: null, success: false });
// //     try {
// //       let res;
// //       if (role === "student") {
// //         res = await loginService(data);
// //       } else {
// //         res = await adminLoginService(data);
// //       }

// //       if (res?.token) {
// //         if (isClient) localStorage.setItem("token", res.token);
// //         set({ token: res.token, loading: false, _hasHydrated: true });

// //         let userData = null;
// //         if (role === "student") {
// //           userData = res.student || null;
// //         } else {
// //           userData = res.admin || null;
// //         }
// //         set({ user: userData });

// //         // For students, fetch the full profile (includes extra fields)
// //         if (role === "student") await get().getProfile();

// //         set({ success: true });
// //         return res;
// //       } else throw new Error("No token received");
// //     } catch (error) {
// //       set({ error: error?.message || "Login failed", loading: false, success: false });
// //     }
// //   },

// //   sendOtp: async (data) => {
// //     set({ loading: true, error: null });
// //     try {
// //       const res = await sendOtpService(data);
// //       set({ loading: false, success: true });
// //       return res;
// //     } catch (error) {
// //       set({ loading: false, error: error.response?.data?.message || "Failed to send OTP" });
// //     }
// //   },

// //   verifyOtp: async (data) => {
// //     set({ loading: true, error: null });
// //     try {
// //       const res = await verifyOtpService(data);
// //       if (res?.token) {
// //         if (isClient) localStorage.setItem("token", res.token);
// //         set({ token: res.token, loading: false, success: true, _hasHydrated: true });
// //         await get().getProfile();
// //         return res;
// //       } else throw new Error("No token in OTP response");
// //     } catch (error) {
// //       set({ loading: false, error: error.response?.data?.message || "Invalid OTP" });
// //     }
// //   },

// //   register: async (data) => {
// //     set({ loading: true, error: null, success: false });
// //     try {
// //       await registerService(data);
// //       set({ loading: false, success: true });
// //     } catch (error) {
// //       set({ error: error?.message || "Register failed", loading: false, success: false });
// //     }
// //   },

// //   // Gets the full profile from /student/me (only for students)
// //   getProfile: async (force = false) => {
// //     const state = get();
// //     if (!force && (state.loading || state.user)) return;
// //     set({ loading: true, error: null });
// //     try {
// //       const data = await getProfileService();   // data already contains fullName, photo, dob, ...
// //       set({ user: data, loading: false });
// //     } catch (error) {
// //       set({ error: error?.message || "Fetch profile failed", loading: false });
// //       if (error?.response?.status === 401 && isClient) {
// //         localStorage.removeItem("token");
// //         set({ token: null, user: null });
// //       }
// //     }
// //   },

// //   logout: () => {
// //     if (isClient) {
// //       localStorage.removeItem("token");
// //       sessionStorage.clear();
// //     }
// //     set({ user: null, token: null, loading: false, error: null, success: false, _hasHydrated: true });
// //   },
// // }));

// // if (isClient) {
// //   useAuthStore.getState().hydrate();
// // }


// import { create } from "zustand";
// import {
//   loginService,
//   registerService,
//   getProfileService,
//   sendOtpService,
//   verifyOtpService,
//   adminLoginService,
// } from "../service/login.service";

// const isClient = typeof window !== "undefined";

// export const useAuthStore = create((set, get) => ({
//   user: null,
//   token: null,
//   loading: false,
//   error: null,
//   success: false,
//   _hasHydrated: false,

//   reset: () => set({ error: null, success: false }),

//   hydrate: () => {
//     if (!isClient) return;
//     const storedToken = localStorage.getItem("token");
//     if (storedToken && !get().token) {
//       set({ token: storedToken, _hasHydrated: true });
//       // For students, auto-fetch profile; for admins, user already has data
//       if (!get().user && !get().loading) {
//         get().getProfile();
//       }
//     } else {
//       set({ _hasHydrated: true });
//     }
//   },

//   // Unified login – role: "student", "superadmin", or "instructor"
//   login: async (data, role) => {
//     set({ loading: true, error: null, success: false });
//     try {
//       let res;
//       if (role === "student") {
//         res = await loginService(data);
//       } else {
//         res = await adminLoginService(data);
//       }

//       if (res?.token) {
//         if (isClient) localStorage.setItem("token", res.token);
//         set({ token: res.token, loading: false, _hasHydrated: true });

//         let userData = null;
//         if (role === "student") {
//           userData = res.student || null;          // basic student info from login
//         } else {
//           userData = res.admin || null;            // admin info (fullName, email, role, branch, gender)
//         }
//         set({ user: userData });

//         // For students, fetch the complete profile (/student/me)
//         if (role === "student") await get().getProfile();

//         set({ success: true });
//         return res;
//       } else throw new Error("No token received");
//     } catch (error) {
//       set({ error: error?.message || "Login failed", loading: false, success: false });
//     }
//   },

//   sendOtp: async (data) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await sendOtpService(data);
//       set({ loading: false, success: true });
//       return res;
//     } catch (error) {
//       set({ loading: false, error: error.response?.data?.message || "Failed to send OTP" });
//     }
//   },

//   verifyOtp: async (data) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await verifyOtpService(data);
//       if (res?.token) {
//         if (isClient) localStorage.setItem("token", res.token);
//         set({ token: res.token, loading: false, success: true, _hasHydrated: true });
//         await get().getProfile();   // fetch student profile
//         return res;
//       } else throw new Error("No token in OTP response");
//     } catch (error) {
//       set({ loading: false, error: error.response?.data?.message || "Invalid OTP" });
//     }
//   },

//   register: async (data) => {
//     set({ loading: true, error: null, success: false });
//     try {
//       await registerService(data);
//       set({ loading: false, success: true });
//     } catch (error) {
//       set({ error: error?.message || "Register failed", loading: false, success: false });
//     }
//   },

//   // Only for students – returns the full profile from /student/me
//   getProfile: async (force = false) => {
//     const state = get();
//     // Skip if already loading or if user is an admin (has role)
//     if (state.user?.role && state.user.role !== "Student") return;
//     if (!force && (state.loading || state.user)) return;

//     set({ loading: true, error: null });
//     try {
//       const data = await getProfileService();   // returns { fullName, photo, dob, gender, education, program, branch }
//       set({ user: data, loading: false });
//     } catch (error) {
//       set({ error: error?.message || "Fetch profile failed", loading: false });
//       if (error?.response?.status === 401 && isClient) {
//         localStorage.removeItem("token");
//         set({ token: null, user: null });
//       }
//     }
//   },

//   logout: () => {
//     if (isClient) {
//       localStorage.removeItem("token");
//       sessionStorage.clear();
//     }
//     set({ user: null, token: null, loading: false, error: null, success: false, _hasHydrated: true });
//   },
// }));

// // Auto‑hydrate on the client
// if (isClient) {
//   useAuthStore.getState().hydrate();
// }

import { create } from "zustand";
import {
  loginService,
  registerService,
  getProfileService,
  sendOtpService,
  verifyOtpService,
  adminLoginService,
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
      set({ token: storedToken, _hasHydrated: true });
      if (!get().user && !get().loading) get().getProfile();
    } else {
      set({ _hasHydrated: true });
    }
  },

  login: async (data, role) => {
    set({ loading: true, error: null, success: false });
    try {
      let res;
      if (role === "student") {
        res = await loginService(data);
      } else {
        res = await adminLoginService(data);
      }

      if (res?.token) {
        if (isClient) localStorage.setItem("token", res.token);
        set({ token: res.token, loading: false, _hasHydrated: true });

        let userData = null;
        if (role === "student") {
          userData = res.student || null;          // basic student info from login
        } else {
          userData = res.admin || null;            // admin info
        }
        set({ user: userData });

        // For students, fetch the complete profile (/student/me)
        if (role === "student") await get().getProfile();

        set({ success: true });
        return res;
      } else throw new Error("No token received");
    } catch (error) {
      set({ error: error?.message || "Login failed", loading: false, success: false });
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

  // Get full student profile from /student/me
 // store/login.store.js (relevant part – getProfile method)

// ... inside the store

getProfile: async (force = false) => {
  const state = get();
  // Skip if user is an admin (has role and not Student)
  if (state.user?.role && state.user.role !== "Student") {
    return;
  }
  if (!force && (state.loading || state.user)) return;
  set({ loading: true, error: null });
  try {
    const data = await getProfileService();   // only for students
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
      sessionStorage.clear();
    }
    set({ user: null, token: null, loading: false, error: null, success: false, _hasHydrated: true });
  },
}));

if (isClient) {
  useAuthStore.getState().hydrate();
}