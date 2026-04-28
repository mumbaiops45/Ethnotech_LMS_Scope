import api from "../utils/axios";

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