import {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
} from "../api/auth/lesson.api";

// Fetch all lessons for a course (used in assignment form)
export const getLessonsByCourseService = async (courseId) => {
  const res = await getLessonsByCourse(courseId);
  return res; // already an array of lessons
};

// Fetch single lesson by ID
export const getLessonByIdService = async (lessonId) => {
  const res = await getLessonById(lessonId);
  return res;
};

// Create a new lesson
export const createLessonService = async (courseId, moduleId, lessonData) => {
  const res = await createLesson(courseId, moduleId, lessonData);
  return res;
};

// Update a lesson
export const updateLessonService = async (lessonId, lessonData) => {
  const res = await updateLesson(lessonId, lessonData);
  return res;
};

// Delete a lesson
export const deleteLessonService = async (lessonId) => {
  const res = await deleteLesson(lessonId);
  return res;
};

// Reorder lessons inside a module
export const reorderLessonsService = async (courseId, moduleId, orderArray) => {
  const res = await reorderLessons(courseId, moduleId, orderArray);
  return res;
};