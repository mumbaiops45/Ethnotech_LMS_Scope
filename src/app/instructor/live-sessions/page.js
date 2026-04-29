"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaCalendarAlt,
  FaVideo,
} from "react-icons/fa";
import {
  getSessions,
  createSession,
  updateSession,
  cancelSession,
  getBatches,
  getCourses,
} from "../../../../service/login.service";

export default function LiveSessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [viewingSession, setViewingSession] = useState(null);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    batch: "",
    course: "",
    date: "",
    duration: "",
    meetLink: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch sessions, batches, and courses
  const fetchData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, batchesRes, coursesRes] = await Promise.all([
        getSessions(),
        getBatches(),
        getCourses(),
      ]);
      setSessions(sessionsRes.data || []);
      setFilteredSessions(sessionsRes.data || []);
      setBatches(batchesRes.data || []);
      setCourses(coursesRes.data || []);
      setCurrentPage(1);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = sessions.filter(
      (session) =>
        session.title?.toLowerCase().includes(term) ||
        session.description?.toLowerCase().includes(term)
    );
    setFilteredSessions(filtered);
    setCurrentPage(1);
  }, [searchTerm, sessions]);

  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSessions = filteredSessions.slice(startIndex, startIndex + itemsPerPage);

  const openAddModal = () => {
    setIsAddMode(true);
    setEditingSession(null);
    setFormData({
      title: "",
      description: "",
      batch: "",
      course: "",
      date: "",
      duration: "",
      meetLink: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (session) => {
    setIsAddMode(false);
    setEditingSession(session);
    setFormData({
      title: session.title || "",
      description: session.description || "",
      batch: session.batch?._id || session.batch || "",
      course: session.course?._id || session.course || "",
      date: session.date ? new Date(session.date).toISOString().slice(0, 16) : "",
      duration: session.duration || "",
      meetLink: session.meetLink || "",
    });
    setModalOpen(true);
  };

  const openViewModal = (session) => {
    setViewingSession(session);
  };

  const closeViewModal = () => {
    setViewingSession(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setIsAddMode(false);
    setEditingSession(null);
    setFormData({
      title: "",
      description: "",
      batch: "",
      course: "",
      date: "",
      duration: "",
      meetLink: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.batch || !formData.course) {
      toast.error("Please select both batch and course");
      return;
    }
    if (!formData.date) {
      toast.error("Date and time are required");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        duration: parseInt(formData.duration) || 0,
      };
      if (editingSession) {
        await updateSession(editingSession._id, payload);
        toast.success("Session updated");
      } else {
        await createSession(payload);
        toast.success("Session created");
      }
      await fetchData();
      closeModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (id) => {
    setConfirmDialog({
      open: true,
      title: "Cancel Session",
      message: "Are you sure you want to cancel this live session?",
      onConfirm: async () => {
        try {
          await cancelSession(id);
          toast.success("Session cancelled");
          await fetchData();
        } catch (error) {
          toast.error(error?.response?.data?.message || "Cancel failed");
        } finally {
          setConfirmDialog({ open: false, onConfirm: null });
        }
      },
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, onConfirm: null });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Live Sessions</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search sessions..."
              className="pl-9 border rounded-lg px-4 py-2 text-sm w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus /> Schedule Session
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading sessions...</div>
      ) : paginatedSessions.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No live sessions found</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Batch</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Duration (min)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedSessions.map((session, idx) => (
                  <tr key={session._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{startIndex + idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{session.title}</td>
                    <td className="px-4 py-3">{session.batch?.name || "—"}</td>
                    <td className="px-4 py-3">{session.course?.title || "—"}</td>
                    <td className="px-4 py-3">{formatDateTime(session.date)}</td>
                    <td className="px-4 py-3">{session.duration || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        session.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}>
                        {session.status || "scheduled"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => openViewModal(session)}
                        className="text-gray-600 hover:text-gray-800"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {session.status !== "cancelled" && (
                        <>
                          <button
                            onClick={() => openEditModal(session)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleCancel(session._id)}
                            className="text-orange-600 hover:text-orange-800"
                            title="Cancel"
                          >
                            <FaTrash /> {/* or use a cancel icon */}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded-lg transition ${
                    currentPage === page ? "bg-blue-600 text-white" : "hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isAddMode ? "Schedule New Session" : "Edit Session"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Batch *</label>
                  <select
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Batch</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course *</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date & Time *</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meeting Link</label>
                  <input
                    type="url"
                    name="meetLink"
                    value={formData.meetLink}
                    onChange={handleChange}
                    placeholder="https://meet.google.com/..."
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : isAddMode ? "Schedule" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Session Details</h2>
            <div className="space-y-3">
              <div><label className="text-sm font-medium text-gray-500">Title</label><p className="text-gray-800">{viewingSession.title || "—"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Description</label><p className="text-gray-800">{viewingSession.description || "—"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Batch</label><p className="text-gray-800">{viewingSession.batch?.name || "—"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Course</label><p className="text-gray-800">{viewingSession.course?.title || "—"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Date & Time</label><p className="text-gray-800">{formatDateTime(viewingSession.date)}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Duration</label><p className="text-gray-800">{viewingSession.duration ? `${viewingSession.duration} min` : "—"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Meeting Link</label><p className="text-gray-800">{viewingSession.meetLink ? <a href={viewingSession.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Join</a> : "—"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Status</label><p className="text-gray-800"><span className={`px-2 py-1 text-xs rounded-full ${viewingSession.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{viewingSession.status || "scheduled"}</span></p></div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={closeViewModal} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{confirmDialog.title}</h3>
            <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3">
              <button onClick={closeConfirmDialog} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDialog.onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}