"use client"
import { create } from "zustand";
import { getMyCourseService, getMyBatchesService, getMyStudentsService, getMyDashboardService } from "../service/instructor.service";


export const useInstructorStore = create((set) => ({
    courses: [],
    batches: [],
    students: [],
    dashboard: null,
    loading: false,
    error: null,

    fetchCourses: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await getMyCourseService(data);
            set({ courses: res, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchBatches: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await getMyBatchesService(data);
            set({ batches: res, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchStudents: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await getMyStudentsService(data);
            set({ students: res, loading: false });
        } catch (error) {
            set({ error: err.message, loading: false });
        }
    },
    fetchDashboard: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await getMyDashboardService(data);
            set({ dashboard: res, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    }

}));