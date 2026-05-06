"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUserGraduate, FaBookOpen, FaMagic, FaHandPaper, FaSpinner } from "react-icons/fa";
import { useCertificateStore } from "../../../store/certificate.store";
import { useCertificate } from "../../../hooks/useCertificate";

const CreateCertificate = ({ onSuccess }) => {
  const { loading, manualGenerate, triggerAutoGeneration } = useCertificateStore();
  const { students, courses, fetchStudents, fetchCourses } = useCertificate();

  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    type: "manual",
  });

  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, [fetchStudents, fetchCourses]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.courseId) {
      toast.error("Please select both a student and a course");
      return;
    }

    setLocalLoading(true);
    try {
      if (formData.type === "manual") {
        await manualGenerate({
          studentId: formData.studentId,
          courseId: formData.courseId,
        });
        toast.success("Certificate issued manually");
      } else {
        await triggerAutoGeneration({
          studentId: formData.studentId,
          courseId: formData.courseId,
        });
        toast.success("Auto‑generation triggered for this student/course");
      }

      setFormData({
        studentId: "",
        courseId: "",
        type: "manual",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to generate certificate");
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = loading || localLoading;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Generate Certificate</h2>
          <p className="text-indigo-100 text-sm mt-1">
            Issue a certificate manually or trigger auto‑generation based on completion criteria
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Generation Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Generation Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "manual" })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  formData.type === "manual"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-600 hover:border-indigo-200"
                }`}
              >
                <FaHandPaper />
                <span className="font-medium">Manual Override</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "auto" })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  formData.type === "auto"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-600 hover:border-indigo-200"
                }`}
              >
                <FaMagic />
                <span className="font-medium">Auto‑Generate</span>
              </button>
            </div>
            {formData.type === "auto" && (
              <p className="text-xs text-gray-500 mt-2">
                System will check completion criteria (lesson watch %, assessments, assignments) before issuing.
              </p>
            )}
            {formData.type === "manual" && (
              <p className="text-xs text-gray-500 mt-2">
                Force issue a certificate regardless of completion status – useful for special cases.
              </p>
            )}
          </div>

          {/* Student Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaUserGraduate className="inline mr-2 text-indigo-500" />
              Select Student
            </label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <option value="">-- Choose a student --</option>
              {students?.map((student) => (
                <option key={student._id} value={student._id}>
                  {student?.profile?.fullName || student?.fullName || student?.name || student?.email}
                </option>
              ))}
            </select>
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaBookOpen className="inline mr-2 text-indigo-500" />
              Select Course
            </label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <option value="">-- Choose a course --</option>
              {courses?.map((course) => (
                <option key={course._id} value={course._id}>
                  {course?.title || course?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => onSuccess?.()}
              className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl flex items-center gap-2 shadow-md transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing...
                </>
              ) : formData.type === "manual" ? (
                "Issue Certificate"
              ) : (
                "Trigger Auto‑Generation"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCertificate;