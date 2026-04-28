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
const ADMIN_BASE = "/admins/";
// student/admin/students

export const getAdmins = () => api.get(ADMIN_BASE);
export const getAdminById = (id) => api.get(`${ADMIN_BASE}/${id}`);
export const createAdmin = (data) => api.post(ADMIN_BASE, data);
export const updateAdmin = (id, data) => api.put(`${ADMIN_BASE}/${id}`, data);
export const deleteAdmin = (id) => api.delete(`${ADMIN_BASE}/${id}`);
export const deactivateAdmin = (id) => api.patch(`/admin/${id}/deactivate`, {});   

// ================= STUDENT MANAGEMENT (Super Admin) =================
const STUDENT_BASE = "/student/admin/students";

export const getStudents = () => api.get(STUDENT_BASE);
export const getStudentById = (id) => api.get(`${STUDENT_BASE}/${id}`);
export const updateStudent = (id, data) => api.put(`${STUDENT_BASE}/${id}`, data);
export const deleteStudent = (id) => api.delete(`${STUDENT_BASE}/${id}`);

// ================= BATCH MANAGEMENT =================
const BATCH_BASE = "/batches";

export const getBatches = () => api.get(BATCH_BASE);
export const getBatchById = (id) => api.get(`${BATCH_BASE}/${id}`);
export const createBatch = (data) => api.post(BATCH_BASE, data);
export const updateBatch = (id, data) => api.put(`${BATCH_BASE}/${id}`, data);
export const deleteBatch = (id) => api.delete(`${BATCH_BASE}/${id}`);

export const assignInstructorToBatch = (batchId, instructorId) =>
  api.put(`/batches/${batchId}/assign-instructor`, { instructorId });

export const assignCoursesToBatch = (batchId, courseIds) =>
  api.put(`/batches/${batchId}/assign-courses`, { courseIds });

export const getCourses = () => api.get("/courses");