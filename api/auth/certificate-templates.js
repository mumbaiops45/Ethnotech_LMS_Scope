import api from "../../utils/axios";

// ================= CERTIFICATE TEMPLATE MANAGEMENT =================
const TEMPLATE_BASE = "/certificate-templates";

export const getCertificateTemplates = async () => {
  const res = await api.get(TEMPLATE_BASE);
  // Handle the actual response structure: { templates: [...] }
  if (res.data?.templates && Array.isArray(res.data.templates)) return res.data.templates;
  if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data)) return res.data;
  return [];
};

export const getCertificateTemplateById = async (id) => {
  const res = await api.get(`${TEMPLATE_BASE}/${id}`);
  return res.data?.template || res.data?.data || res.data;
};

export const createCertificateTemplate = async (data) => {
  const res = await api.post(TEMPLATE_BASE, data);
  return res.data; // { message, template }
};

export const updateCertificateTemplate = async (id, data) => {
  const res = await api.put(`${TEMPLATE_BASE}/${id}`, data);
  return res.data;
};

export const deleteCertificateTemplate = async (id) => {
  const res = await api.delete(`${TEMPLATE_BASE}/${id}`);
  return res.data;
};