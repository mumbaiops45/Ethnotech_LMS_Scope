"use client";

import { create } from "zustand";
import {
  getMyCertificatesService,
  downloadCertificateService,
  triggerCertificateGenerationService,
  manualGenerateCertificateService,
  getAllCertificatesService,
  getDownloadLogsService
} from "../service/certificate.service";
import { getCoursesAdmin, getStudents } from "../service/login.service";

let certificateRequest = null;

export const useCertificateStore = create((set, get) => ({
  certificates: [],
  courses: [],
  students: [],
  allCertificates: [],
  downloadLogs: [],
  loading: false,
  error: null,

  // ------------- Fetch Courses -------------
 fetchCourses: async () => {
  set({ loading: true, error: null });
  try {
    const res = await getCoursesAdmin();
    console.log("Courses API response:", res);  // debug
    const coursesArray = Array.isArray(res) ? res : (res?.data ? res.data : []);
    set({ courses: coursesArray, loading: false });
  } catch (error) {
    console.error("Fetch courses error:", error);
    set({ error: error.message, loading: false });
  }
},

  // ------------- Fetch Students -------------
  fetchStudents: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getStudents();
      const studentsArray = Array.isArray(res) ? res : (res?.data ? res.data : []);
      set({ students: studentsArray, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // ------------- My Certificates -------------
  fetchMyCertificates: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getMyCertificatesService();
      set({ certificates: res, loading: false });
      return res;
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ------------- Download Certificate -------------
  downloadCertificateById: async (certificateId) => {
    set({ loading: true, error: null });
    try {
      const blob = await downloadCertificateService(certificateId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      set({ loading: false });
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ------------- Admin: All Certificates -------------
  fetchAllCertificates: async () => {
    const state = get();
    if (state.allCertificates.length > 0) return;

    if (certificateRequest) return certificateRequest;

    certificateRequest = (async () => {
      set({ loading: true, error: null });
      try {
        const res = await getAllCertificatesService();
        set({ allCertificates: res, loading: false });
        return res;
      } catch (err) {
        set({ error: err.message, loading: false });
      } finally {
        certificateRequest = null;
      }
    })();

    return certificateRequest;
  },

  // ------------- Admin: Trigger Auto Generation -------------
  triggerAutoGeneration: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await triggerCertificateGenerationService(payload);
      set({ loading: false });
      return res;
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ------------- Admin: Manual Generate -------------
  manualGenerate: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await manualGenerateCertificateService(payload);
      set({ loading: false });
      return res;
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ------------- Admin: Download Logs -------------
  fetchDownloadLogs: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getDownloadLogsService();
      set({ downloadLogs: res, loading: false });
      return res;
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));