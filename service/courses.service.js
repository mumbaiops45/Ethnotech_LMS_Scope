import api from "../utils/axios";

/* =========================================================
   COURSE SERVICES
========================================================= */

// Create Course
export const createCourseService = async (courseData) => {
  try {
    const response = await api.post("/courses", courseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Instructor Courses
export const getMyCoursesService = async () => {
  try {
    const response = await api.get("/courses");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All Courses (Admin)
export const getAllCoursesAdminService = async () => {
  try {
    const response = await api.get("/courses/admin/all");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Course By ID
export const getCourseByIdService = async (courseId) => {
  try {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update Course
export const updateCourseService = async (courseId, courseData) => {
  try {
    const response = await api.put(
      `/courses/${courseId}`,
      courseData
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete Course
export const deleteCourseService = async (courseId) => {
  try {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* =========================================================
   MODULE SERVICES
========================================================= */

// Add Module
export const addModuleService = async (
  courseId,
  moduleData
) => {
  try {
    const response = await api.post(
      `/courses/${courseId}/module`,
      moduleData
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reorder Modules
export const reorderModulesService = async (
  courseId,
  orderArray
) => {
  try {
    const response = await api.put(
      `/courses/${courseId}/module/reorder`,
      {
        order: orderArray,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};