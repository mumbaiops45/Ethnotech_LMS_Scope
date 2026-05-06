// hooks/useAssessment.js (minimal version)
import { useAssessmentStore } from "../store/assessment.store";

export const useAssessment = () => {
  const {
    assessments,
    loading,
    error,
    fetchAssessments,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    reset,
  } = useAssessmentStore();

  return {
    assessments,
    loading,
    error,
    fetchAssessments,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    reset,
  };
};