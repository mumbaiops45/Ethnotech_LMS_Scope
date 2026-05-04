"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDownload, FaAward, FaQrcode, FaShareAlt } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";  // ✅ named import (no default export)
import { getMyCertificates, downloadCertificate } from "../../../../service/certificate-templates.service";

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [showQR, setShowQR] = useState(null);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const data = await getMyCertificates();
      setCertificates(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleDownload = async (certificateId) => {
    setDownloading(certificateId);
    try {
      const blob = await downloadCertificate(certificateId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate_${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloading(null);
    }
  };

  const copyShareLink = (certificateId) => {
    const link = `${window.location.origin}/certificate/${certificateId}`;
    navigator.clipboard.writeText(link);
    toast.success("Share link copied!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Certificates</h1>
        <p className="text-gray-500 mt-1">View and download your earned certificates</p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <FaAward className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">You haven't earned any certificates yet.</p>
          <p className="text-sm text-gray-400 mt-1">Complete your courses to receive certificates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <FaAward className="text-indigo-500 text-xl" />
                    <h3 className="font-semibold text-gray-800">
                      {cert.courseName || "Course Certificate"}
                    </h3>
                  </div>
                  <div className="text-gray-400 text-xs font-mono">
                    {cert.certificateId?.slice(-6)}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDownload(cert.certificateId)}
                    disabled={downloading === cert.certificateId}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    <FaDownload />
                    {downloading === cert.certificateId ? "..." : "PDF"}
                  </button>
                  <button
                    onClick={() => copyShareLink(cert.certificateId)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    title="Copy shareable link"
                  >
                    <FaShareAlt className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowQR(showQR === cert._id ? null : cert._id)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    title="Show QR code"
                  >
                    <FaQrcode className="text-gray-600" />
                  </button>
                </div>

                {showQR === cert._id && (
                  <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                    <QRCodeCanvas
                      value={`${window.location.origin}/certificate/${cert.certificateId}`}
                      size={100}
                    />
                    <p className="text-xs text-gray-500 mt-2">Scan to verify</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}