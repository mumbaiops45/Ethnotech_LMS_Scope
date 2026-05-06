import {
  getMyCertificates,
  downloadCertificate,
  triggerCertificateGeneration,
  manualGenerateCertificate,
  getAllCertificates,
  getDownloadLogs
} from "../api/auth/certificate.api";

// ================= Student Services =================
export const getMyCertificatesService = async () => {
  const res = await getMyCertificates();
  return res;
};

export const downloadCertificateService = async (certificateId) => {
  const res = await downloadCertificate(certificateId);
  return res;
};

// ================= Admin Services =================
export const triggerCertificateGenerationService = async (payload) => {
  const res = await triggerCertificateGeneration(payload);
  return res;
};

export const manualGenerateCertificateService = async (payload) => {
  const res = await manualGenerateCertificate(payload);
  return res;
};

export const getAllCertificatesService = async () => {
  const res = await getAllCertificates();
  return res;
};

export const getDownloadLogsService = async () => {
  const res = await getDownloadLogs();
  return res;
};