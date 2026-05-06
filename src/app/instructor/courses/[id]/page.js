"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
// import { getCourseById,  addModule,createLesson,updateLesson,deleteLesson, } from "../../../../../service/login.service";
import { getCourseById ,addModule , createLesson , updateLesson ,  deleteLesson } from "../../../../../service/login.service";
import { FaArrowLeft, FaPlus, FaTrash, FaVideo } from "react-icons/fa";

export default function InstructorCourseDetailPage() {
  const { id } = useParams(); // ✅ course ID from URL
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleContent, setNewModuleContent] = useState("");
  const [addingModule, setAddingModule] = useState(false);

  // Lesson modal state
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: 0,
    isPreview: false,
  });
  const [submittingLesson, setSubmittingLesson] = useState(false);
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
      router.push("/instructor/courses");
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

  // ---------- Lesson operations ----------
  const openCreateLesson = (moduleId) => {
    setCurrentModuleId(moduleId);
    setLessonForm({
      title: "",
      description: "",
      videoUrl: "",
      duration: 0,
      isPreview: false,
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
      await createLesson(id, currentModuleId, lessonForm);
      toast.success("Lesson added");
      await fetchCourse();
      setLessonModalOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setSubmittingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await deleteLesson(lessonId);
      toast.success("Lesson deleted");
      await fetchCourse();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Video upload (simplified)
  const handleVideoUpload = async (file) => {
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video size must be less than 100MB");
      return;
    }
    setUploadingVideo(true);
    const fd = new FormData();
    fd.append("video", file);
    try {
      // Replace with your actual upload endpoint
      const res = await fetch("http://localhost:8080/upload/video", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setLessonForm({ ...lessonForm, videoUrl: data.url });
        toast.success("Video uploaded");
      } else {
        throw new Error("No URL");
      }
    } catch {
      toast.error("Upload failed, using temporary URL");
      setLessonForm({ ...lessonForm, videoUrl: URL.createObjectURL(file) });
    } finally {
      setUploadingVideo(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading course...</div>;
  if (!course) return <div className="p-6 text-center">Course not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.push("/instructor/courses")}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
      >
        <FaArrowLeft /> Back to Courses
      </button>

      <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
      <p className="text-gray-600 mt-1">{course.description}</p>
      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
        {course.category && <span>📁 Category: {course.category}</span>}
        {course.program && <span>🎓 Program: {course.program}</span>}
        <span>{course.isPublished ? "✅ Published" : "📝 Draft"}</span>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Modules</h2>

        {modules.length === 0 ? (
          <p className="text-gray-500">No modules yet. Add one below.</p>
        ) : (
          <ul className="space-y-6 mb-6">
            {modules.map((mod) => (
              <li key={mod._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{mod.title}</h3>
                    {mod.content && <p className="text-sm text-gray-500">{mod.content}</p>}
                  </div>
                  <button
                    onClick={() => openCreateLesson(mod._id)}
                    className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    <FaPlus className="text-xs" /> Add Lesson
                  </button>
                </div>

                {mod.lessons && mod.lessons.length > 0 && (
                  <div className="mt-4 ml-4 border-l-2 border-gray-200 pl-4">
                    <h4 className="font-medium text-gray-700 mb-2">Lessons</h4>
                    <ul className="space-y-2">
                      {mod.lessons.map((lesson) => (
                        <li key={lesson._id} className="bg-gray-50 p-2 rounded flex justify-between items-center">
                          <div>
                            <span className="font-medium">{lesson.title}</span>
                            {lesson.duration > 0 && (
                              <span className="text-xs text-gray-500 ml-2">({lesson.duration} min)</span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteLesson(lesson._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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

      {/* Lesson Modal */}
      {lessonModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Lesson</h2>
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
              <div>
                <label className="block text-sm font-medium mb-1">Video</label>
                <div className="flex gap-2 flex-wrap items-center">
                  <input
                    type="url"
                    value={lessonForm.videoUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
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
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  min="0"
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) || 0 })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={lessonForm.isPreview}
                  onChange={(e) => setLessonForm({ ...lessonForm, isPreview: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Allow preview (free) for non-enrolled users</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setLessonModalOpen(false)} className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={submittingLesson || uploadingVideo} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  {submittingLesson ? "Saving..." : "Add Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}