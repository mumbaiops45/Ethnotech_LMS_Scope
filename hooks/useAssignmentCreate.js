import { useAssignmentStore } from "../store/assignmentCreate.store";
export const useAssignment = () => {
    const {
        assignments,
        loading,
        error,
        fetchAssignments,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        resetAssignments,
    } = useAssignmentStore();

    return {
        assignments,
        loading,
        error,
        fetchAssignments,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        resetAssignments,
    };
};