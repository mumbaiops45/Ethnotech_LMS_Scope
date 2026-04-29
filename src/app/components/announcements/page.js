"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaEye,
  FaPlus,
  FaSearch,
  FaEnvelope,
  FaSms,
  FaBell,
} from "react-icons/fa";
import {
  getAnnouncements,
  createAnnouncement,
  getBatches,
  getCourses,
} from "../../../../service/login.service";

export default function AnnouncementsPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewingAnnouncement, setViewingAnnouncement] = useState(null);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetType: "all",
    course: "",
    batch: "",
    channels: {
      inApp: true,
      email: false,
      sms: false,
    },
  });
  const [submitting, setSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [announcementsRes, batchesRes, coursesRes] = await Promise.all([
        getAnnouncements(),
        getBatches(),
        getCourses(),
      ]);
      setAnnouncements(announcementsRes.data || []);
      setFilteredAnnouncements(announcementsRes.data || []);
      setBatches(batchesRes.data || []);
      setCourses(coursesRes.data || []);
      setCurrentPage(1);
    } catch (error) {
      toast.error("Failed to load announcements");
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
    const filtered = announcements.filter(
      (ann) =>
        ann.title?.toLowerCase().includes(term) ||
        ann.message?.toLowerCase().includes(term)
    );
    setFilteredAnnouncements(filtered);
    setCurrentPage(1);
  }, [searchTerm, announcements]);

  // Pagination
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, startIndex + itemsPerPage);

  const openCreateModal = () => {
    setFormData({
      title: "",
      message: "",
      targetType: "all",
      course: "",
      batch: "",
      channels: {
        inApp: true,
        email: false,
        sms: false,
      },
    });
    setModalOpen(true);
  };

  const openViewModal = (announcement) => {
    setViewingAnnouncement(announcement);
  };

  const closeViewModal = () => {
    setViewingAnnouncement(null);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "targetType") {
      setFormData((prev) => ({
        ...prev,
        targetType: value,
        course: "",
        batch: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChannelChange = (channel) => {
    setFormData((prev) => ({
      ...prev,
      channels: { ...prev.channels, [channel]: !prev.channels[channel] },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Title and message are required");
      return;
    }
    if (formData.targetType === "course" && !formData.course) {
      toast.error("Please select a course");
      return;
    }
    if (formData.targetType === "batch" && !formData.batch) {
      toast.error("Please select a batch");
      return;
    }
    setSubmitting(true);
    try {
      await createAnnouncement(formData);
      toast.success("Announcement sent successfully");
      await fetchData();
      closeModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create announcement");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
  };

  const getChannelIcons = (channels) => {
    const icons = [];
    if (channels?.inApp) icons.push(<FaBell key="inApp" className="inline mr-1 text-blue-500" title="In-App" />);
    if (channels?.email) icons.push(<FaEnvelope key="email" className="inline mr-1 text-green-500" title="Email" />);
    if (channels?.sms) icons.push(<FaSms key="sms" className="inline text-purple-500" title="SMS" />);
    return icons.length ? icons : "—";
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
        <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              className="pl-9 border rounded-lg px-4 py-2 text-sm w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus /> New Announcement
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading announcements...</div>
      ) : paginatedAnnouncements.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No announcements found</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Channels</th>
                  <th className="px-4 py-3">Sent At</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedAnnouncements.map((ann, idx) => (
                  <tr key={ann._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{startIndex + idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{ann.title}</td>
                    <td className="px-4 py-3 truncate max-w-xs">{ann.message}</td>
                    <td className="px-4 py-3 capitalize">
                      {ann.targetType === "all" ? "All Users" : `${ann.targetType}: ${ann[ann.targetType]?.name || "—"}`}
                    </td>
                    <td className="px-4 py-3">{getChannelIcons(ann.channels)}</td>
                    <td className="px-4 py-3">{formatDate(ann.createdAt)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openViewModal(ann)}
                        className="text-gray-600 hover:text-gray-800"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
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

      {/* Create Announcement Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Send New Announcement</h2>
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
                <label className="block text-sm font-medium mb-1">Message *</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Audience</label>
                <select
                  name="targetType"
                  value={formData.targetType}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="all">All Users</option>
                  <option value="batch">Specific Batch</option>
                  <option value="course">Specific Course</option>
                </select>
              </div>
              {formData.targetType === "batch" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Select Batch</label>
                  <select
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">-- Choose Batch --</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {formData.targetType === "course" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Select Course</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">-- Choose Course --</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Channels</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.channels.inApp}
                      onChange={() => handleChannelChange("inApp")}
                      className="w-4 h-4"
                    />
                    <FaBell className="text-blue-500" /> In-App
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.channels.email}
                      onChange={() => handleChannelChange("email")}
                      className="w-4 h-4"
                    />
                    <FaEnvelope className="text-green-500" /> Email
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.channels.sms}
                      onChange={() => handleChannelChange("sms")}
                      className="w-4 h-4"
                    />
                    <FaSms className="text-purple-500" /> SMS
                  </label>
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
                  {submitting ? "Sending..." : "Send Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Announcement Details</h2>
            <div className="space-y-3">
              <div><label className="text-sm font-medium text-gray-500">Title</label><p className="text-gray-800">{viewingAnnouncement.title || "—"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Message</label><p className="text-gray-800 whitespace-pre-wrap">{viewingAnnouncement.message || "—"}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Target</label><p className="text-gray-800 capitalize">{viewingAnnouncement.targetType === "all" ? "All Users" : `${viewingAnnouncement.targetType}: ${viewingAnnouncement[viewingAnnouncement.targetType]?.name || "—"}`}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Channels</label><p className="text-gray-800">{getChannelIcons(viewingAnnouncement.channels)}</p></div>
              <div><label className="text-sm font-medium text-gray-500">Sent At</label><p className="text-gray-800">{formatDate(viewingAnnouncement.createdAt)}</p></div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={closeViewModal} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}