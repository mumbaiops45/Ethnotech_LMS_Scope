"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaSync,
  FaAward,
  FaSearch,
  FaDownload,
} from "react-icons/fa";

import {
  getAllCertificates,
  triggerAutoGeneration,
  manualGenerateCertificate,
  getDownloadLogs,
} from "../../../../service/certificate-templates.service";
import {
  getStudents,
  getCourses,
} from "../../../../service/login.service";

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showManualModal, setShowManualModal] = useState(false);
  const [showTriggerModal, setShowTriggerModal] = useState(false);

  const [manualData, setManualData] = useState({
    studentId: "",
    courseId: "",
  });

  const [triggerData, setTriggerData] = useState({
    studentId: "",
    courseId: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("certificates");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const getStudentName = (student) => {
    return (
      student.profile?.fullName ||
      student.fullName ||
      student.name ||
      student.email
    );
  };

  // Fetch students & courses on mount
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      const results = await Promise.allSettled([getStudents(), getCourses()]);

      if (results[0].status === "fulfilled") {
        const studentsData = results[0].value;
        setStudents(Array.isArray(studentsData) ? studentsData : []);
      } else {
        toast.error("Could not load student list");
        setStudents([]);
      }

      if (results[1].status === "fulfilled") {
        const coursesData = results[1].value;
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } else {
        toast.error("Could not load courses");
        setCourses([]);
      }
      setLoadingOptions(false);
    };

    fetchOptions();
  }, []);

  // Fetch certificates
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const data = await getAllCertificates();
      setCertificates(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  // Fetch download logs
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getDownloadLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  // Refetch when tab changes
  useEffect(() => {
    if (activeTab === "certificates") {
      fetchCertificates();
    } else {
      fetchLogs();
    }
  }, [activeTab]);

  const handleTriggerAuto = async (e) => {
    e.preventDefault();
    if (!triggerData.studentId || !triggerData.courseId) {
      toast.error("Please select a student and course");
      return;
    }
    setSubmitting(true);
    try {
      await triggerAutoGeneration(triggerData);
      toast.success("Auto-generation triggered");
      setShowTriggerModal(false);
      setTriggerData({ studentId: "", courseId: "" });
      fetchCertificates();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Trigger failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualGenerate = async (e) => {
    e.preventDefault();
    if (!manualData.studentId || !manualData.courseId) {
      toast.error("Please select a student and course");
      return;
    }
    setSubmitting(true);
    try {
      await manualGenerateCertificate(manualData);
      toast.success("Certificate issued manually");
      setShowManualModal(false);
      setManualData({ studentId: "", courseId: "" });
      fetchCertificates();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Generation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Download certificate (adjust endpoint to match your backend)
  const handleDownload = async (certificateId) => {
    try {
      const response = await fetch(`/api/certificates/download/${certificateId}`, {
        method: "GET",
        headers: { "Content-Type": "application/pdf" },
      });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate_${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (error) {
      toast.error("Could not download certificate");
    }
  };

  const filteredCertificates = certificates.filter(
    (cert) =>
      (cert.studentName || cert.student?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (cert.courseName || cert.course?.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (cert.certificateId || "").includes(searchTerm)
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">
            Certificate Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage issued certificates and logs
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <button
            onClick={() => setShowTriggerModal(true)}
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition w-full sm:w-auto"
          >
            <FaSync className={submitting ? "animate-spin" : ""} />
            Trigger Auto
          </button>
          <button
            onClick={() => setShowManualModal(true)}
            className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition w-full sm:w-auto"
          >
            <FaAward />
            Manual Issue
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="flex">
          <button
            onClick={() => setActiveTab("certificates")}
            className={`flex-1 sm:flex-none px-5 py-4 text-sm font-medium transition ${
              activeTab === "certificates"
                ? "bg-[var(--primary)] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Certificates ({certificates.length})
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`flex-1 sm:flex-none px-5 py-4 text-sm font-medium transition ${
              activeTab === "logs"
                ? "bg-[var(--primary)] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Download Logs
          </button>
        </div>
      </div>

      {/* Certificates Tab */}
      {activeTab === "certificates" && (
        <>
          <div className="relative mb-5 max-w-xl">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search certificates..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">Loading...</div>
          ) : filteredCertificates.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <FaAward className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No certificates issued yet</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
                <table className="min-w-full">
                  <thead className="bg-[var(--primary)] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs uppercase">Student</th>
                      <th className="px-6 py-4 text-left text-xs uppercase">Course</th>
                      <th className="px-6 py-4 text-left text-xs uppercase">Certificate ID</th>
                      <th className="px-6 py-4 text-left text-xs uppercase">Issued Date</th>
                      <th className="px-6 py-4 text-left text-xs uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCertificates.map((cert) => (
                      <tr key={cert._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{cert.studentName || cert.student?.name || "—"}</td>
                        <td className="px-6 py-4">{cert.courseName || cert.course?.title || "—"}</td>
                        <td className="px-6 py-4 font-mono text-sm">{cert.certificateId}</td>
                        <td className="px-6 py-4">{new Date(cert.issuedAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <a
                              href={`/certificate/${cert.certificateId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--primary)] hover:underline text-sm font-medium"
                            >
                              View
                            </a>
                            <button
                              onClick={() => handleDownload(cert._id)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Download PDF"
                            >
                              <FaDownload />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="grid gap-4 lg:hidden">
                {filteredCertificates.map((cert) => (
                  <div key={cert._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {cert.studentName || cert.student?.name || "—"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {cert.courseName || cert.course?.title || "—"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`/certificate/${cert.certificateId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--primary)] text-sm font-medium"
                        >
                          View
                        </a>
                        <button onClick={() => handleDownload(cert._id)} className="text-blue-600">
                          <FaDownload />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex justify-between gap-3">
                        <span className="text-sm text-gray-500">Certificate ID</span>
                        <span className="text-sm font-mono text-right">{cert.certificateId}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-sm text-gray-500">Issued</span>
                        <span className="text-sm text-right">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Logs Tab */}
      {activeTab === "logs" && (
        <>
          {loading ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <p className="text-gray-500">No download logs available</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
                <table className="min-w-full">
                  <thead className="bg-[var(--primary)] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs uppercase">Certificate ID</th>
                      <th className="px-6 py-4 text-left text-xs uppercase">Student</th>
                      <th className="px-6 py-4 text-left text-xs uppercase">Downloaded At</th>
                      <th className="px-6 py-4 text-left text-xs uppercase">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm">{log.certificateId}</td>
                        <td className="px-6 py-4">{log.studentName || log.student?.name || "—"}</td>
                        <td className="px-6 py-4">{new Date(log.downloadedAt).toLocaleString()}</td>
                        <td className="px-6 py-4">{log.ipAddress || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="grid gap-4 lg:hidden">
                {logs.map((log) => (
                  <div key={log._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between gap-3">
                        <span className="text-sm text-gray-500">Certificate</span>
                        <span className="text-sm font-mono text-right">{log.certificateId}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-sm text-gray-500">Student</span>
                        <span className="text-sm text-right">{log.studentName || log.student?.name || "—"}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-sm text-gray-500">Downloaded</span>
                        <span className="text-sm text-right">{new Date(log.downloadedAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-sm text-gray-500">IP</span>
                        <span className="text-sm text-right">{log.ipAddress || "-"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Trigger Auto Modal */}
      {showTriggerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[var(--primary)] mb-2">Trigger Auto Generation</h2>
            <p className="text-sm text-gray-500 mb-5">Generate certificate automatically</p>
            <form onSubmit={handleTriggerAuto} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                <select
                  value={triggerData.studentId}
                  onChange={(e) => setTriggerData({ ...triggerData, studentId: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {getStudentName(student)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <select
                  value={triggerData.courseId}
                  onChange={(e) => setTriggerData({ ...triggerData, courseId: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="">Select course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowTriggerModal(false)} className="px-4 py-2.5 border rounded-xl">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2.5 bg-green-600 text-white rounded-xl">
                  {submitting ? "Triggering..." : "Trigger"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Issue Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[var(--primary)] mb-4">Manual Certificate Issue</h2>
            <form onSubmit={handleManualGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                <select
                  value={manualData.studentId}
                  onChange={(e) => setManualData({ ...manualData, studentId: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {getStudentName(student)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <select
                  value={manualData.courseId}
                  onChange={(e) => setManualData({ ...manualData, courseId: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="">Select course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowManualModal(false)} className="px-4 py-2.5 border rounded-xl">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl">
                  {submitting ? "Issuing..." : "Issue Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}