import api from "../../utils/axios";

const LESSON_BASE = "/lesson";

// Get all lessons for a specific course (by courseId)
export const getLessonsByCourse = async (courseId) => {
  const response = await api.get(`${LESSON_BASE}/course/${courseId}/lessons`);
  // Backend returns an object like { lessons: [...] }
  return response.data.lessons || [];
};

// Get a single lesson by ID
export const getLessonById = async (lessonId) => {
  const response = await api.get(`${LESSON_BASE}/lesson/${lessonId}`);
  return response.data;
};

// Create a new lesson (instructor only)
export const createLesson = async (courseId, moduleId, lessonData) => {
  const response = await api.post(
    `${LESSON_BASE}/${courseId}/module/${moduleId}/lesson`,
    lessonData
  );
  return response.data;
};

// Update a lesson (instructor only)
export const updateLesson = async (lessonId, lessonData) => {
  const response = await api.put(`${LESSON_BASE}/lesson/${lessonId}`, lessonData);
  return response.data;
};

// Delete a lesson (instructor only)
export const deleteLesson = async (lessonId) => {
  const response = await api.delete(`${LESSON_BASE}/lesson/${lessonId}`);
  return response.data;
};

// Reorder lessons inside a module (instructor only)
export const reorderLessons = async (courseId, moduleId, orderArray) => {
  const response = await api.put(
    `${LESSON_BASE}/${courseId}/module/${moduleId}/lesson/reorder`,
    { order: orderArray }
  );
  return response.data;
};