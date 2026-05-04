import { useAssignmentStore } from "../store/assignment.review.store";


export const useAssignment = () => {
    const { pending,
        currentAssignment,
        submissions,
        loading,
        error,
        fetchPending,
        fetchAssignmentById,
        fetchSubmissions,
        gradeSubmission,
        publishAssignment
    } = useAssignmentStore();


    return {
    pending,
    currentAssignment,
    submissions,
    loading,
    error,
    fetchPending,
    fetchAssignmentById,
    fetchSubmissions,
    gradeSubmission,
    publishAssignment
  };
}