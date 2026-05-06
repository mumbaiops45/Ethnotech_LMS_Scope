"use client";
import React, { useState, useEffect } from "react";
import { useAssignment } from "../../../hooks/useAssignmentCreate";
import { getMyCourses } from "../../../api/auth/courses.api";
import { getLessonsByCourseService } from "../../../service/lesson.service";

export default function AssignmentForm({ initialData, onClose, onSuccess }) {
  const { createAssignment, updateAssignment, loading } = useAssignment();
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
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // Load courses
  useEffect(() => {
    const loadCourses = async () => {
      setLoadingCourses(true);
      try {
        const data = await getMyCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoadingCourses(false);
      }
    };
    loadCourses();
  }, []);

  // Load lessons when course changes
  useEffect(() => {
    if (!formData.course) {
      setLessons([]);
      return;
    }
    const loadLessons = async () => {
      setLoadingLessons(true);
      try {
        const data = await getLessonsByCourseService(formData.course);
        setLessons(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load lessons", err);
      } finally {
        setLoadingLessons(false);
      }
    };
    loadLessons();
  }, [formData.course]);

  // Populate form on edit
 useEffect(() => {
  if (initialData) {
    setFormData({
      title: initialData.title || "",
      description: initialData.description || "",

      course: initialData.course?._id || initialData.course || "",
      lesson: initialData.lesson?._id || initialData.lesson || "",

      totalMarks: initialData.totalMarks ?? "",
      passingMarks: initialData.passingMarks ?? "",

      deadline: initialData.deadline
        ? new Date(initialData.deadline).toISOString().slice(0, 16)
        : "",

      type: initialData.type || "descriptive",
    });
  }
}, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "course") setFormData((prev) => ({ ...prev, lesson: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title required";
    if (!formData.description.trim()) newErrors.description = "Description required";
    if (!formData.course) newErrors.course = "Select a course";
    if (!formData.lesson) newErrors.lesson = "Select a lesson";
    if (!formData.deadline) newErrors.deadline = "Deadline required";
    if (formData.totalMarks < 1) newErrors.totalMarks = "Total marks must be ≥ 1";
    if (formData.passingMarks < 0) newErrors.passingMarks = "Passing marks cannot be negative";
    if (formData.passingMarks > formData.totalMarks)
      newErrors.passingMarks = "Passing marks cannot exceed total marks";
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
      ...formData,
      totalMarks: Number(formData.totalMarks),
      passingMarks: Number(formData.passingMarks),
      deadline: new Date(formData.deadline).toISOString(),
    };

    try {
      if (initialData) {
        await updateAssignment(initialData._id, payload);
      } else {
        await createAssignment(payload);
      }
      onSuccess();
    } catch (err) {
      alert("Operation failed: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {initialData ? "✏️ Edit Assignment" : "➕ Create Assignment"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Title & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="block font-medium text-gray-700">Description *</label>
                <textarea
                  name="description"
                  rows="1"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Row 2: Course & Lesson dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700">Course *</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
                  disabled={loadingCourses}
                  size={1}
                  style={{ maxHeight: "200px" }}
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
                {loadingCourses && <p className="text-gray-500 text-sm mt-1">Loading courses...</p>}
                {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
              </div>
              <div>
                <label className="block font-medium text-gray-700">Lesson *</label>
                <select
                  name="lesson"
                  value={formData.lesson}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
                  disabled={!formData.course || loadingLessons}
                  size={1}
                  style={{ maxHeight: "200px" }}
                >
                  <option value="">Select a lesson</option>
                  {lessons.map((l) => (
                    <option key={l._id} value={l._id}>{l.title}</option>
                  ))}
                </select>
                {loadingLessons && <p className="text-gray-500 text-sm mt-1">Loading lessons...</p>}
                {errors.lesson && <p className="text-red-500 text-sm mt-1">{errors.lesson}</p>}
              </div>
            </div>

            {/* Row 3: Total Marks & Passing Marks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700">Total Marks</label>
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
                <label className="block font-medium text-gray-700">Passing Marks</label>
                <input
                  name="passingMarks"
                  type="number"
                  value={formData.passingMarks}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
                />
                {errors.passingMarks && <p className="text-red-500 text-sm mt-1">{errors.passingMarks}</p>}
              </div>
            </div>

            {/* Row 4: Deadline & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="block font-medium text-gray-700">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
                >
                  <option value="descriptive">📝 Descriptive</option>
                  {/* <option value="quiz">❓ Quiz</option> */}
                  {/* <option value="coding">💻 Coding</option> */}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
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
                {loading ? "Saving..." : initialData ? "Update Assignment" : "Create Assignment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}