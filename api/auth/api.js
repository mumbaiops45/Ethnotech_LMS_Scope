import api from "../../utils/axios";

// ================= LOGIN =================
export const loginUser = async (data) => {
  const response = await api.post("/student/login", data);
  return response.data;
};

// ================= REGISTER =================
export const registerUser = async (data) => {
  const response = await api.post("/student/register", data);
  return response.data;
};

// ================= PROFILE =================

// GET PROFILE
export const getProfile = async () => {
  const response = await api.get("/student/me");
  return response.data;
};

// CREATE PROFILE
export const createProfile = async (data) => {
  const response = await api.post("/student/create", data);
  return response.data;
};

// UPDATE PROFILE
export const updateProfile = async (data) => {
  const response = await api.put("/student/update", data);
  return response.data;
};

// DELETE PROFILE
export const deleteProfile = async () => {
  const response = await api.delete("/student/delete");
  return response.data;
};


//  SEND OTP
export const sendOtpApi = (data) => {
  return api.post("/send-otp", data);
};

//  VERIFY OTP
export const verifyOtpApi = (data) => {
  return api.post("/verify-otp", data);
};