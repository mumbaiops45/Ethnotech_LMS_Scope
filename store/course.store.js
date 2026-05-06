"use client";

import { create } from "zustand";


import { createCourseService,getMyCoursesService,
  getAllCoursesAdminService,
  getCourseByIdService,
  updateCourseService,
  deleteCourseService,
  addModuleService,
  reorderModulesService, } from "../service/courses.service";

export const useCourseStore = create((set, get) => ({
  /* =========================================================
     STATES
  ========================================================= */
  courses: [],
  currentCourse: null,

  loading: false,
  submitting: false,
  error: null,

  /* =========================================================
     GET INSTRUCTOR COURSES
  ========================================================= */
  getMyCourses: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getMyCoursesService();

      set({
        courses: Array.isArray(data) ? data : [],
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          "Failed to fetch courses",
      });

      throw error;
    }
  },

  /* =========================================================
     GET ALL COURSES (ADMIN)
  ========================================================= */
  getAllCoursesAdmin: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getAllCoursesAdminService();

      set({
        courses: Array.isArray(data) ? data : [],
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          "Failed to fetch admin courses",
      });

      throw error;
    }
  },

  /* =========================================================
     GET SINGLE COURSE
  ========================================================= */
  getCourseById: async (courseId) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getCourseByIdService(courseId);

      set({
        currentCourse: data,
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          "Failed to fetch course",
      });

      throw error;
    }
  },

  /* =========================================================
     CREATE COURSE
  ========================================================= */
  createCourse: async (courseData) => {
    try {
      set({
        submitting: true,
        error: null,
      });

      const data = await createCourseService(courseData);

      set((state) => ({
        courses: [data, ...state.courses],
        submitting: false,
      }));

      return data;
    } catch (error) {
      set({
        submitting: false,
        error:
          error?.response?.data?.message ||
          "Failed to create course",
      });

      throw error;
    }
  },

  /* =========================================================
     UPDATE COURSE
  ========================================================= */
  updateCourse: async (courseId, courseData) => {
    try {
      set({
        submitting: true,
        error: null,
      });

      const updatedCourse = await updateCourseService(
        courseId,
        courseData
      );

      set((state) => ({
        courses: state.courses.map((course) =>
          course._id === courseId
            ? updatedCourse
            : course
        ),

        currentCourse:
          state.currentCourse?._id === courseId
            ? updatedCourse
            : state.currentCourse,

        submitting: false,
      }));

      return updatedCourse;
    } catch (error) {
      set({
        submitting: false,
        error:
          error?.response?.data?.message ||
          "Failed to update course",
      });

      throw error;
    }
  },

  /* =========================================================
     DELETE COURSE
  ========================================================= */
  deleteCourse: async (courseId) => {
    try {
      set({
        submitting: true,
        error: null,
      });

      const data = await deleteCourseService(courseId);

      set((state) => ({
        courses: state.courses.filter(
          (course) => course._id !== courseId
        ),

        currentCourse:
          state.currentCourse?._id === courseId
            ? null
            : state.currentCourse,

        submitting: false,
      }));

      return data;
    } catch (error) {
      set({
        submitting: false,
        error:
          error?.response?.data?.message ||
          "Failed to delete course",
      });

      throw error;
    }
  },

  /* =========================================================
     ADD MODULE
  ========================================================= */
  addModule: async (courseId, moduleData) => {
    try {
      set({
        submitting: true,
        error: null,
      });

      const updatedCourse = await addModuleService(
        courseId,
        moduleData
      );

      set((state) => ({
        courses: state.courses.map((course) =>
          course._id === courseId
            ? updatedCourse
            : course
        ),

        currentCourse:
          state.currentCourse?._id === courseId
            ? updatedCourse
            : state.currentCourse,

        submitting: false,
      }));

      return updatedCourse;
    } catch (error) {
      set({
        submitting: false,
        error:
          error?.response?.data?.message ||
          "Failed to add module",
      });

      throw error;
    }
  },

  /* =========================================================
     REORDER MODULES
  ========================================================= */
  reorderModules: async (
    courseId,
    orderArray
  ) => {
    try {
      set({
        submitting: true,
        error: null,
      });

      const updatedCourse =
        await reorderModulesService(
          courseId,
          orderArray
        );

      set((state) => ({
        courses: state.courses.map((course) =>
          course._id === courseId
            ? updatedCourse
            : course
        ),

        currentCourse:
          state.currentCourse?._id === courseId
            ? updatedCourse
            : state.currentCourse,

        submitting: false,
      }));

      return updatedCourse;
    } catch (error) {
      set({
        submitting: false,
        error:
          error?.response?.data?.message ||
          "Failed to reorder modules",
      });

      throw error;
    }
  },

  /* =========================================================
     CLEAR ERROR
  ========================================================= */
  clearError: () => {
    set({
      error: null,
    });
  },

  /* =========================================================
     RESET STORE
  ========================================================= */
  resetCourseStore: () => {
    set({
      courses: [],
      currentCourse: null,
      loading: false,
      submitting: false,
      error: null,
    });
  },
}));