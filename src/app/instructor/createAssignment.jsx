"use client";

import React, { useState, useEffect } from "react";

import {
  FaTimes,
  FaSave,
} from "react-icons/fa";

import { useAssignment } from "../../../hooks/useAssignmentCreate";
import { getMyCourses } from "../../../api/auth/courses.api";
import { getLessonsByCourseService } from "../../../service/lesson.service";

export default function AssignmentForm({
  initialData,
  onClose,
  onSuccess,
}) {

  const {
    createAssignment,
    updateAssignment,
    loading,
  } = useAssignment();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    lesson: "",
    totalMarks: "",
    passingMarks: "",
    deadline: "",
    type: "descriptive",
  });

  const [errors, setErrors] = useState({});

  const [courses, setCourses] = useState([]);

  const [lessons, setLessons] = useState([]);

  const [loadingCourses, setLoadingCourses] =
    useState(false);

  const [loadingLessons, setLoadingLessons] =
    useState(false);

  // LOAD COURSES
  useEffect(() => {

    const loadCourses = async () => {

      setLoadingCourses(true);

      try {

        const data = await getMyCourses();

        setCourses(
          Array.isArray(data) ? data : []
        );

      } catch (err) {

        console.error(
          "Failed to load courses",
          err
        );

      } finally {

        setLoadingCourses(false);
      }
    };

    loadCourses();

  }, []);

  // LOAD LESSONS
  useEffect(() => {

    if (!formData.course) {

      setLessons([]);

      return;
    }

    const loadLessons = async () => {

      setLoadingLessons(true);

      try {

        const data =
          await getLessonsByCourseService(
            formData.course
          );

        setLessons(
          Array.isArray(data) ? data : []
        );

      } catch (err) {

        console.error(
          "Failed to load lessons",
          err
        );

      } finally {

        setLoadingLessons(false);
      }
    };

    loadLessons();

  }, [formData.course]);

  // EDIT DATA
  useEffect(() => {

    if (initialData) {

      setFormData({
        title: initialData.title || "",
        description:
          initialData.description || "",

        course:
          initialData.course?._id ||
          initialData.course ||
          "",

        lesson:
          initialData.lesson?._id ||
          initialData.lesson ||
          "",

        totalMarks:
          initialData.totalMarks ?? "",

        passingMarks:
          initialData.passingMarks ?? "",

        deadline: initialData.deadline
          ? new Date(
              initialData.deadline
            )
              .toISOString()
              .slice(0, 16)
          : "",

        type:
          initialData.type ||
          "descriptive",
      });
    }

  }, [initialData]);

  const handleChange = (e) => {

    const { name, value } = e.target;

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

    if (name === "course") {

      setFormData((prev) => ({
        ...prev,
        lesson: "",
      }));
    }
  };

  const validate = () => {

    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title =
        "Title is required";
    }

    if (
      !formData.description.trim()
    ) {
      newErrors.description =
        "Description is required";
    }

    if (!formData.course) {
      newErrors.course =
        "Select a course";
    }

    if (!formData.lesson) {
      newErrors.lesson =
        "Select a lesson";
    }

    if (!formData.deadline) {
      newErrors.deadline =
        "Deadline is required";
    }

    if (formData.totalMarks < 1) {
      newErrors.totalMarks =
        "Total marks must be greater than 0";
    }

    if (formData.passingMarks < 0) {
      newErrors.passingMarks =
        "Passing marks cannot be negative";
    }

    if (
      Number(formData.passingMarks) >
      Number(formData.totalMarks)
    ) {
      newErrors.passingMarks =
        "Passing marks cannot exceed total marks";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const newErrors = validate();

    if (
      Object.keys(newErrors).length > 0
    ) {

      setErrors(newErrors);

      return;
    }

    const payload = {
      ...formData,

      totalMarks: Number(
        formData.totalMarks
      ),

      passingMarks: Number(
        formData.passingMarks
      ),

      deadline: new Date(
        formData.deadline
      ).toISOString(),
    };

    try {

      if (initialData) {

        await updateAssignment(
          initialData._id,
          payload
        );

      } else {

        await createAssignment(payload);
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

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter assignment title"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
        />

        {errors.title && (
          <p className="text-red-500 text-xs mt-1">
            {errors.title}
          </p>
        )}
      </div>

      {/* DESCRIPTION */}
      <div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>

        <textarea
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter assignment description"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)] resize-none"
        />

        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description}
          </p>
        )}
      </div>

      {/* COURSE + LESSON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* COURSE */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course *
          </label>

          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            disabled={loadingCourses}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)] bg-white"
          >
            <option value="">
              Select Course
            </option>

            {courses.map((course) => (
              <option
                key={course._id}
                value={course._id}
              >
                {course.title}
              </option>
            ))}
          </select>

          {loadingCourses && (
            <p className="text-xs text-gray-500 mt-1">
              Loading courses...
            </p>
          )}

          {errors.course && (
            <p className="text-red-500 text-xs mt-1">
              {errors.course}
            </p>
          )}
        </div>

        {/* LESSON */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lesson *
          </label>

          <select
            name="lesson"
            value={formData.lesson}
            onChange={handleChange}
            disabled={
              !formData.course ||
              loadingLessons
            }
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)] bg-white"
          >
            <option value="">
              Select Lesson
            </option>

            {lessons.map((lesson) => (
              <option
                key={lesson._id}
                value={lesson._id}
              >
                {lesson.title}
              </option>
            ))}
          </select>

          {loadingLessons && (
            <p className="text-xs text-gray-500 mt-1">
              Loading lessons...
            </p>
          )}

          {errors.lesson && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lesson}
            </p>
          )}
        </div>
      </div>

      {/* MARKS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* TOTAL MARKS */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Marks
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

        {/* PASSING MARKS */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passing Marks
          </label>

          <input
            type="number"
            name="passingMarks"
            value={formData.passingMarks}
            onChange={handleChange}
            placeholder="Enter passing marks"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
          />

          {errors.passingMarks && (
            <p className="text-red-500 text-xs mt-1">
              {errors.passingMarks}
            </p>
          )}
        </div>
      </div>

      {/* DEADLINE + TYPE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* DEADLINE */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
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

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assignment Type
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)] bg-white"
          >
            <option value="descriptive">
              Descriptive
            </option>
          </select>
        </div>
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
            ? "Update Assignment"
            : "Create Assignment"}
        </button>
      </div>
    </form>
  );
}