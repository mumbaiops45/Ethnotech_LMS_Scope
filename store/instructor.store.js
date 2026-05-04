"use client"
import { create } from "zustand";
import { getMyCourseService, getMyBatchesService, getMyStudentsService, getMyDashboardService } from "../service/instructor.service";


let dashboardRequest = null;


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

   

//     fetchDashboard: async () => {
//     set({ loading: true, error: null });

//     try {
//         const res = await getMyDashboardService();
//  console.log("🔥 REAL API HIT");
//  console.count("Dashboard API CALL");
//         set({
//             dashboard: res,
//             loading: false
//         });

//     } catch (err) {
//         set({
//             error: err.message,
//             loading: false
//         });
//     }
// }



fetchDashboard: async () => {
  const state = useInstructorStore.getState();

  // already loaded
  if (state.dashboard) return;

  // already fetching → BLOCK DUPLICATE CALLS
  if (dashboardRequest) return dashboardRequest;

  console.count("Dashboard API CALL");

  dashboardRequest = (async () => {
    try {
      set({ loading: true });

      const res = await getMyDashboardService();

      set({
        dashboard: res,
        loading: false
      });

      return res;
    } catch (err) {
      set({
        error: err.message,
        loading: false
      });
    } finally {
      dashboardRequest = null; 
    }
  })();

  return dashboardRequest;
}

}));