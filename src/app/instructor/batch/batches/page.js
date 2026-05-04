"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaUserPlus,
} from "react-icons/fa";
import {
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  assignInstructorToBatch,
} from "../../../../../service/login.service";
import { getAdmins } from "../../../../../service/login.service";

export default function BatchesPage() {
  const router = useRouter();
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [viewingBatch, setViewingBatch] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    program: "",
    branch: "",
    startDate: "",
    endDate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Assign instructor modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [currentBatchId, setCurrentBatchId] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [assigning, setAssigning] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await getBatches();
      const list = response.data || [];
      setBatches(list);
      setFilteredBatches(list);
      setCurrentPage(1);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const res = await getAdmins();
      const allAdmins = res.data || [];
      const instructorList = allAdmins.filter((admin) => admin.role === "Instructor");
      setInstructors(instructorList);
    } catch (error) {
      toast.error("Failed to load instructors");
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // Search filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = batches.filter(
      (batch) =>
        batch.name?.toLowerCase().includes(term) ||
        batch.program?.toLowerCase().includes(term) ||
        batch.branch?.toLowerCase().includes(term)
    );
    setFilteredBatches(filtered);
    setCurrentPage(1);
  }, [searchTerm, batches]);

  // Pagination
  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBatches = filteredBatches.slice(startIndex, startIndex + itemsPerPage);

  const openAddModal = () => {
    setIsAddMode(true);
    setEditingBatch(null);
    setFormData({
      name: "",
      program: "",
      branch: "",
      startDate: "",
      endDate: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (batch) => {
    setIsAddMode(false);
    setEditingBatch(batch);
    setFormData({
      name: batch.name || "",
      program: batch.program || "",
      branch: batch.branch || "",
      startDate: batch.startDate ? batch.startDate.split("T")[0] : "",
      endDate: batch.endDate ? batch.endDate.split("T")[0] : "",
    });
    setModalOpen(true);
  };

  const openViewModal = (batch) => {
    setViewingBatch(batch);
  };

  const closeViewModal = () => {
    setViewingBatch(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setIsAddMode(false);
    setEditingBatch(null);
    setFormData({
      name: "",
      program: "",
      branch: "",
      startDate: "",
      endDate: "",
    });
  };

  const openAssignModal = async (batchId) => {
    setCurrentBatchId(batchId);
    setSelectedInstructorId("");
    await fetchInstructors();
    setAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setAssignModalOpen(false);
    setCurrentBatchId(null);
    setSelectedInstructorId("");
  };

  const handleAssignSubmit = async () => {
    if (!selectedInstructorId) {
      toast.error("Please select an instructor");
      return;
    }
    setAssigning(true);
    try {
      await assignInstructorToBatch(currentBatchId, selectedInstructorId);
      toast.success("Instructor assigned successfully");
      closeAssignModal();
      fetchBatches();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Assignment failed");
    } finally {
      setAssigning(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Batch name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (editingBatch) {
        await updateBatch(editingBatch._id, formData);
        toast.success("Batch updated");
      } else {
        await createBatch(formData);
        toast.success("Batch created");
      }
      await fetchBatches();
      closeModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      open: true,
      title: "Delete Batch",
      message: "Are you sure you want to permanently delete this batch?",
      onConfirm: async () => {
        try {
          await deleteBatch(id);
          toast.success("Batch deleted");
          fetchBatches();
        } catch (error) {
          toast.error(error?.response?.data?.message || "Delete failed");
        } finally {
          setConfirmDialog({ open: false, onConfirm: null });
        }
      },
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, onConfirm: null });
  };

  return (
    <div className="p-6">
      {/* Back Button */}
     

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Batch Management</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, program or branch..."
              className="pl-9 border rounded-lg px-4 py-2 text-sm w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus /> Add Batch
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading batches...</div>
      ) : paginatedBatches.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No batches found</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Program</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Instructor</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">End Date</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedBatches.map((batch, idx) => (
                  <tr key={batch._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{startIndex + idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{batch.name}</td>
                    <td className="px-4 py-3">{batch.program || "—"}</td>
                    <td className="px-4 py-3">{batch.branch || "—"}</td>
                    <td className="px-4 py-3">
                      {batch.instructor ? batch.instructor.fullName : "—"}
                    </td>
                    <td className="px-4 py-3">{batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3">{batch.endDate ? new Date(batch.endDate).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => openViewModal(batch)}
                        className="text-gray-600 hover:text-gray-800"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => openEditModal(batch)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => openAssignModal(batch._id)}
                        className="text-green-600 hover:text-green-800"
                        title="Assign Instructor"
                      >
                        <FaUserPlus />
                      </button>
                      <button
                        onClick={() => handleDelete(batch._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
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

      {/* Add/Edit Modal – unchanged */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {isAddMode ? "Add New Batch" : "Edit Batch"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Program</label>
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
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
                  {submitting ? "Saving..." : isAddMode ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal with Instructor field */}
      {viewingBatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Batch Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-800">{viewingBatch.name || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Program</label>
                <p className="text-gray-800">{viewingBatch.program || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Branch</label>
                <p className="text-gray-800">{viewingBatch.branch || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Instructor</label>
                <p className="text-gray-800">
                  {viewingBatch.instructor ? viewingBatch.instructor.fullName : "—"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p className="text-gray-800">
                  {viewingBatch.startDate ? new Date(viewingBatch.startDate).toLocaleDateString() : "—"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">End Date</label>
                <p className="text-gray-800">
                  {viewingBatch.endDate ? new Date(viewingBatch.endDate).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Instructor Modal (unchanged) */}
      {assignModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Assign Instructor</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Instructor</label>
                <select
                  value={selectedInstructorId}
                  onChange={(e) => setSelectedInstructorId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">-- Select an instructor --</option>
                  {instructors.map((inst) => (
                    <option key={inst._id} value={inst._id}>
                      {inst.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeAssignModal}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignSubmit}
                  disabled={assigning}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {assigning ? "Assigning..." : "Assign"}
                </button>
              </div>
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
              <button
                onClick={closeConfirmDialog}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}