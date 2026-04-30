"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaEye,
  FaEdit,
  FaBan,
  FaPlus,
  FaCalendarAlt,
  FaVideo,
  FaGoogle,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  getSessions,
  createSession,
  updateSession,
  cancelSession,
  getCourses,
  // New service function to fetch batches assigned to the current instructor
  assignInstructorToBatch,
} from "../../../../service/login.service";
import { useAuthStore } from "../../../../store/login.store"; // adjust path

// Helper: relative date & time
const formatRelativeTime = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const today = new Date();
  const diffDays = Math.floor((date - today) / (1000 * 60 * 60 * 24));
  const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 0) return `Today at ${timeStr}`;
  if (diffDays === 1) return `Tomorrow at ${timeStr}`;
  if (diffDays === -1) return `Yesterday at ${timeStr}`;
  return date.toLocaleString();
};

// Platform icon component
const PlatformIcon = ({ platform }) => {
  if (platform?.toLowerCase() === "zoom") return <FaVideo className="text-blue-600" />;
  return <FaGoogle className="text-green-600" />;
};

export default function LiveSessionsPage() {
  const router = useRouter();
  // Get current logged-in user (instructor) from auth store
  const user = useAuthStore((state) => state.user);
  const instructorId = user?._id;

  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [viewingSession, setViewingSession] = useState(null);
  // Only batches assigned to this instructor
  const [assignedBatches, setAssignedBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    batch: "",
    course: "",
    date: "",
    duration: "",
    meetLink: "",
    platform: "meet",
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

  // Fetch data: sessions, assigned batches, courses
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sessionsRes, batchesRes, coursesRes] = await Promise.all([
        getSessions(),
        assignInstructorToBatch(), // Only batches where instructor is assigned
        getCourses(),
      ]);
      setSessions(sessionsRes.data || []);
      setAssignedBatches(batchesRes.data || []);
      setCourses(coursesRes.data || []);
      setFilteredSessions(sessionsRes.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Fetch error:", err);
      const status = err.response?.status;
      if (status === 403 || status === 401) {
        setError("You don't have permission to view live sessions.");
      } else if (status === 404) {
        setError("Live sessions page not found. Please contact support.");
      } else {
        setError("Failed to load data. Please try again later.");
      }
      toast.error("Could not load live sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If no instructor ID (shouldn't happen), redirect or show error
    if (!instructorId) {
      setError("Instructor information not found. Please login again.");
      setLoading(false);
      return;
    }
    fetchData();
  }, [instructorId]);

  // Filter sessions
  useEffect(() => {
    let filtered = [...sessions];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title?.toLowerCase().includes(term) ||
          s.description?.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }
    setFilteredSessions(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sessions]);

  // Pagination values
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSessions = filteredSessions.slice(startIndex, startIndex + itemsPerPage);

  // Modal handlers
  const openAddModal = () => {
    // Check if instructor has any assigned batches
    if (assignedBatches.length === 0) {
      toast.error("You are not assigned to any batch. Please contact admin.");
      return;
    }
    setIsAddMode(true);
    setEditingSession(null);
    setFormData({
      title: "",
      description: "",
      batch: assignedBatches[0]?._id || "", // pre-select first assigned batch
      course: "",
      date: "",
      duration: "",
      meetLink: "",
      platform: "meet",
    });
    setModalOpen(true);
  };

  const openEditModal = (session) => {
    // Ensure the session's batch is still assigned to instructor
    const isBatchAssigned = assignedBatches.some(b => b._id === session.batch?._id || b._id === session.batch);
    if (!isBatchAssigned) {
      toast.error("You no longer have permission to edit this session (batch not assigned).");
      return;
    }
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
      platform: session.platform || "meet",
    });
    setModalOpen(true);
  };

  const openViewModal = (session) => setViewingSession(session);
  const closeViewModal = () => setViewingSession(null);
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
      platform: "meet",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.batch) return toast.error("Select a batch");
    if (!formData.course) return toast.error("Select a course");
    if (!formData.date) return toast.error("Date & time required");

    // Double-check batch assignment before submitting
    const isBatchAssigned = assignedBatches.some(b => b._id === formData.batch);
    if (!isBatchAssigned) {
      toast.error("You are not assigned to this batch. Cannot create/edit session.");
      closeModal();
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
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
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
        } catch (err) {
          toast.error(err?.response?.data?.message || "Cancel failed");
        } finally {
          setConfirmDialog({ open: false, onConfirm: null });
        }
      },
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, onConfirm: null });
  };

  // Error UI
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-red-800">Access Issue</h2>
          <p className="text-red-600 mt-2">{error}</p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              ← Dashboard
            </button>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaVideo className="text-blue-500" /> Live Sessions
        </h1>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or description..."
              className="pl-9 pr-3 py-2 border rounded-lg w-64 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="all">All status</option>
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <button
          onClick={openAddModal}
          disabled={assignedBatches.length === 0}
          className={`bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md ${
            assignedBatches.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
          title={assignedBatches.length === 0 ? "You are not assigned to any batch" : ""}
        >
          <FaPlus /> Schedule Session
        </button>
      </div>

      {/* Show warning if no assigned batches */}
      {assignedBatches.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
          <p className="text-yellow-700">
            You are not assigned to any batch yet. Please contact the admin to assign you to a batch before scheduling live sessions.
          </p>
        </div>
      )}

      {/* Sessions Table */}
      {paginatedSessions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FaVideo className="mx-auto text-gray-300 text-5xl mb-3" />
          <p className="text-gray-500">No live sessions found.</p>
          {assignedBatches.length > 0 && (
            <button
              onClick={openAddModal}
              className="mt-4 text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <FaPlus size={12} /> Create your first session
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Title / Platform</th>
                  <th className="px-4 py-3 text-left">Batch</th>
                  <th className="px-4 py-3 text-left">Course</th>
                  <th className="px-4 py-3 text-left">Date & Time</th>
                  <th className="px-4 py-3 text-center">Duration</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedSessions.map((session, idx) => (
                  <tr key={session._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-500">{startIndex + idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{session.title}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <PlatformIcon platform={session.platform} />
                        <span>{session.platform || "meet"}</span>
                        {session.meetLink && (
                          <a
                            href={session.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-500 hover:underline"
                          >
                            Join
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">{session.batch?.name || "—"}</td>
                    <td className="px-4 py-3">{session.course?.title || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-400 text-xs" />
                        <span>{formatRelativeTime(session.date)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{session.duration || "—"} min</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          session.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {session.status || "scheduled"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openViewModal(session)}
                        className="text-gray-500 hover:text-gray-700 transition"
                        title="View details"
                      >
                        <FaEye />
                      </button>
                      {session.status !== "cancelled" && (
                        <>
                          <button
                            onClick={() => openEditModal(session)}
                            className="text-blue-500 hover:text-blue-700 transition"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleCancel(session._id)}
                            className="text-orange-500 hover:text-orange-700 transition"
                            title="Cancel session"
                          >
                            <FaBan />
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
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded-lg transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-40"
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
                    {assignedBatches.map((batch) => (
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (min)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Platform</label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="meet">Google Meet</option>
                    <option value="zoom">Zoom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meeting Link</label>
                  <input
                    type="url"
                    name="meetLink"
                    value={formData.meetLink}
                    onChange={handleChange}
                    placeholder="https://..."
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <FaSpinner className="animate-spin" />}
                  {submitting ? "Saving..." : isAddMode ? "Schedule" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal (unchanged) */}
      {viewingSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              Session Details <PlatformIcon platform={viewingSession.platform} />
            </h2>
            <div className="space-y-3">
              <div><label className="text-sm font-medium text-gray-500">Title</label><p className="text-gray-800">{viewingSession.title || "—"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Description</label><p className="text-gray-800">{viewingSession.description || "—"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Batch</label><p className="text-gray-800">{viewingSession.batch?.name || "—"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Course</label><p className="text-gray-800">{viewingSession.course?.title || "—"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Date & Time</label><p className="text-gray-800">{formatRelativeTime(viewingSession.date)}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Duration</label><p className="text-gray-800">{viewingSession.duration ? `${viewingSession.duration} min` : "—"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Platform</label><p className="text-gray-800 capitalize">{viewingSession.platform || "meet"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Meeting Link</label><p>{viewingSession.meetLink ? <a href={viewingSession.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Join session</a> : "—"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Status</label><p><span className={`px-2 py-1 text-xs rounded-full ${viewingSession.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{viewingSession.status || "scheduled"}</span></p></div>
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