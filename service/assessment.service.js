// services/assessment.service.js
import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  publishAssessment,
  getAllAttemptsForInstructor,
  getAssessmentForStudent
} from "../api/auth/assessment.api";

export const createAssessmentService = async (data) => {
  const res = await createAssessment(data);
  return res?.data ?? res;  // ✅
};

export const getAssessmentsService = async () => {
  const res = await getAssessments();
  return res?.data ?? res;
};

export const getAssessmentByIdService = async (id) => {
  const res = await getAssessmentById(id);
  return res?.data ?? res;  // ✅ single assessment
};

export const updateAssessmentService = async (id, data) => {
  const res = await updateAssessment(id, data);
 return res?.data ?? res;
};

export const deleteAssessmentService = async (id) => {
  const res = await deleteAssessment(id);
  return res?.data ?? res;
};

export const publishAssessmentService = async (id) => {
  const res = await publishAssessment(id);
  return res?.data ?? res;
};

export const getAllAttemptsForInstructorService = async (id) => {
  const res = await getAllAttemptsForInstructor(id);
  return res?.data ?? res;
};

export const getAssessmentForStudentService = async (id) => {
  const res = await getAssessmentForStudent(id);
  return res?.data ?? res;
};