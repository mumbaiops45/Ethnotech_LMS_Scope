import {
  loginUser,
  registerUser,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  sendOtpApi,
  verifyOtpApi,
} from "../api/auth/api";

// ================= LOGIN =================
export const loginService = async (data) => {
  return loginUser(data);
};

// ================= OTP =================
export const sendOtpService = async (data) => {
  return sendOtpApi(data);
};

export const verifyOtpService = async (data) => {
  return verifyOtpApi(data);
};

// ================= REGISTER =================
export const registerService = async (data) => {
  return registerUser(data);
};

// ================= PROFILE =================
export const getProfileService = async () => {
  return await getProfile();
};


export const createProfileService = async (data) => {
  return await createProfile(data);
};

export const updateProfileService = async (data) => {
  return await updateProfile(data);
};

export const deleteProfileService = async () => {
  return await deleteProfile();
};