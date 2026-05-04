"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { getCertificateTemplates,createCertificateTemplate,
  updateCertificateTemplate,
  deleteCertificateTemplate, } from "../../../../service/certificate-templates.service";
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
  FiHelpCircle,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center md:text-left md:flex md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Certificate Templates
            </h1>
            <p className="text-slate-500 mt-2">
              Design and manage professional certificates for your programs
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Use <code className="bg-gray-100 px-1 rounded">{"{{student_name}}"}</code> and{" "}
              <code className="bg-gray-100 px-1 rounded">{"{{completion_date}}"}</code> as dynamic placeholders.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="mt-4 md:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <FiPlus size={20} /> New Template
          </button>
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-16 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAward className="text-indigo-400" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-slate-700">No templates yet</h3>
            <p className="text-slate-500 mt-2">Create your first certificate template to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template._id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                        <FiHome size={12} />
                        {template.program || "All programs"}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(template)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(template._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {template.logoUrl && (
                    <div className="mt-3 flex justify-center">
                      <img src={template.logoUrl} alt="logo" className="h-12 object-contain opacity-80 group-hover:opacity-100 transition" />
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Institution</span>
                      <span className="font-medium text-gray-700 truncate max-w-[160px]">
                        {template.institutionName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <FiUser size={12} /> Signatory
                      </span>
                      <span className="font-medium text-gray-700 truncate max-w-[160px]">
                        {template.signatoryName || "—"}
                      </span>
                    </div>
                   
                    {template.isDefault && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full">
                          <FiAward size={12} /> Default Template
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal – Create/Edit */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  {editingTemplate ? "Edit Template" : "Create New Template"}
                </h2>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name *</label>
                    <input type="text" name="institutionName" value={formData.institutionName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                  <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="https://example.com/logo.png" className="w-full border border-gray-300 rounded-xl px-4 py-2.5" />
                  {formData.logoUrl && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg inline-block">
                      <img src={formData.logoUrl} alt="preview" className="h-12 object-contain" />
                    </div>
                  )}
                </div>

               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Signatory Name</label>
                    <input type="text" name="signatoryName" value={formData.signatoryName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Signature Image URL</label>
                    <input type="url" name="signatureImageUrl" value={formData.signatureImageUrl} onChange={handleChange} placeholder="https://example.com/signature.png" className="w-full border border-gray-300 rounded-xl px-4 py-2.5" />
                    {formData.signatureImageUrl && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg inline-block">
                        <img src={formData.signatureImageUrl} alt="signature preview" className="h-8 object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program (leave blank for all)</label>
                  <input type="text" name="program" value={formData.program} onChange={handleChange} placeholder="e.g., B.Tech Computer Science" className="w-full border border-gray-300 rounded-xl px-4 py-2.5" />
                </div>

                <div className="flex items-center gap-3 p-3 bg-indigo-50/30 rounded-xl">
                  <input type="checkbox" name="isDefault" id="isDefault" checked={formData.isDefault} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                  <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">Set as default template (used when no program‑specific template exists)</label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl flex items-center gap-2 shadow-md transition disabled:opacity-50">
                    <FiSave /> {submitting ? "Saving..." : editingTemplate ? "Update" : "Create"}
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
                <button onClick={() => setConfirmDialog({ open: false })} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={confirmDialog.onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}