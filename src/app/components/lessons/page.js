"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaArrowUp,
  FaArrowDown,
  FaEdit,
  FaTrash,
  FaPlus,
  FaVideo,
} from "react-icons/fa";
import {
  getCourses,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
} from "../../../../service/login.service";

export default function LessonsPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedModule, setSelectedModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: 0,
    isPreview: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Load all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCourses();
        setCourses(res.data || []);
      } catch (error) {
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Refresh lessons when module changes
  useEffect(() => {
    if (selectedModule && selectedModule.lessons) {
      setLessons(selectedModule.lessons);
    } else {
      setLessons([]);
    }
  }, [selectedModule]);

  const handleCourseChange = (courseId) => {
    const course = courses.find((c) => c._id === courseId);
    setSelectedCourseId(courseId);
    setSelectedCourse(course);
    setSelectedModuleId("");
    setSelectedModule(null);
    setLessons([]);
  };

  const handleModuleChange = (moduleId) => {
    const module = selectedCourse?.modules?.find((m) => m._id === moduleId);
    setSelectedModuleId(moduleId);
    setSelectedModule(module);
  };

  const refreshModule = async () => {
    // Re‑fetch the course to get latest module data
    const res = await getCourses();
    const updatedCourse = res.data.find((c) => c._id === selectedCourseId);
    if (updatedCourse) {
      setSelectedCourse(updatedCourse);
      const updatedModule = updatedCourse.modules?.find((m) => m._id === selectedModuleId);
      setSelectedModule(updatedModule);
    }
  };

  // ---------- Lesson CRUD ----------
  const openCreateModal = () => {
    setEditingLesson(null);
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      duration: 0,
      isPreview: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title || "",
      description: lesson.description || "",
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration || 0,
      isPreview: lesson.isPreview || false,
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Lesson title required");
      return;
    }
    setSubmitting(true);
    try {
      if (editingLesson) {
        await updateLesson(editingLesson._id, formData);
        toast.success("Lesson updated");
      } else {
        await createLesson(selectedCourseId, selectedModuleId, formData);
        toast.success("Lesson added");
      }
      await refreshModule();
      setModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (lessonId) => {
    if (!confirm("Delete this lesson? This action cannot be undone.")) return;
    try {
      await deleteLesson(lessonId);
      toast.success("Lesson deleted");
      await refreshModule();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const moveLesson = async (index, direction) => {
    const newLessons = [...lessons];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newLessons.length) return;
    [newLessons[index], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[index]];
    setLessons(newLessons); // optimistic update
    setReordering(true);
    try {
      await reorderLessons(selectedCourseId, selectedModuleId, newLessons.map((l) => l._id));
      await refreshModule();
    } catch (error) {
      toast.error("Reorder failed");
      await refreshModule(); // revert
    } finally {
      setReordering(false);
    }
  };

  const handleVideoUpload = async (file) => {
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video size must be less than 100MB");
      return;
    }
    setUploadingVideo(true);
    const formDataFile = new FormData();
    formDataFile.append("video", file);
    try {
      // Replace with your actual upload endpoint if needed
      const res = await fetch("http://localhost:8080/upload/video", {
        method: "POST",
        body: formDataFile,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, videoUrl: data.url }));
        toast.success("Video uploaded");
      } else {
        throw new Error("No URL returned");
      }
    } catch (err) {
      toast.error("Upload failed, using temporary URL");
      const tempUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, videoUrl: tempUrl }));
    } finally {
      setUploadingVideo(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading courses...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header & Back button */}
      <div className="mb-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Lessons</h1>

      {/* Course selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
        <select
          value={selectedCourseId}
          onChange={(e) => handleCourseChange(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">-- Choose a course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Module selector */}
      {selectedCourse && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Module</label>
          <select
            value={selectedModuleId}
            onChange={(e) => handleModuleChange(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">-- Choose a module --</option>
            {(selectedCourse.modules || []).map((module) => (
              <option key={module._id} value={module._id}>
                {module.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Lessons section */}
      {selectedModule && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Lessons</h2>
            <button
              onClick={openCreateModal}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
            >
              <FaPlus /> New Lesson
            </button>
          </div>

          {lessons.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No lessons yet. Click "New Lesson" to add.</p>
          ) : (
            <ul className="space-y-2">
              {lessons.map((lesson, idx) => (
                <li key={lesson._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {lesson.isPreview && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">Preview</span>
                      )}
                      <span className="font-medium">{lesson.title}</span>
                      {lesson.duration > 0 && (
                        <span className="text-xs text-gray-500">({lesson.duration} min)</span>
                      )}
                    </div>
                    {lesson.description && (
                      <p className="text-sm text-gray-500 truncate">{lesson.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => moveLesson(idx, -1)}
                      disabled={idx === 0 || reordering}
                      className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      title="Move Up"
                    >
                      <FaArrowUp />
                    </button>
                    <button
                      onClick={() => moveLesson(idx, 1)}
                      disabled={idx === lessons.length - 1 || reordering}
                      className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      title="Move Down"
                    >
                      <FaArrowDown />
                    </button>
                    <button
                      onClick={() => openEditModal(lesson)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Lesson Modal (Create/Edit) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingLesson ? "Edit Lesson" : "Add Lesson"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Video URL + upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Video</label>
                <div className="flex gap-2 flex-wrap items-center">
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2">
                    {uploadingVideo ? "Uploading..." : <><FaVideo /> Upload Video</>}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleVideoUpload(file);
                        e.target.value = "";
                      }}
                      disabled={uploadingVideo}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Paste a video URL or upload a video file (max 100MB).
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  min="0"
                  step="1"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isPreview"
                  checked={formData.isPreview}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">
                  Allow preview (free) for non-enrolled users
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingVideo}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingLesson ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}