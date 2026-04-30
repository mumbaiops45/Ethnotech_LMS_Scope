import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  authLoginService, 
  sendOtpService, 
  verifyOtpService,
  getProfileService      // ✅ import from service, not direct API
} from '../service/login.service';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

     login: async (credentials) => {
  const res = await authLoginService(credentials);
  if (res && res.success === false) {
    throw new Error(res.message || 'Login failed');
  }
  if (res && res.success === true) {
    set({
      user: res.user,
      token: res.token,
      isAuthenticated: true,
    });
    // ✅ Store token in localStorage for axios interceptor
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', res.token);
    }
    const api = (await import('../utils/axios')).default;
    api.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
    return res;
  }
  throw new Error('Unexpected response');
},
      sendOtp: async (data) => {
        const res = await sendOtpService(data);
        return res;
      },

      verifyOtp: async (data) => {
        const res = await verifyOtpService(data);
        if (res.success) {
          set({
            user: res.user,
            token: res.token,
            isAuthenticated: true,
          });
          const api = (await import('../utils/axios')).default;
          api.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
        }
        return res;
      },

      getProfile: async () => {
        const res = await getProfileService();   // ✅ now uses service
        if (res.success) {
          set({ user: res.user });
        }
        return res;
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        import('../utils/axios').then(({ default: api }) => {
          delete api.defaults.headers.common['Authorization'];
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);