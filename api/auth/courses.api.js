import api from "../../utils/axios";

/* =========================================================
   COURSE SERVICES
========================================================= */

// Create Course
export const createCourse = async (courseData) => {
  const response = await api.post("/courses", courseData);
  return response.data;
};

// Get Logged-in Instructor Courses
export const getMyCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

// Get All Courses (Admin)
export const getAllCoursesAdmin = async () => {
  const response = await api.get("/courses/admin/all");
  return response.data;
};

// Get Single Course By ID
export const getCourseById = async (courseId) => {
  const response = await api.get(`/courses/${courseId}`);
  return response.data;
};

// Update Course
export const updateCourse = async (courseId, courseData) => {
  const response = await api.put(`/courses/${courseId}`, courseData);
  return response.data;
};

// Delete Course
export const deleteCourse = async (courseId) => {
  const response = await api.delete(`/courses/${courseId}`);
  return response.data;
};

/* =========================================================
   MODULE SERVICES
========================================================= */

// Add Module To Course
export const addModule = async (courseId, moduleData) => {
  const response = await api.post(
    `/courses/${courseId}/module`,
    moduleData
  );
  return response.data;
};

// Reorder Modules
export const reorderModules = async (courseId, orderArray) => {
  const response = await api.put(
    `/courses/${courseId}/module/reorder`,
    {
      order: orderArray,
    }
  );

  return response.data;
};