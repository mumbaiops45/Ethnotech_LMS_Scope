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
  FaCheckCircle,
  FaRegCircle,
  FaEye,
  FaLock,
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
    isMandatory: true,
    minWatchPercentage: 80,
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
      isMandatory: true,
      minWatchPercentage: 80,
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
      isMandatory: lesson.isMandatory !== undefined ? lesson.isMandatory : true,
      minWatchPercentage: lesson.minWatchPercentage || 80,
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
    let minPct = parseInt(formData.minWatchPercentage);
    if (isNaN(minPct)) minPct = 0;
    if (minPct < 0 || minPct > 100) {
      toast.error("Watch percentage must be between 0 and 100");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...formData, minWatchPercentage: minPct };
      if (editingLesson) {
        await updateLesson(editingLesson._id, payload);
        toast.success("Lesson updated");
      } else {
        await createLesson(selectedCourseId, selectedModuleId, payload);
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
    setLessons(newLessons);
    setReordering(true);
    try {
      await reorderLessons(selectedCourseId, selectedModuleId, newLessons.map((l) => l._id));
      await refreshModule();
    } catch (error) {
      toast.error("Reorder failed");
      await refreshModule();
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

  if (loading) return <div className="p-6 text-center text-gray-500">Loading courses...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">📘 Lesson Manager</h1>
        </div>

        {/* Two card selectors: Course + Module */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Course Card */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">🎓 Select Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="">-- Choose a course --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Module Card */}
          {selectedCourse && (
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">📂 Select Module</label>
              <select
                value={selectedModuleId}
                onChange={(e) => handleModuleChange(e.target.value)}
                className="w-full border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-400"
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
        </div>

        {/* Lessons Section */}
        {selectedModule && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaVideo className="text-blue-500" /> Lessons
              </h2>
              <button
                onClick={openCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm transition"
              >
                <FaPlus /> Add Lesson
              </button>
            </div>

            {lessons.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <FaVideo className="mx-auto text-4xl mb-3 opacity-50" />
                <p>No lessons yet. Click "Add Lesson" to create one.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {lessons.map((lesson, idx) => (
                  <li key={lesson._id} className="p-5 hover:bg-gray-50 transition group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          {/* Badges */}
                          {lesson.isPreview ? (
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                              <FaEye size={10} /> Preview
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                              <FaLock size={10} /> Locked
                            </span>
                          )}
                          {lesson.isMandatory ? (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                              <FaCheckCircle size={10} /> Mandatory
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
                              <FaRegCircle size={10} /> Optional
                            </span>
                          )}
                          {lesson.duration > 0 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {lesson.duration} min
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">{lesson.title}</h3>
                        {lesson.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{lesson.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>Watch requirement: {lesson.minWatchPercentage || 80}%</span>
                          {lesson.videoUrl && <span className="flex items-center gap-1"><FaVideo /> Video attached</span>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 md:flex-col lg:flex-row">
                        <div className="flex items-center gap-1 bg-white rounded-lg border shadow-sm">
                          <button
                            onClick={() => moveLesson(idx, -1)}
                            disabled={idx === 0 || reordering}
                            className="p-2 text-gray-500 hover:text-blue-600 disabled:opacity-30 transition"
                            title="Move Up"
                          >
                            <FaArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => moveLesson(idx, 1)}
                            disabled={idx === lessons.length - 1 || reordering}
                            className="p-2 text-gray-500 hover:text-blue-600 disabled:opacity-30 transition"
                            title="Move Down"
                          >
                            <FaArrowDown size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-1 bg-white rounded-lg border shadow-sm">
                          <button
                            onClick={() => openEditModal(lesson)}
                            className="p-2 text-gray-500 hover:text-amber-600 transition"
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(lesson._id)}
                            className="p-2 text-gray-500 hover:text-red-600 transition"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Modal (Create/Edit) – same functionality, modern styling */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingLesson ? "✏️ Edit Lesson" : "➕ New Lesson"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Lesson Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g., Introduction to HTML"
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
                    className="w-full border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-400"
                    placeholder="What will students learn?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Video URL or Upload</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="flex-1 border-gray-300 rounded-xl px-4 py-2.5"
                    />
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl text-center text-sm font-medium transition flex items-center justify-center gap-2">
                      {uploadingVideo ? "Uploading..." : <><FaVideo /> Upload</>}
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
                  <p className="text-xs text-gray-500 mt-1">Paste a video URL (YouTube, Vimeo) or upload a local file (max 100MB).</p>
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
                    className="w-full border-gray-300 rounded-xl px-4 py-2.5"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPreview"
                      checked={formData.isPreview}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">✅ Allow preview (free access for non-enrolled users)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isMandatory"
                      checked={formData.isMandatory}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">📌 Mandatory lesson (required for course completion)</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Minimum watch percentage for completion (%)</label>
                  <input
                    type="number"
                    name="minWatchPercentage"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.minWatchPercentage}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-xl px-4 py-2.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Student must watch at least this percentage to mark the lesson as completed.</p>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2 border rounded-xl hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploadingVideo}
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
                  >
                    {submitting ? "Saving..." : editingLesson ? "Update Lesson" : "Create Lesson"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}