"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaSync, FaAward, FaSearch, FaUser, FaBook, FaCalendar, FaDownload
} from "react-icons/fa";
import {
  getAllCertificates,
  triggerAutoGeneration,
  manualGenerateCertificate,
  getDownloadLogs,
} from "../../../../service/certificate-templates.service";
import { getStudents } from "../../../../service/login.service";
import { getCourses } from "../../../../service/login.service";

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showManualModal, setShowManualModal] = useState(false);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [manualData, setManualData] = useState({ studentId: "", courseId: "" });
  const [triggerData, setTriggerData] = useState({ studentId: "", courseId: "" });
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("certificates");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Helper to get student display name (same logic as working component)
  const getStudentName = (student) => {
    return student.profile?.fullName || student.fullName || student.name || student.email;
  };

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      // Use Promise.allSettled so a failure in courses doesn't block students
      const results = await Promise.allSettled([getStudents(), getCourses()]);
      
      // Handle students
      if (results[0].status === "fulfilled") {
        const studentsData = results[0].value;
        setStudents(Array.isArray(studentsData) ? studentsData : []);
      } else {
        console.error("Failed to load students:", results[0].reason);
        toast.error("Could not load student list");
        setStudents([]);
      }
      
      // Handle courses
      if (results[1].status === "fulfilled") {
        const coursesData = results[1].value;
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } else {
        console.error("Failed to load courses:", results[1].reason);
        if (results[1].reason?.response?.status === 403) {
          toast.error("Access to courses denied. Contact admin to fix permissions.");
        } else {
          toast.error("Could not load courses");
        }
        setCourses([]);
      }
      setLoadingOptions(false);
    };
    fetchOptions();
  }, []);

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

  useEffect(() => {
    if (activeTab === "certificates") fetchCertificates();
    else fetchLogs();
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

  const filteredCertificates = certificates.filter(cert =>
    (cert.studentName || cert.student?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cert.courseName || cert.course?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cert.certificateId || "").includes(searchTerm)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Certificate Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTriggerModal(true)}
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <FaSync className={submitting ? "animate-spin" : ""} /> Trigger Auto-Generation
          </button>
          <button
            onClick={() => setShowManualModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <FaAward /> Manual Issue (Override)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab("certificates")}
            className={`pb-2 px-1 font-medium transition ${
              activeTab === "certificates"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All Certificates ({certificates.length})
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`pb-2 px-1 font-medium transition ${
              activeTab === "logs"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Download Logs
          </button>
        </nav>
      </div>

      {/* Certificates Tab */}
      {activeTab === "certificates" && (
        <>
          <div className="mb-4 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, course, or certificate ID..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full max-w-md focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : filteredCertificates.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <FaAward className="text-5xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No certificates issued yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issued Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredCertificates.map((cert) => (
                    <tr key={cert._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cert.studentName || cert.student?.name || "—"}
                      </td>
                      <td className="px-6 py-4">{cert.courseName || cert.course?.title || "—"}</td>
                      <td className="px-6 py-4 font-mono text-sm">{cert.certificateId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(cert.issuedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`/certificate/${cert.certificateId}`}
                          target="_blank"
                          className="text-indigo-600 hover:underline text-sm"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Logs Tab */}
      {activeTab === "logs" && (
        <>
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <p className="text-gray-500">No download logs available</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Downloaded At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">{log.certificateId}</td>
                      <td className="px-6 py-4">{log.studentName || log.student?.name || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(log.downloadedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">{log.ipAddress || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal for Trigger Auto-Generation */}
      {showTriggerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Trigger Auto-Generation</h2>
            <p className="text-sm text-gray-600 mb-4">
              Generate certificate for a specific student based on completion criteria.
            </p>
            <form onSubmit={handleTriggerAuto} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                {loadingOptions ? (
                  <div className="text-gray-400">Loading students...</div>
                ) : (
                  <select
                    value={triggerData.studentId}
                    onChange={(e) => setTriggerData({ ...triggerData, studentId: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {getStudentName(student)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                {loadingOptions ? (
                  <div className="text-gray-400">Loading courses...</div>
                ) : (
                  <select
                    value={triggerData.courseId}
                    onChange={(e) => setTriggerData({ ...triggerData, courseId: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTriggerModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || loadingOptions}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  {submitting ? "Triggering..." : "Trigger"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Manual Issue */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Manual Certificate Issuance (Override)</h2>
            <form onSubmit={handleManualGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                {loadingOptions ? (
                  <div className="text-gray-400">Loading students...</div>
                ) : (
                  <select
                    value={manualData.studentId}
                    onChange={(e) => setManualData({ ...manualData, studentId: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {getStudentName(student)} ({student.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                {loadingOptions ? (
                  <div className="text-gray-400">Loading courses...</div>
                ) : (
                  <select
                    value={manualData.courseId}
                    onChange={(e) => setManualData({ ...manualData, courseId: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || loadingOptions}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
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