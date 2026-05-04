import api from "../utils/axios";

// ================= CERTIFICATE TEMPLATE MANAGEMENT =================
const TEMPLATE_BASE = "/certificate-templates";

export const getCertificateTemplates = async () => {
  const res = await api.get(TEMPLATE_BASE);
  if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data)) return res.data;
  if (res.data?.templates && Array.isArray(res.data.templates)) return res.data.templates;
  console.warn("Unexpected template response:", res.data);
  return [];
};

export const getCertificateTemplateById = async (id) => {
  const res = await api.get(`${TEMPLATE_BASE}/${id}`);
  return res.data?.data || res.data?.template || res.data;
};

export const createCertificateTemplate = async (data) => {
  const res = await api.post(TEMPLATE_BASE, data);
  return res.data;
};

export const updateCertificateTemplate = async (id, data) => {
  const res = await api.put(`${TEMPLATE_BASE}/${id}`, data);
  return res.data;
};

export const deleteCertificateTemplate = async (id) => {
  const res = await api.delete(`${TEMPLATE_BASE}/${id}`);
  return res.data;
};

// ================= CERTIFICATE MANAGEMENT =================
const CERTIFICATE_BASE = "/certificates";

// Student endpoints
export const getMyCertificates = async () => {
  const res = await api.get(`${CERTIFICATE_BASE}/my`);
  if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data)) return res.data;
  return [];
};

export const downloadCertificate = async (certificateId) => {
  const res = await api.get(`${CERTIFICATE_BASE}/download/${certificateId}`, {
    responseType: 'blob',
  });
  return res.data;
};

// Admin endpoints
export const getAllCertificates = async () => {
  const res = await api.get(`${CERTIFICATE_BASE}/all`);
  if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data)) return res.data;
  if (res.data?.certificates && Array.isArray(res.data.certificates)) return res.data.certificates;
  return [];
};

export const triggerAutoGeneration = async (data) => {
  const res = await api.post(`${CERTIFICATE_BASE}/trigger`, data);
  return res.data;
};

export const manualGenerateCertificate = async (data) => {
  const res = await api.post(`${CERTIFICATE_BASE}/manual`, data);
  return res.data;
};

export const getDownloadLogs = async () => {
  const res = await api.get(`${CERTIFICATE_BASE}/logs`);
  if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data)) return res.data;
  if (res.data?.logs && Array.isArray(res.data.logs)) return res.data.logs;
  return [];
};

export const verifyCertificate = async (certificateId) => {
  const res = await api.get(`/certificate/verify/${certificateId}`);
  return res.data;
};
