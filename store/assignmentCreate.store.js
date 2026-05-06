"use client";
import { create } from "zustand";
import {
    getAssignmentsService,
    createAssignmentService,
    updateAssignmentService,
    deleteAssignmentService,
} from "../service/assignmentCreate.service";

let assignmentsRequest = null;

export const useAssignmentStore = create((set, get) => ({
    assignments: [],
    loading: false,
    error: null,

    fetchAssignments: async () => {
        if (assignmentsRequest) return assignmentsRequest;

        assignmentsRequest = (async () => {
            try {
                set({ loading: true, error: null });
                const res = await getAssignmentsService();
                set({ assignments: res, loading: false });
                return res;
            } catch (err) {
                set({ error: err.message, loading: false });
                throw err;
            } finally {
                assignmentsRequest = null;
            }
        })();

        return assignmentsRequest;
    },

    createAssignment: async (assignmentData) => {
        set({ loading: true, error: null });
        try {
            const newAssignment = await createAssignmentService(assignmentData);
            await get().fetchAssignments(); // refresh list
            set({ loading: false });
            return newAssignment;
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    updateAssignment: async (id, assignmentData) => {
        set({ loading: true, error: null });
        try {
            const updated = await updateAssignmentService(id, assignmentData);
            await get().fetchAssignments();
            set({ loading: false });
            return updated;
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    deleteAssignment: async (id) => {
        set({ loading: true, error: null });
        try {
            await deleteAssignmentService(id);
            // Optimistic remove from local state
            set((state) => ({
                assignments: state.assignments.filter((a) => a._id !== id),
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    resetAssignments: () => {
        set({ assignments: [], loading: false, error: null });
        assignmentsRequest = null;
    },
}));