"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  getCourseById,
  addModule,
  reorderModules,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
} from "../../../../../service/courses.service";

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleContent, setNewModuleContent] = useState("");
  const [addingModule, setAddingModule] = useState(false);
  const [reorderingModules, setReorderingModules] = useState(false);

  // Lesson modal states
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: 0,
    isPreview: false,
  });
  const [submittingLesson, setSubmittingLesson] = useState(false);
  const [reorderingLessons, setReorderingLessons] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await getCourseById(id);
      const data = response.data || response;
      setCourse(data);
      setModules(data.modules || []);
    } catch (error) {
      toast.error("Failed to load course");
      router.push("/components/courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  // ---------- Module operations ----------
  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) {
      toast.error("Module title required");
      return;
    }
    setAddingModule(true);
    try {
      await addModule(id, { title: newModuleTitle, content: newModuleContent });
      toast.success("Module added");
      setNewModuleTitle("");
      setNewModuleContent("");
      await fetchCourse();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add module");
    } finally {
      setAddingModule(false);
    }
  };

  const handleReorderModules = async (newOrder) => {
    setReorderingModules(true);
    try {
      await reorderModules(id, newOrder);
      toast.success("Modules reordered");
      await fetchCourse();
    } catch (error) {
      toast.error("Reorder failed");
    } finally {
      setReorderingModules(false);
    }
  };

  const moveModule = (index, direction) => {
    const newModules = [...modules];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newModules.length) return;
    [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
    setModules(newModules);
    handleReorderModules(newModules.map((m) => m._id));
  };

  // ---------- Lesson operations ----------
  const openCreateLesson = (moduleId) => {
    setCurrentModuleId(moduleId);
    setEditingLesson(null);
    setLessonForm({
      title: "",
      description: "",
      videoUrl: "",
      duration: 0,
      isPreview: false,
    });
    setLessonModalOpen(true);
  };

  const openEditLesson = (moduleId, lesson) => {
    setCurrentModuleId(moduleId);
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title || "",
      description: lesson.description || "",
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration || 0,
      isPreview: lesson.isPreview || false,
    });
    setLessonModalOpen(true);
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) {
      toast.error("Lesson title required");
      return;
    }
    setSubmittingLesson(true);
    try {
      if (editingLesson) {
        await updateLesson(editingLesson._id, lessonForm);
        toast.success("Lesson updated");
      } else {
        await createLesson(id, currentModuleId, lessonForm);
        toast.success("Lesson added");
      }
      await fetchCourse();
      setLessonModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setSubmittingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm("Delete this lesson? This action cannot be undone.")) return;
    try {
      await deleteLesson(lessonId);
      toast.success("Lesson deleted");
      await fetchCourse();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleReorderLessons = async (moduleId, newOrder) => {
    setReorderingLessons(true);
    try {
      await reorderLessons(id, moduleId, newOrder);
      toast.success("Lessons reordered");
      await fetchCourse();
    } catch (error) {
      toast.error("Reorder failed");
    } finally {
      setReorderingLessons(false);
    }
  };

  const moveLesson = (moduleId, lessons, index, direction) => {
    const newLessons = [...lessons];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newLessons.length) return;
    [newLessons[index], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[index]];
    const updatedModules = modules.map((mod) =>
      mod._id === moduleId ? { ...mod, lessons: newLessons } : mod
    );
    setModules(updatedModules);
    handleReorderLessons(moduleId, newLessons.map((l) => l._id));
  };

  // ---------- Video upload handler ----------
  const handleVideoUpload = async (file) => {
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video size must be less than 100MB");
      return;
    }
    setUploadingVideo(true);
    const formData = new FormData();
    formData.append("video", file);
    try {
      // Replace with your actual upload endpoint
      const res = await fetch("http://localhost:8080/upload/video", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setLessonForm({ ...lessonForm, videoUrl: data.url });
        toast.success("Video uploaded");
      } else {
        throw new Error("No URL returned");
      }
    } catch (err) {
      toast.error("Upload failed, using temporary URL");
      const tempUrl = URL.createObjectURL(file);
      setLessonForm({ ...lessonForm, videoUrl: tempUrl });
    } finally {
      setUploadingVideo(false);
    }
  };

  if (loading) return <div className="p-6">Loading course...</div>;
  if (!course) return <div className="p-6">Course not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push("/components/courses")}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft />
          Back to Courses
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
        <p className="text-gray-600 mt-1">{course.description}</p>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
          {course.category && <span>📁 Category: {course.category}</span>}
          {course.program && <span>🎓 Program: {course.program}</span>}
          <span>{course.isPublished ? "✅ Published" : "📝 Draft"}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Modules</h2>

        {modules.length === 0 ? (
          <p className="text-gray-500">No modules yet. Add one below.</p>
        ) : (
          <ul className="space-y-6 mb-6">
            {modules.map((mod, idx) => (
              <li key={mod._id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{mod.title}</h3>
                    {mod.content && <p className="text-sm text-gray-500">{mod.content}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveModule(idx, -1)}
                      disabled={idx === 0 || reorderingModules}
                      className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      title="Move Module Up"
                    >
                      <FaArrowUp />
                    </button>
                    <button
                      onClick={() => moveModule(idx, 1)}
                      disabled={idx === modules.length - 1 || reorderingModules}
                      className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                      title="Move Module Down"
                    >
                      <FaArrowDown />
                    </button>
                  </div>
                </div>

                {/* Lessons list */}
                <div className="mt-4 ml-4 border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-700">Lessons</h4>
                    <button
                      onClick={() => openCreateLesson(mod._id)}
                      className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      <FaPlus className="text-xs" /> Add Lesson
                    </button>
                  </div>

                  {mod.lessons && mod.lessons.length === 0 ? (
                    <p className="text-gray-400 text-sm">No lessons yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {(mod.lessons || []).map((lesson, lIdx) => (
                        <li
                          key={lesson._id}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {lesson.isPreview && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                                  Preview
                                </span>
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
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => moveLesson(mod._id, mod.lessons, lIdx, -1)}
                              disabled={lIdx === 0 || reorderingLessons}
                              className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                              title="Move Lesson Up"
                            >
                              <FaArrowUp />
                            </button>
                            <button
                              onClick={() => moveLesson(mod._id, mod.lessons, lIdx, 1)}
                              disabled={lIdx === mod.lessons.length - 1 || reorderingLessons}
                              className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                              title="Move Lesson Down"
                            >
                              <FaArrowDown />
                            </button>
                            <button
                              onClick={() => openEditLesson(mod._id, lesson)}
                              className="text-blue-500 hover:text-blue-700"
                              title="Edit Lesson"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson._id)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete Lesson"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Add new module form */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <FaPlus className="text-green-600" /> Add New Module
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Module title"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            <textarea
              placeholder="Module content (optional)"
              rows="2"
              value={newModuleContent}
              onChange={(e) => setNewModuleContent(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            <button
              onClick={handleAddModule}
              disabled={addingModule}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {addingModule ? "Adding..." : "Add Module"}
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Modal (Create/Edit) – with video upload option */}
      {lessonModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingLesson ? "Edit Lesson" : "Add Lesson"}
            </h2>
            <form onSubmit={handleLessonSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows="3"
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Video URL with upload button */}
              <div>
                <label className="block text-sm font-medium mb-1">Video</label>
                <div className="flex gap-2 flex-wrap items-center">
                  <input
                    type="url"
                    value={lessonForm.videoUrl}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, videoUrl: e.target.value })
                    }
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
                  Paste a video URL or upload a video file (max 100MB). The uploaded video will be hosted on our server.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={lessonForm.duration}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) || 0 })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPreview"
                  checked={lessonForm.isPreview}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, isPreview: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="isPreview" className="text-sm font-medium">
                  Allow preview (free) for non-enrolled users
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setLessonModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLesson || uploadingVideo}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submittingLesson ? "Saving..." : editingLesson ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}