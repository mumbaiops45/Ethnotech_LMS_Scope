import api from "../utils/axios";
import {
  loginUser,
  registerUser,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  sendOtpApi,
  verifyOtpApi,
  sendResetOtp,
  resetPassword,
  adminLogin,
} from "../api/auth/api";

// ================= LOGIN =================
export const loginService = async (data) => loginUser(data);
export const adminLoginService = async (data) => adminLogin(data);

// ================= OTP =================
export const sendOtpService = async (data) => sendOtpApi(data);
export const verifyOtpService = async (data) => verifyOtpApi(data);

// ================= REGISTER =================
export const registerService = async (data) => registerUser(data);

// ================= PROFILE =================
export const getProfileService = async () => getProfile();
export const createProfileService = async (data) => createProfile(data);
export const updateProfileService = async (data) => updateProfile(data);
export const deleteProfileService = async () => deleteProfile();

// ================= FORGOT PASSWORD =================
export const sendResetOtpService = async (data) => sendResetOtp(data);
export const resetPasswordService = async (data) => resetPassword(data);

// ================= ADMIN LOGIN (already exists) =================
// adminLogin already exported above

// ================= ADMIN USER MANAGEMENT =================
// Use "/admins" as per your backend URL
const ADMIN_BASE = "/admins";

export const getAdmins = () => api.get(ADMIN_BASE);
export const getAdminById = (id) => api.get(`${ADMIN_BASE}/${id}`);
export const createAdmin = (data) => api.post(ADMIN_BASE, data);
export const updateAdmin = (id, data) => api.put(`${ADMIN_BASE}/${id}`, data);
export const deleteAdmin = (id) => api.delete(`${ADMIN_BASE}/${id}`);
export const deactivateAdmin = (id) => api.patch(`/admin/${id}/deactivate`, {});   // matches your backend route