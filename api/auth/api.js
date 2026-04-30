import api from "../../utils/axios";

// ================= UNIFIED LOGIN =================
export const authLogin = async (data) => {
  try {
    const response = await api.post("/student/authlogin", data);
    return response.data; // { success, token, user, message }
  } catch (error) {
    // If the backend responded with a structured error (e.g., 400)
    if (error.response?.data) {
      // Return the error data directly (contains { success: false, message, ... })
      return error.response.data;
    }
    // For network errors or unexpected issues
    throw new Error(error.message || "Login failed");
  }
};

// ================= INSTRUCTOR AUTH =================
export const instructorLogin = async (data) => {
  try {
    const response = await api.post("/instructor/login", data);
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw new Error(error.message || "Instructor login failed");
  }
};

// ================= INSTRUCTOR PROFILE =================
export const getInstructorProfile = async () => {
  try {
    const response = await api.get("/instructor/profile");
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw new Error(error.message || "Failed to fetch instructor profile");
  }
};

export const updateInstructorProfile = async (data) => {
  try {
    const response = await api.put("/instructor/profile/update", data);
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw new Error(error.message || "Failed to update instructor profile");
  }
};

// ================= REGISTER =================
export const registerUser = async (data) => {
  try {
    const response = await api.post("/student/register", data);
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw new Error(error.message || "Registration failed");
  }
};

// ================= PROFILE =================
export const getProfile = async () => {
  try {
    const response = await api.get("/student/me");
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw new Error(error.message || "Failed to fetch profile");
  }
};

export const createProfile = async (data) => {
  try {
    const response = await api.post("/student/create", data);
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw new Error(error.message || "Failed to create profile");
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await api.put("/student/update", data);
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw new Error(error.message || "Failed to update profile");
  }
};

export const deleteProfile = async () => {
  try {
    const response = await api.delete("/student/delete");
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw new Error(error.message || "Failed to delete profile");
  }
};

// ================= SEND OTP =================
export const sendOtpApi = async (data) => {
  try {
    const response = await api.post("/send-otp", data);
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw new Error(error.message || "Failed to send OTP");
  }
};

// ================= VERIFY OTP =================
export const verifyOtpApi = async (data) => {
  try {
    const response = await api.post("/verify-otp", data);
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw new Error(error.message || "OTP verification failed");
  }
};

// ================= FORGOT PASSWORD =================
export const sendResetOtp = async (data) => {
  try {
    const response = await api.post("/student/send-reset-otp", data);
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw new Error(error.message || "Failed to send reset OTP");
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await api.post("/student/reset-password", data);
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw new Error(error.message || "Password reset failed");
  }
};

// ================= ADMIN AUTH =================
export const adminLogin = async (data) => {
  try {
    const response = await api.post("/admins/login", data);
    return response.data;
  } catch (error) {
    if (error.response?.data) return error.response.data;
    throw new Error(error.message || "Admin login failed");
  }
};