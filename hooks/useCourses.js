"use client";

import { useCourseStore } from "../store/course.store";

export const useCourse = () => {
  const {
    // STATES
    courses,
    currentCourse,
    loading,
    submitting,
    error,

    // ACTIONS
    getMyCourses,
    getAllCoursesAdmin,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    addModule,
    reorderModules,
    clearError,
    resetCourseStore,
  } = useCourseStore();

  return {
    /* =========================================================
       STATES
    ========================================================= */
    courses,
    currentCourse,

    loading,
    submitting,
    error,

    /* =========================================================
       ACTIONS
    ========================================================= */
    getMyCourses,
    getAllCoursesAdmin,
    getCourseById,

    createCourse,
    updateCourse,
    deleteCourse,

    addModule,
    reorderModules,

    clearError,
    resetCourseStore,
  };
};