// stores/assessment.store.js
import { create } from "zustand";
import {
  getAssessmentsService,
  getAssessmentByIdService,
  createAssessmentService,
  updateAssessmentService,
  deleteAssessmentService,
  publishAssessmentService,
  getAllAttemptsForInstructorService,
  getAssessmentForStudentService,
} from "../service/assessment.service";

let assessmentsRequest = null;

export const useAssessmentStore = create((set, get) => ({
  // State
  assessments: [],
  currentAssessment: null,
  attempts: [],
  loading: false,
  error: null,

  // Fetch all assessments (with deduplication)

 fetchAssessments: async () => {
  if (assessmentsRequest) return assessmentsRequest;

  assessmentsRequest = (async () => {
    try {
      set({ loading: true, error: null });

      const res = await getAssessmentsService();

      console.log("Fetched Assessments:", res);

      set({
        assessments: Array.isArray(res) ? res : [],
        loading: false,
      });

      return res;
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });

      throw err;
    } finally {
      assessmentsRequest = null;
    }
  })();

  return assessmentsRequest;
},


  // Fetch single assessment by ID
  fetchAssessmentById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await getAssessmentByIdService(id);
      set({ currentAssessment: data, loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Create assessment and refresh list
  createAssessment: async (data) => {
    set({ loading: true, error: null });
    try {
      const newAssessment = await createAssessmentService(data);
      await get().fetchAssessments(); // refresh list
      set({ loading: false });
      return newAssessment;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Update assessment and refresh details + list
  updateAssessment: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateAssessmentService(id, data);
      await get().fetchAssessmentById(id);
      await get().fetchAssessments();
      set({ loading: false });
      return updated;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Delete assessment with optimistic UI update
  deleteAssessment: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteAssessmentService(id);
      // Optimistic remove from local state
      set((state) => ({
        assessments: state.assessments.filter((a) => a._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Publish assessment and refresh current assessment
  publishAssessment: async (id) => {
    set({ loading: true, error: null });
    try {
      const published = await publishAssessmentService(id);
      await get().fetchAssessmentById(id); // refresh to see published status
      set({ loading: false });
      return published;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Fetch attempts (instructor only)
  fetchAttemptsForInstructor: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await getAllAttemptsForInstructorService(id);
      set({ attempts: data, loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Fetch assessment for student (starting an attempt)
  fetchAssessmentForStudent: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await getAssessmentForStudentService(id);
      set({ currentAssessment: data, loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
  reset: () => {
    set({ assessments: [], currentAssessment: null, attempts: [], loading: false, error: null });
    assessmentsRequest = null;
  },
}));