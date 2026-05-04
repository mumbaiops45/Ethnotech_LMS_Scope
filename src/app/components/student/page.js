// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import { FaEye, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
// import {
//   getStudents,
//   updateStudent,
//   deleteStudent,
// } from "../../../../service/login.service";

// export default function StudentsPage() {
//   const router = useRouter();
//   const [students, setStudents] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingStudent, setEditingStudent] = useState(null);
//   const [viewingStudent, setViewingStudent] = useState(null);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     mobile: "",
//     dob: "",
//     gender: "",
//     education: "",
//     program: "",
//     branch: "",
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [confirmDialog, setConfirmDialog] = useState({
//     open: false,
//     title: "",
//     message: "",
//     onConfirm: null,
//   });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const fetchStudents = async () => {
//     setLoading(true);
//     try {
//       const response = await getStudents();
//       const list = response.data || [];
//       setStudents(list);
//       setFilteredStudents(list);
//       setCurrentPage(1);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to load students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   // Search filter
//   useEffect(() => {
//     const term = searchTerm.toLowerCase();
//     const filtered = students.filter(
//       (student) =>
//         student.profile?.fullName?.toLowerCase().includes(term) ||
//         student.email?.toLowerCase().includes(term) ||
//         student.mobile?.includes(term)
//     );
//     setFilteredStudents(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, students]);

//   // Paginated data
//   const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

//   const openEditModal = (student) => {
//     const profile = student.profile || {};
//     setEditingStudent(student);
//     setFormData({
//       fullName: profile.fullName || "",
//       email: student.email || "",
//       mobile: student.mobile || "",
//       dob: profile.dob ? profile.dob.split("T")[0] : "",
//       gender: profile.gender || "",
//       education: profile.education || "",
//       program: profile.program || "",
//       branch: profile.branch || "",
//     });
//     setModalOpen(true);
//   };

//   const openViewModal = (student) => {
//     setViewingStudent(student);
//   };

//   const closeViewModal = () => {
//     setViewingStudent(null);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setEditingStudent(null);
//     setFormData({
//       fullName: "",
//       email: "",
//       mobile: "",
//       dob: "",
//       gender: "",
//       education: "",
//       program: "",
//       branch: "",
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!formData.fullName.trim()) {
//       toast.error("Full name is required");
//       return;
//     }
//     setSubmitting(true);
//     const payload = {
//       fullName: formData.fullName,
//       email: formData.email,
//       mobile: formData.mobile,
//       dob: formData.dob || null,
//       gender: formData.gender,
//       education: formData.education,
//       program: formData.program,
//       branch: formData.branch,
//     };
//     try {
//       await updateStudent(editingStudent._id, payload);
//       toast.success("Student updated successfully");
//       fetchStudents();
//       closeModal();
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Update failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = (id) => {
//     setConfirmDialog({
//       open: true,
//       title: "Delete Student",
//       message: "Are you sure you want to permanently delete this student? This action cannot be undone.",
//       onConfirm: async () => {
//         try {
//           await deleteStudent(id);
//           toast.success("Student deleted");
//           fetchStudents();
//         } catch (error) {
//           toast.error(error?.response?.data?.message || "Delete failed");
//         } finally {
//           setConfirmDialog({ open: false, onConfirm: null });
//         }
//       },
//     });
//   };

//   const closeConfirmDialog = () => {
//     setConfirmDialog({ open: false, onConfirm: null });
//   };

//   return (
//     <div className="p-6">
//       {/* Back Button */}
//       <div className="mb-4">
//         <button
//           onClick={() => router.push("/components/card")}
//           className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
//         >
//           <FaArrowLeft className="text-sm" />
//           Back to Dashboard
//         </button>
//       </div>

//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
//         <div className="flex gap-3 w-full sm:w-auto">
//           <input
//             type="text"
//             placeholder="Search by name, email or mobile..."
//             className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           {/* No "Add" button – students are created via registration */}
//         </div>
//       </div>

//       {loading ? (
//         <div className="text-center py-10 text-gray-500">Loading students...</div>
//       ) : filteredStudents.length === 0 ? (
//         <div className="text-center py-10 text-gray-500">No students found</div>
//       ) : (
//         <>
//           <div className="overflow-x-auto bg-white rounded-xl shadow-md">
//             <table className="min-w-full text-sm text-left">
//               <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
//                 <tr>
//                   <th className="px-4 py-3">#</th>
//                   <th className="px-4 py-3">Full Name</th>
//                   <th className="px-4 py-3">Email</th>
//                   <th className="px-4 py-3">Mobile</th>
//                   <th className="px-4 py-3">Gender</th>
//                   <th className="px-4 py-3">Education</th>
//                   <th className="px-4 py-3">Program</th>
//                   <th className="px-4 py-3">Branch</th>
//                   {/* <th className="px-4 py-3">Status</th> */}
//                   <th className="px-4 py-3 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {paginatedStudents.map((student, idx) => {
//                   const profile = student.profile || {};
//                   return (
//                     <tr key={student._id} className="hover:bg-gray-50">
//                       <td className="px-4 py-3">{startIndex + idx + 1}</td>
//                       <td className="px-4 py-3 font-medium">{profile.fullName || "—"}</td>
//                       <td className="px-4 py-3">{student.email}</td>
//                       <td className="px-4 py-3">{student.mobile || "—"}</td>
//                       <td className="px-4 py-3">{profile.gender || "—"}</td>
//                       <td className="px-4 py-3">{profile.education || "—"}</td>
//                       <td className="px-4 py-3">{profile.program || "—"}</td>
//                       <td className="px-4 py-3">{profile.branch || "—"}</td>
//                       {/* <td className="px-4 py-3">
//                         <span className={`px-2 py-1 text-xs rounded-full ${student.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
//                           {student.isVerified ? "Verified" : "Not Verified"}
//                         </span>
//                       </td> */}
//                       <td className="px-4 py-3 text-center space-x-3">
//                         <button onClick={() => openViewModal(student)} className="text-gray-600 hover:text-gray-800" title="View Details">
//                           <FaEye className="inline" />
//                         </button>
//                         <button onClick={() => openEditModal(student)} className="text-blue-600 hover:text-blue-800" title="Edit">
//                           <FaEdit className="inline" />
//                         </button>
//                         <button onClick={() => handleDelete(student._id)} className="text-red-600 hover:text-red-800" title="Delete">
//                           <FaTrash className="inline" />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center gap-2 mt-6">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`px-3 py-1 border rounded-lg transition ${currentPage === page ? "bg-blue-600 text-white" : "hover:bg-gray-50"}`}
//                 >
//                   {page}
//                 </button>
//               ))}
//               <button
//                 onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {/* Edit Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4">Edit Student</h2>
//             <form onSubmit={handleUpdate} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
//                   <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                   <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
//                   <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
//                   <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//                   <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
//                     <option value="">Select</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
//                   <input type="text" name="education" value={formData.education} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
//                   <input type="text" name="program" value={formData.program} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
//                   <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
//                 </div>
//               </div>
//               <div className="flex justify-end gap-3 pt-2">
//                 <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
//                 <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
//                   {submitting ? "Saving..." : "Update"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* View Modal – redesigned with 2 columns per row */}
//       {viewingStudent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
//             <h2 className="text-xl font-bold mb-4">Student Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Full Name</label>
//                 <p className="text-gray-800 font-medium">{viewingStudent.profile?.fullName || "—"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Email</label>
//                 <p className="text-gray-800">{viewingStudent.email || "—"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Mobile</label>
//                 <p className="text-gray-800">{viewingStudent.mobile || "—"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Date of Birth</label>
//                 <p className="text-gray-800">{viewingStudent.profile?.dob ? new Date(viewingStudent.profile.dob).toLocaleDateString() : "—"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Gender</label>
//                 <p className="text-gray-800">{viewingStudent.profile?.gender || "—"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Education</label>
//                 <p className="text-gray-800">{viewingStudent.profile?.education || "—"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Program</label>
//                 <p className="text-gray-800">{viewingStudent.profile?.program || "—"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Branch</label>
//                 <p className="text-gray-800">{viewingStudent.profile?.branch || "—"}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Status</label>
//                 <p className="text-gray-800">
//                   <span className={`inline-block px-2 py-1 text-xs rounded-full ${viewingStudent.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
//                     {viewingStudent.isVerified ? "Verified" : "Not Verified"}
//                   </span>
//                 </p>
//               </div>
//             </div>
//             <div className="flex justify-end mt-6">
//               <button onClick={closeViewModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirmation Dialog */}
//       {confirmDialog.open && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">{confirmDialog.title}</h3>
//             <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
//             <div className="flex justify-end gap-3">
//               <button onClick={closeConfirmDialog} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
//               <button onClick={confirmDialog.onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaEye, FaEdit, FaTrash, FaArrowLeft, FaUpload, FaTimes, FaDownload } from "react-icons/fa";
import {
  getStudents,
  updateStudent,
  deleteStudent,
  bulkImportStudents,   // ✅ new import
} from "../../../../service/login.service";   // ✅ corrected path (3 levels up)

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    education: "",
    program: "",
    branch: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Bulk import state
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [importResults, setImportResults] = useState(null);
  const [importing, setImporting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await getStudents();
      const list = response.data || [];
      setStudents(list);
      setFilteredStudents(list);
      setCurrentPage(1);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Search filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.profile?.fullName?.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term) ||
        student.mobile?.includes(term)
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, students]);

  // Paginated data
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // ================= Bulk Import Handlers =================
  const handleBulkImport = async () => {
    if (!csvFile) return toast.error("Please select a CSV file");
    const fd = new FormData();
    fd.append("file", csvFile);
    setImporting(true);
    try {
      const res = await bulkImportStudents(fd);
      setImportResults(res);
      toast.success("Import completed. Check summary below.");
      fetchStudents(); // refresh student list
    } catch (err) {
      toast.error(err?.response?.data?.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const downloadCSVTemplate = () => {
    const headers = ["fullName", "email", "mobile", "branch", "gender"];
    const sampleRows = [
      "John Doe,john@example.com,9876543210,Mumbai,Male",
      "Jane Smith,jane@example.com,9876543211,Delhi,Female"
    ];
    const csvContent = [headers.join(","), ...sampleRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ================= CRUD Handlers (unchanged) =================
  const openEditModal = (student) => {
    const profile = student.profile || {};
    setEditingStudent(student);
    setFormData({
      fullName: profile.fullName || "",
      email: student.email || "",
      mobile: student.mobile || "",
      dob: profile.dob ? profile.dob.split("T")[0] : "",
      gender: profile.gender || "",
      education: profile.education || "",
      program: profile.program || "",
      branch: profile.branch || "",
    });
    setModalOpen(true);
  };

  const openViewModal = (student) => {
    setViewingStudent(student);
  };

  const closeViewModal = () => {
    setViewingStudent(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingStudent(null);
    setFormData({
      fullName: "",
      email: "",
      mobile: "",
      dob: "",
      gender: "",
      education: "",
      program: "",
      branch: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    setSubmitting(true);
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      dob: formData.dob || null,
      gender: formData.gender,
      education: formData.education,
      program: formData.program,
      branch: formData.branch,
    };
    try {
      await updateStudent(editingStudent._id, payload);
      toast.success("Student updated successfully");
      fetchStudents();
      closeModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      open: true,
      title: "Delete Student",
      message: "Are you sure you want to permanently delete this student? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await deleteStudent(id);
          toast.success("Student deleted");
          fetchStudents();
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
      <div className="mb-4">
        <button
          onClick={() => router.push("/components/card")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
        >
          <FaArrowLeft className="text-sm" />
          Back to Dashboard
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name, email or mobile..."
            className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* ✅ Bulk Import Button */}
          <button
            onClick={() => setBulkModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaUpload /> Bulk Import
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading students...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No students found</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Gender</th>
                  <th className="px-4 py-3">Education</th>
                  <th className="px-4 py-3">Program</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedStudents.map((student, idx) => {
                  const profile = student.profile || {};
                  return (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{startIndex + idx + 1}</td>
                      <td className="px-4 py-3 font-medium">{profile.fullName || "—"}</td>
                      <td className="px-4 py-3">{student.email}</td>
                      <td className="px-4 py-3">{student.mobile || "—"}</td>
                      <td className="px-4 py-3">{profile.gender || "—"}</td>
                      <td className="px-4 py-3">{profile.education || "—"}</td>
                      <td className="px-4 py-3">{profile.program || "—"}</td>
                      <td className="px-4 py-3">{profile.branch || "—"}</td>
                      <td className="px-4 py-3 text-center space-x-3">
                        <button onClick={() => openViewModal(student)} className="text-gray-600 hover:text-gray-800" title="View Details">
                          <FaEye className="inline" />
                        </button>
                        <button onClick={() => openEditModal(student)} className="text-blue-600 hover:text-blue-800" title="Edit">
                          <FaEdit className="inline" />
                        </button>
                        <button onClick={() => handleDelete(student._id)} className="text-red-600 hover:text-red-800" title="Delete">
                          <FaTrash className="inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded-lg transition ${currentPage === page ? "bg-blue-600 text-white" : "hover:bg-gray-50"}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Edit Modal (unchanged) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  <input type="text" name="education" value={formData.education} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                  <input type="text" name="program" value={formData.program} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {submitting ? "Saving..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal (unchanged) */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Student Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-800 font-medium">{viewingStudent.profile?.fullName || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-800">{viewingStudent.email || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Mobile</label>
                <p className="text-gray-800">{viewingStudent.mobile || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-gray-800">{viewingStudent.profile?.dob ? new Date(viewingStudent.profile.dob).toLocaleDateString() : "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-gray-800">{viewingStudent.profile?.gender || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Education</label>
                <p className="text-gray-800">{viewingStudent.profile?.education || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Program</label>
                <p className="text-gray-800">{viewingStudent.profile?.program || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Branch</label>
                <p className="text-gray-800">{viewingStudent.profile?.branch || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-gray-800">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${viewingStudent.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {viewingStudent.isVerified ? "Verified" : "Not Verified"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={closeViewModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {bulkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Bulk Import Students</h2>
              <button
                onClick={() => {
                  setBulkModalOpen(false);
                  setImportResults(null);
                  setCsvFile(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <button
                onClick={downloadCSVTemplate}
                className="text-blue-600 flex items-center gap-1 hover:underline"
              >
                <FaDownload /> Download CSV Template
              </button>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  className="mb-2"
                />
                <p className="text-sm text-gray-500">
                  Upload CSV with columns: fullName, email, mobile, branch, gender
                </p>
              </div>
              <button
                onClick={handleBulkImport}
                disabled={!csvFile || importing}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {importing ? "Importing..." : "Upload & Import"}
              </button>
              {importResults && (
                <div
                  className={`mt-4 p-3 rounded-lg ${
                    importResults.errors?.length ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"
                  }`}
                >
                  <p className="font-semibold">
                    Summary: {importResults.created} created, {importResults.failed} failed
                  </p>
                  {importResults.errors?.length > 0 && (
                    <div className="mt-2 max-h-60 overflow-auto">
                      <p className="font-semibold text-red-700">Errors:</p>
                      {importResults.errors.map((err, i) => (
                        <div key={i} className="text-sm text-red-600 border-t border-red-100 py-1">
                          {err.row ? `Row ${err.row}: ` : ""}
                          {err.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog (unchanged) */}
      {confirmDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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