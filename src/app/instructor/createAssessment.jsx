"use client";

import React, { useState, useEffect } from "react";

import {
  FaClipboardCheck,
  FaUsers,
  FaAward,
  FaCheckCircle,
  FaCalendarAlt,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import { useAssessment } from "../../../hooks/useAssessment";

import { getMyBatchesService } from "../../../service/instructor.service";

export default function AssessmentForm({
  initialData,
  onClose,
  onSuccess,
}) {

  const {
    createAssessment,
    updateAssessment,
    loading,
  } = useAssessment();

  const [batches, setBatches] =
    useState([]);

  const [
    loadingBatches,
    setLoadingBatches,
  ] = useState(false);

  const [formData, setFormData] =
    useState({
      title: "",
      type: "descriptive",
      batch: "",
      totalMarks: "",
      passingPercent: "",
      deadline: "",
    });

  const [errors, setErrors] =
    useState({});

  // LOAD BATCHES
  useEffect(() => {

    const loadBatches = async () => {

      setLoadingBatches(true);

      try {

        const data =
          await getMyBatchesService();

        setBatches(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.error(
          "Failed to load batches",
          err
        );

      } finally {

        setLoadingBatches(false);
      }
    };

    loadBatches();

  }, []);

  // EDIT DATA
  useEffect(() => {

    if (initialData) {

      setFormData({
        title:
          initialData.title || "",

        type:
          initialData.type ||
          "descriptive",

        batch:
          initialData.batch?._id ||
          initialData.batch ||
          "",

        totalMarks:
          initialData.totalMarks ??
          "",

        passingPercent:
          initialData.passingPercent ??
          "",

        deadline:
          initialData.deadline
            ? new Date(
                initialData.deadline
              )
                .toISOString()
                .slice(0, 16)
            : "",
      });
    }

  }, [initialData]);

  const handleChange = (e) => {

    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {

    const newErrors = {};

    if (!formData.title.trim()) {

      newErrors.title =
        "Title is required";
    }

    if (!formData.batch) {

      newErrors.batch =
        "Please select a batch";
    }

    if (!formData.deadline) {

      newErrors.deadline =
        "Deadline is required";
    }

    const total = Number(
      formData.totalMarks
    );

    const pass = Number(
      formData.passingPercent
    );

    if (
      isNaN(total) ||
      total < 1
    ) {

      newErrors.totalMarks =
        "Total marks must be greater than 0";
    }

    if (
      isNaN(pass) ||
      pass < 0
    ) {

      newErrors.passingPercent =
        "Passing percent must be greater than 0";
    }

    if (pass > 100) {

      newErrors.passingPercent =
        "Passing percent cannot exceed 100";
    }

    return newErrors;
  };

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    const newErrors =
      validate();

    if (
      Object.keys(newErrors)
        .length > 0
    ) {

      setErrors(newErrors);

      return;
    }

    const payload = {
      title: formData.title,

      type: "descriptive",

      batch: formData.batch,

      totalMarks: Number(
        formData.totalMarks
      ),

      passingPercent: Number(
        formData.passingPercent
      ),

      deadline: new Date(
        formData.deadline
      ).toISOString(),
    };

    try {

      if (initialData) {

        await updateAssessment(
          initialData._id,
          payload
        );

      } else {

        await createAssessment(
          payload
        );
      }

      onSuccess();

    } catch (err) {

      alert(
        "Operation failed: " +
          err.message
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* TITLE */}
      <div>

        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Title *
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter assessment title"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
        />

        {errors.title && (
          <p className="text-red-500 text-xs mt-1">
            {errors.title}
          </p>
        )}
      </div>

      {/* BATCH */}
      <div>

        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Batch *
        </label>

        <select
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          disabled={loadingBatches}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)] bg-white"
        >
          <option value="">
            Select Batch
          </option>

          {batches.map((batch) => (
            <option
              key={batch._id}
              value={batch._id}
            >
              {batch.name ||
                batch.title ||
                batch._id}
            </option>
          ))}
        </select>

        {loadingBatches && (
          <p className="text-xs text-gray-500 mt-1">
            Loading batches...
          </p>
        )}

        {errors.batch && (
          <p className="text-red-500 text-xs mt-1">
            {errors.batch}
          </p>
        )}
      </div>

      {/* MARKS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* TOTAL MARKS */}
        <div>

          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Total Marks *
          </label>

          <input
            type="number"
            name="totalMarks"
            value={formData.totalMarks}
            onChange={handleChange}
            placeholder="Enter total marks"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
          />

          {errors.totalMarks && (
            <p className="text-red-500 text-xs mt-1">
              {errors.totalMarks}
            </p>
          )}
        </div>

        {/* PASSING PERCENT */}
        <div>

          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Passing Percent (%) *
          </label>

          <input
            type="number"
            name="passingPercent"
            value={
              formData.passingPercent
            }
            onChange={handleChange}
            placeholder="Enter passing percent"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
          />

          {errors.passingPercent && (
            <p className="text-red-500 text-xs mt-1">
              {
                errors.passingPercent
              }
            </p>
          )}
        </div>
      </div>

      {/* DEADLINE */}
      <div>

        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Deadline *
        </label>

        <input
          type="datetime-local"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
        />

        {errors.deadline && (
          <p className="text-red-500 text-xs mt-1">
            {errors.deadline}
          </p>
        )}
      </div>

      {/* TYPE */}
      <div>

        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Assessment Type
        </label>

        <input
          type="text"
          value="Descriptive"
          disabled
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
        >
          <FaTimes className="text-xs" />
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white hover:opacity-90 text-sm flex items-center gap-2 disabled:opacity-50"
        >
          <FaSave className="text-xs" />

          {loading
            ? "Saving..."
            : initialData
            ? "Update Assessment"
            : "Create Assessment"}
        </button>
      </div>
    </form>
  );
}