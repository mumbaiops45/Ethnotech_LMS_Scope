import api from "../../utils/axios";

// ================= INSTRUCTOR COURSE MANAGEMENT =================

// Get all courses for the logged‑in instructor
export const getMyCourses = async () => {
    const response = await api.get("/courses");
    return response.data;
};

// Get a single course by ID
export const getCourseById = async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
};

// Create a new course
export const createCourse = async (courseData) => {
    const response = await api.post("/courses", courseData);
    return response.data;
};

// Update an existing course
export const updateCourse = async (courseId, courseData) => {
    const response = await api.put(`/courses/${courseId}`, courseData);
    return response.data;
};

// Delete a course
export const deleteCourse = async (courseId) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
};

// Add a module to a course
export const addModule = async (courseId, moduleData) => {
    const response = await api.post(`/courses/${courseId}/module`, moduleData);
    return response.data;
};

// Reorder modules inside a course
export const reorderModules = async (courseId, orderArray) => {
    const response = await api.put(`/courses/${courseId}/module/reorder`, { order: orderArray });
    return response.data;
};