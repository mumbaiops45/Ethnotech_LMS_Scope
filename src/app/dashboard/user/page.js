"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  deactivateAdmin,
} from "../../../../service/login.service";

export default function UsersPage() {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    role: "BranchAdmin",
    branch: "",
    gender: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Confirmation modal state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // ---------- Fetch all admins ----------
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await getAdmins();
      const list = response.data || [];
      setAdmins(list);
      setFilteredAdmins(list);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ---------- Search filter ----------
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = admins.filter(
      (admin) =>
        admin.fullName?.toLowerCase().includes(term) ||
        admin.email?.toLowerCase().includes(term) ||
        admin.mobile?.includes(term)
    );
    setFilteredAdmins(filtered);
  }, [searchTerm, admins]);

  // ---------- Open add modal ----------
  const openAddModal = () => {
    setIsAddMode(true);
    setEditingAdmin(null);
    setFormData({
      fullName: "",
      email: "",
      mobile: "",
      password: "",
      role: "BranchAdmin",
      branch: "",
      gender: "",
    });
    setModalOpen(true);
  };

  // ---------- Open edit modal ----------
  const openEditModal = (admin) => {
    setIsAddMode(false);
    setEditingAdmin(admin);
    setFormData({
      fullName: admin.fullName || "",
      email: admin.email || "",
      mobile: admin.mobile || "",
      password: "",
      role: admin.role || "BranchAdmin",
      branch: admin.branch || "",
      gender: admin.gender || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setIsAddMode(false);
    setEditingAdmin(null);
    setFormData({
      fullName: "",
      email: "",
      mobile: "",
      password: "",
      role: "BranchAdmin",
      branch: "",
      gender: "",
    });
  };

  // ---------- Input changes ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- Create new admin ----------
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      toast.error("Full name, email, and password are required");
      return;
    }
    setSubmitting(true);
    try {
      await createAdmin({
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        role: formData.role,
        branch: formData.branch,
        gender: formData.gender,
      });
      toast.success("Admin created successfully");
      fetchAdmins();
      closeModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Update admin ----------
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Full name and email are required");
      return;
    }
    setSubmitting(true);
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      role: formData.role,
      branch: formData.branch,
      gender: formData.gender,
    };
    console.log("Updating admin with payload:", payload);
    try {
      await updateAdmin(editingAdmin._id, payload);
      toast.success("Admin updated successfully");
      fetchAdmins();
      closeModal();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Delete admin (with custom confirmation) ----------
  const handleDelete = (id) => {
    setConfirmDialog({
      open: true,
      title: "Delete Admin",
      message: "Are you sure you want to permanently delete this admin? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await deleteAdmin(id);
          toast.success("Admin deleted");
          fetchAdmins();
        } catch (error) {
          toast.error(error?.response?.data?.message || "Delete failed");
        } finally {
          setConfirmDialog({ open: false, onConfirm: null });
        }
      },
    });
  };

  // ---------- Deactivate / Activate (with custom confirmation) ----------
  const handleDeactivate = (id, currentStatus) => {
    const action = currentStatus ? "deactivate" : "activate";
    setConfirmDialog({
      open: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Admin`,
      message: `Are you sure you want to ${action} this admin?`,
      onConfirm: async () => {
        try {
          await deactivateAdmin(id);
          toast.success(`Admin ${action}d successfully`);
          fetchAdmins();
        } catch (error) {
          toast.error(error?.response?.data?.message || "Action failed");
        } finally {
          setConfirmDialog({ open: false, onConfirm: null });
        }
      },
    });
  };

  // Close confirmation dialog without action
  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, onConfirm: null });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Management</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name, email or mobile..."
            className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            + Add Admin
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading admins...</div>
      ) : filteredAdmins.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No admins found</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAdmins.map((admin, idx) => (
                <tr key={admin._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium">{admin.fullName}</td>
                  <td className="px-4 py-3">{admin.email}</td>
                  <td className="px-4 py-3">{admin.mobile || "—"}</td>
                  <td className="px-4 py-3 capitalize">{admin.role}</td>
                  <td className="px-4 py-3">{admin.branch || "—"}</td>
                  <td className="px-4 py-3">{admin.gender || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${admin.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button onClick={() => openEditModal(admin)} className="text-blue-600 hover:text-blue-800" title="Edit">✏️</button>
                    <button onClick={() => handleDeactivate(admin._id, admin.isActive)} className={admin.isActive ? "text-orange-600" : "text-green-600"} title={admin.isActive ? "Deactivate" : "Activate"}>
                      {admin.isActive ? "🔴" : "🟢"}
                    </button>
                    <button onClick={() => handleDelete(admin._id)} className="text-red-600 hover:text-red-800" title="Delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{isAddMode ? "Add New Admin" : "Edit Admin"}</h2>
            <form onSubmit={isAddMode ? handleCreate : handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                {isAddMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                    <option value="SuperAdmin">Super Admin</option>
                    <option value="BranchAdmin">Branch Admin</option>
                    <option value="Instructor">Instructor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {submitting ? "Saving..." : isAddMode ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Dialog */}
      {confirmDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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