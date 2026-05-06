import api from "../../utils/axios";

// ================= Student APIs =================
export const getMyCertificates = async () => {
  const response = await api.get("/certificates/my");
  return response.data;
};

export const downloadCertificate = async (certificateId) => {
  const response = await api.get(`/certificates/download/${certificateId}`, {
    responseType: "blob",
  });
  return response.data;
};

// ================= Admin APIs =================
export const triggerCertificateGeneration = async (data) => {
  const response = await api.post("/certificates/trigger", data);
  return response.data;
};

export const manualGenerateCertificate = async (data) => {
  const response = await api.post("/certificates/manual", data);
  return response.data;
};

export const getAllCertificates = async () => {
  const response = await api.get("/certificates/all");
  return response.data;
};

export const getDownloadLogs = async () => {
  const response = await api.get("/certificates/logs");
  return response.data;
};