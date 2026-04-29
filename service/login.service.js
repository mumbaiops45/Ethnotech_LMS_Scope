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
  instructorLogin,
  getInstructorProfile,
  updateInstructorProfile
} from "../api/auth/api";

// ================= LOGIN =================
export const loginService = async (data) => loginUser(data);
export const adminLoginService = async (data) => adminLogin(data);
// ================= INSTRUCTOR PROFILE =================
export const instructorLoginService = async (data) => instructorLogin(data);
export const getInstructorProfileService = async () => getInstructorProfile();
export const updateInstructorProfileService = async (data) => updateInstructorProfile(data);
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

// ================= ADMIN USER MANAGEMENT =================
const ADMIN_BASE = "/admins/";
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



// ================= LIVE SESSIONS =================
export const getSessions = () => api.get("/live-sessions");
export const createSession = (data) => api.post("/live-sessions", data);
export const updateSession = (id, data) => api.put(`/live-sessions/${id}`, data);
export const cancelSession = (id) => api.patch(`/live-sessions/${id}/cancel`, {});



// ================= COURSE MANAGEMENT =================
const COURSE_BASE = "/courses";

export const getCourses = () => api.get(COURSE_BASE);
export const getCourseById = (id) => api.get(`${COURSE_BASE}/${id}`);
export const createCourse = (data) => api.post(COURSE_BASE, data);
export const updateCourse = (id, data) => api.put(`${COURSE_BASE}/${id}`, data);
export const deleteCourse = (id) => api.delete(`${COURSE_BASE}/${id}`);
export const addModule = (courseId, moduleData) => api.post(`${COURSE_BASE}/${courseId}/module`, moduleData);
export const reorderModules = (courseId, orderArray) => api.put(`${COURSE_BASE}/${courseId}/module/reorder`, { order: orderArray });
// ================= LESSON MANAGEMENT (no /courses prefix) =================
export const createLesson = (courseId, moduleId, data) =>
  api.post(`/${courseId}/module/${moduleId}/lesson`, data);
export const updateLesson = (lessonId, data) =>
  api.put(`/lesson/${lessonId}`, data);
export const deleteLesson = (lessonId) =>
  api.delete(`/lesson/${lessonId}`);
export const reorderLessons = (courseId, moduleId, orderArray) =>
  api.put(`/${courseId}/module/${moduleId}/lesson/reorder`, { order: orderArray });



// ================= ANNOUNCEMENT MANAGEMENT =================
const ANNOUNCEMENT_BASE = "/announcements";

export const getAnnouncements = () => api.get(ANNOUNCEMENT_BASE);
export const getAnnouncementById = (id) => api.get(`${ANNOUNCEMENT_BASE}/${id}`);
export const createAnnouncement = (data) => api.post(ANNOUNCEMENT_BASE, data);