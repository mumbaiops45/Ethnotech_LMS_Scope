"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


import { getCertificateTemplates,createCertificateTemplate, updateCertificateTemplate,
  deleteCertificateTemplate } from "../../../../service/certificate-templates.service";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiImage,
  FiAward,
  FiHome,
  FiUser,
  FiBookOpen 
} from "react-icons/fi";

export default function CertificateTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    institutionName: "",
    logoUrl: "",
    signatoryName: "",
    signatureImageUrl: "",
    program: "",
    isDefault: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await getCertificateTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      institutionName: "",
      logoUrl: "",
      signatoryName: "",
      signatureImageUrl: "",
      program: "",
      isDefault: false,
    });
    setEditingTemplate(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name || "",
      institutionName: template.institutionName || "",
      logoUrl: template.logoUrl || "",
      signatoryName: template.signatoryName || "",
      signatureImageUrl: template.signatureImageUrl || "",
      program: template.program || "",
      isDefault: template.isDefault || false,
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.institutionName.trim()) {
      toast.error("Template name and institution name are required");
      return;
    }
    setSubmitting(true);
    try {
      if (editingTemplate) {
        await updateCertificateTemplate(editingTemplate._id, formData);
        toast.success("Template updated");
      } else {
        await createCertificateTemplate(formData);
        toast.success("Template created");
      }
      fetchTemplates();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      open: true,
      title: "Delete Template",
      message: "Are you sure you want to delete this template? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await deleteCertificateTemplate(id);
          toast.success("Template deleted");
          fetchTemplates();
        } catch {
          toast.error("Delete failed");
        }
        setConfirmDialog({ open: false });
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Certificate Templates
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Design and manage professional certificates
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <FiPlus />
            New Template
          </button>
        </div>
        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAward className="text-[var(--primary)]" size={40} />
            </div>

            <h3 className="text-xl font-semibold text-gray-700">
              No templates yet
            </h3>

            <p className="text-gray-500 mt-2">
              Create your first certificate template to get started.
            </p>

            <button
              onClick={openCreateModal}
              className="mt-6 px-5 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary)]/90 transition-all inline-flex items-center gap-2"
            >
              <FiPlus />
              Create Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Top Bar */}
                <div className="h-1.5 bg-[var(--primary)]"></div>

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <FiBookOpen
                          size={13}
                          className="text-[var(--primary)]"
                        />
                        {template.program || "All Programs"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(template)}
                        className="p-2 rounded-lg text-[var(--primary)] hover:bg-[var(--primary)]/10 transition"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(template._id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Logo */}
                  {template.logoUrl && (
                    <div className="mt-5 flex justify-center">
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 w-full flex justify-center">
                        <img
                          src={template.logoUrl}
                          alt="logo"
                          className="h-14 object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="mt-5 border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-gray-500">
                        Institution
                      </span>

                      <span className="text-sm font-medium text-gray-700 text-right break-words">
                        {template.institutionName}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <FiUser size={12} />
                        Signatory
                      </span>

                      <span className="text-sm font-medium text-gray-700 text-right break-words">
                        {template.signatoryName || "—"}
                      </span>
                    </div>

                    {template.isDefault && (
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                          <FiAward size={12} />
                          Default Template
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal – Professional redesigned */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingTemplate ? "Edit Template" : "Create Template"}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Manage certificate template details
                  </p>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <FiX className="text-gray-500 text-xl" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">

                {/* Template + Institution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition"
                    />
                  </div>
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL
                  </label>

                  <input
                    type="url"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition"
                  />

                  {formData.logoUrl && (
                    <div className="mt-3 p-3 border border-gray-200 rounded-xl bg-gray-50 flex justify-center">
                      <img
                        src={formData.logoUrl}
                        alt="preview"
                        className="h-14 object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Signatory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Signatory Name
                    </label>

                    <input
                      type="text"
                      name="signatoryName"
                      value={formData.signatoryName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Signature Image URL
                    </label>

                    <input
                      type="url"
                      name="signatureImageUrl"
                      value={formData.signatureImageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/signature.png"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition"
                    />

                    {formData.signatureImageUrl && (
                      <div className="mt-3 p-3 border border-gray-200 rounded-xl bg-gray-50 flex justify-center">
                        <img
                          src={formData.signatureImageUrl}
                          alt="signature preview"
                          className="h-10 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Program */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program
                  </label>

                  <input
                    type="text"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition"
                  />

                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank to apply for all programs
                  </p>
                </div>

                {/* Default Checkbox */}
                <div className="flex items-start gap-3 bg-[var(--primary)]/5 border border-[var(--primary)]/10 rounded-xl p-4">
                  <input
                    type="checkbox"
                    name="isDefault"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="w-5 h-5 mt-0.5 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]"
                  />

                  <label
                    htmlFor="isDefault"
                    className="text-sm text-gray-700 leading-relaxed"
                  >
                    Set this as the default certificate template when no
                    program-specific template is available.
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary)]/90 flex items-center gap-2 transition disabled:opacity-50"
                  >
                    <FiSave />

                    {submitting
                      ? "Saving..."
                      : editingTemplate
                        ? "Update"
                        : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {confirmDialog.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800">{confirmDialog.title}</h3>
              <p className="text-gray-600 my-4">{confirmDialog.message}</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDialog({ open: false })}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}