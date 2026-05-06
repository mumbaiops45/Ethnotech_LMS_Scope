"use client";

import api from "../utils/axios";

// =========================
// GET DASHBOARD
// =========================
export const getDashboard = async () => {
  const res = await api.get("/dashboard");

  console.log("Dashboard API:", res.data);

  return res.data?.data || res.data;
};

// =========================
// GET PROGRAMS
// =========================
export const getPrograms = async () => {
  const res = await api.get("/dashboard/programs");

  return res.data?.data || res.data;
};

// =========================
// GET COURSES
// =========================
export const getCourses = async () => {
  const res = await api.get("/dashboard/courses");

  return res.data?.data || res.data;
};

// =========================
// GET COURSE BY ID
// =========================
export const getCourseById = async (courseId) => {
  const res = await api.get(`/dashboard/courses/${courseId}`);

  return res.data?.data || res.data;
};

// =========================
// GET COURSE COMPLETION
// =========================
export const getCourseCompletion = async (courseId) => {
  const res = await api.get(
    `/dashboard/courses/${courseId}/completion`
  );

  return res.data?.data || res.data;
};