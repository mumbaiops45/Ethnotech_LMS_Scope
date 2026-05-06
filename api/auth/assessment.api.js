import api from "../../utils/axios";

export const getAssessments = () => api.get("/assessments");

export const createAssessment = (data) =>
  api.post("/assessments", data);

export const getAssessmentById = (id) =>
  api.get(`/assessments/${id}`);

export const updateAssessment = (id, data) =>
  api.put(`/assessments/${id}`, data);

export const deleteAssessment = (id) =>
  api.delete(`/assessments/${id}`);

export const publishAssessment = (id) =>
  api.patch(`/assessments/${id}/publish`);

export const getAllAttemptsForInstructor = (id) =>
  api.get(`/assessments/${id}/attempts`);

export const getAssessmentForStudent = (id) =>
  api.get(`/assessments/${id}/start`);