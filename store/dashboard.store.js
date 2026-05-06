"use client";

import { create } from "zustand";

import {
  getDashboard,
  getPrograms,
  getCourses,
  getCourseById,
  getCourseCompletion,
} from "../service/dashboard.service";

let dashboardRequest = null;
let programsRequest = null;
let coursesRequest = null;
let courseRequest = null;
let completionRequest = null;

export const useDashboardStore = create((set, get) => ({
  dashboard: null,
  programs: [],
  courses: [],
  currentCourse: null,
  completion: null,

  loading: false,
  error: null,

  // =========================
  // FETCH DASHBOARD
  // =========================
  fetchDashboard: async () => {
    if (dashboardRequest) return dashboardRequest;

    dashboardRequest = (async () => {
      try {
        set({
          loading: true,
          error: null,
        });

        const data = await getDashboard();

        console.log("Dashboard Response:", data);

        set({
          dashboard: data,
          loading: false,
        });

        return data;
      } catch (err) {
        console.error("Dashboard Error:", err);

        set({
          error:
            err?.response?.data?.message ||
            err.message ||
            "Failed to load dashboard",
          loading: false,
        });

        throw err;
      } finally {
        dashboardRequest = null;
      }
    })();

    return dashboardRequest;
  },

  // =========================
  // FETCH PROGRAMS
  // =========================
  fetchPrograms: async () => {
    if (programsRequest) return programsRequest;

    programsRequest = (async () => {
      try {
        set({
          loading: true,
          error: null,
        });

        const data = await getPrograms();

        set({
          programs: Array.isArray(data) ? data : [],
          loading: false,
        });

        return data;
      } catch (err) {
        set({
          error:
            err?.response?.data?.message ||
            err.message ||
            "Failed to load programs",
          loading: false,
        });

        throw err;
      } finally {
        programsRequest = null;
      }
    })();

    return programsRequest;
  },

  // =========================
  // FETCH COURSES
  // =========================
  fetchCourses: async () => {
    if (coursesRequest) return coursesRequest;

    coursesRequest = (async () => {
      try {
        set({
          loading: true,
          error: null,
        });

        const data = await getCourses();

        set({
          courses: Array.isArray(data) ? data : [],
          loading: false,
        });

        return data;
      } catch (err) {
        set({
          error:
            err?.response?.data?.message ||
            err.message ||
            "Failed to load courses",
          loading: false,
        });

        throw err;
      } finally {
        coursesRequest = null;
      }
    })();

    return coursesRequest;
  },

  // =========================
  // FETCH SINGLE COURSE
  // =========================
  fetchCourseById: async (courseId) => {
    if (
      courseRequest &&
      get().currentCourse?._id === courseId
    ) {
      return courseRequest;
    }

    courseRequest = (async () => {
      try {
        set({
          loading: true,
          error: null,
        });

        const data = await getCourseById(courseId);

        set({
          currentCourse: data,
          loading: false,
        });

        return data;
      } catch (err) {
        set({
          error:
            err?.response?.data?.message ||
            err.message ||
            "Failed to load course",
          loading: false,
        });

        throw err;
      } finally {
        courseRequest = null;
      }
    })();

    return courseRequest;
  },

  // =========================
  // FETCH COMPLETION
  // =========================
  fetchCourseCompletion: async (courseId) => {
    if (
      completionRequest &&
      get().completion?.courseId === courseId
    ) {
      return completionRequest;
    }

    completionRequest = (async () => {
      try {
        set({
          loading: true,
          error: null,
        });

        const data = await getCourseCompletion(courseId);

        set({
          completion: data,
          loading: false,
        });

        return data;
      } catch (err) {
        set({
          error:
            err?.response?.data?.message ||
            err.message ||
            "Failed to load completion",
          loading: false,
        });

        throw err;
      } finally {
        completionRequest = null;
      }
    })();

    return completionRequest;
  },

  // =========================
  // CLEAR ERROR
  // =========================
  clearError: () =>
    set({
      error: null,
    }),

  // =========================
  // RESET STORE
  // =========================
  reset: () => {
    set({
      dashboard: null,
      programs: [],
      courses: [],
      currentCourse: null,
      completion: null,
      loading: false,
      error: null,
    });

    dashboardRequest = null;
    programsRequest = null;
    coursesRequest = null;
    courseRequest = null;
    completionRequest = null;
  },
}));