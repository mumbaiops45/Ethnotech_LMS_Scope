import { create } from "zustand";
import {
    getPendingService,
    getassignemntService,
    getassignmentGradeService,
    publishassignmentService,
    getSubmissionassignmentService
} from "../service/assignmentreview.service";

export const useAssignmentStore = create((set , get) => ({
    pending: [],
    currentAssignment: null,
    submissions: [],
    loading: false,
    error: null,

    fetchPending: async (params) => {
        set({loading: true , error: null});
        try {
            const res = await getPendingService(params);
            set({pending: res , loading: false});
        } catch (error) {
            set({error: error.message , loading: false});
        }
    },

    fetchAssignmentById: async (id) => {
        set({loading: true});
        try {
            const res = await getassignemntService(id);
            set({currentAssignment: res, loading: false});
        } catch (error) {
            set({error: error.message, loading: false});
        }
    },

    fetchSubmissions: async (assignmentId) => {
        set({loading: true});
         try {
      const res = await getSubmissionassignmentService(assignmentId);
      set({ submissions: res, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
    },


     gradeSubmission: async (id, data) => {
    set({ loading: true });
    try {
      await getassignmentGradeService(id, data);

      // refresh submissions after grading
      const updated = await getSubmissionassignmentService(
        get().currentAssignment?._id
      );

      set({ submissions: updated, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
 publishAssignment: async (id) => {
    set({ loading: true });
    try {
      await publishassignmentService(id);
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  }

}))