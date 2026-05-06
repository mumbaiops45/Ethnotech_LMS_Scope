import api from "../../utils/axios";

export const getAssignments = async () => {
  const res = await api.get("/assignments");
  return res.data; // expects array
};

export const createAssignment = async (data) => {
  const res = await api.post("/assignments", data);
  return res.data;
};

export const updateAssignment = async (id, data) => {
  const res = await api.put(`/assignments/${id}`, data);
  return res.data;
};

export const deleteAssignment = async (id) => {
  const res = await api.delete(`/assignments/${id}`);
  return res.data;
};