"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../../store/login.store";


// ================= GET PROFILE =================
export const useProfile = () => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const getProfile = useAuthStore((state) => state.getProfile);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return { user, loading, error };
};

//  OTP LOGIN
export const useOtp = () => {
  const { sendOtp, verifyOtp, loading, error, success, reset } =
    useAuthStore();

  return { sendOtp, verifyOtp, loading, error, success, reset };
};

// ================= LOGIN =================
export const useLogin = () => {
  const { login, loading, error, success, reset } = useAuthStore();

  return { login, loading, error, success, reset };
};


// ================= REGISTER =================
export const useRegister = () => {
  const { register, loading, error, success, reset } = useAuthStore();

  return { register, loading, error, success, reset };
};


// ================= LOGOUT =================
export const useLogout = () => {
  const { logout } = useAuthStore();

  return { logout };
};


// ================= ALL AUTH ACTIONS =================
export const useAuthActions = () => {
  const {
    login,
    register,
    logout,
    getProfile,
    loading,
    error,
    success,
    reset,
    user,
  } = useAuthStore();

  return {
    login,
    register,
    logout,
    getProfile,
    user,
    loading,
    error,
    success,
    reset,
  };
};