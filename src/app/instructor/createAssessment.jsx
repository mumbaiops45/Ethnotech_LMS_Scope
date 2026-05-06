"use client";
import React, { useState, useEffect } from "react";
import { useAssessment } from "../../../hooks/useAssessment";
import { getMyBatchesService } from "../../../service/instructor.service";

export default function AssessmentForm({ initialData, onClose, onSuccess }) {
  const { createAssessment, updateAssessment, loading } = useAssessment();
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "descriptive", // fixed type
    batch: "",
    totalMarks: "",
    passingPercent: "",
    deadline: "",
  });
  const [errors, setErrors] = useState({});

  // Fetch batches on mount
  useEffect(() => {
    const loadBatches = async () => {
      setLoadingBatches(true);

      try {
        const data = await getMyBatchesService();

        console.log("Batches Response:", data);

        setBatches(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load batches", err);
      } finally {
        setLoadingBatches(false);
      }
    };

    loadBatches();
  }, []);

  // Populate form on edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        type: initialData.type || "descriptive",

        batch:
          initialData.batch?._id ||
          initialData.batch ||
          "",

        totalMarks: initialData.totalMarks ?? "",
        passingPercent: initialData.passingPercent ?? "",

        deadline: initialData.deadline
          ? new Date(initialData.deadline)
            .toISOString()
            .slice(0, 16)
          : "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title required";
    if (!formData.batch) newErrors.batch = "Please select a batch";
    if (!formData.deadline) newErrors.deadline = "Deadline required";
    const total = Number(formData.totalMarks);
    const pass = Number(formData.passingPercent);
    if (isNaN(total) || total < 1) newErrors.totalMarks = "Total marks must be ≥ 1";
    if (isNaN(pass) || pass < 0) newErrors.passingPercent = "Passing percent must be ≥ 0";
    if (pass > 100) newErrors.passingPercent = "Passing percent cannot exceed 100";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      title: formData.title,
      type: "descriptive", // force descriptive
      batch: formData.batch,
      totalMarks: Number(formData.totalMarks),
      passingPercent: Number(formData.passingPercent),
      deadline: new Date(formData.deadline).toISOString(),
    };

    try {
      if (initialData) {
        await updateAssessment(initialData._id, payload);
      } else {
        await createAssessment(payload);
      }
      onSuccess();
    } catch (err) {
      alert("Operation failed: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {initialData ? "✏️ Edit Assessment" : "➕ Create Assessment"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block font-medium text-gray-700">Title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Type - hidden, always descriptive */}
            <input type="hidden" name="type" value="descriptive" />

            {/* Batch Dropdown */}
            <div>
              <label className="block font-medium text-gray-700">Batch *</label>
              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
                disabled={loadingBatches}
              >
                <option value="">Select a batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name || batch.title || batch._id}
                  </option>
                ))}
              </select>
              {loadingBatches && <p className="text-gray-500 text-sm mt-1">Loading batches...</p>}
              {errors.batch && <p className="text-red-500 text-sm mt-1">{errors.batch}</p>}
            </div>

            {/* Total Marks & Passing Percent */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700">Total Marks *</label>
                <input
                  name="totalMarks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
                />
                {errors.totalMarks && <p className="text-red-500 text-sm mt-1">{errors.totalMarks}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-700">Passing Percent (%) *</label>
                <input
                  name="passingPercent"
                  type="number"
                  value={formData.passingPercent}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
                />
                {errors.passingPercent && <p className="text-red-500 text-sm mt-1">{errors.passingPercent}</p>}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block font-medium text-gray-700">Deadline *</label>
              <input
                name="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
              />
              {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? "Saving..." : initialData ? "Update Assessment" : "Create Assessment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}