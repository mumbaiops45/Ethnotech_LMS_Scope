// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import {
//   FaSave,
//   FaArrowLeft,
//   FaUsers,
//   FaUserGraduate,
//   FaLayerGroup 
// } from "react-icons/fa";
// import {
//   getBatches,
//   addStudentsToBatch,
//   getStudents,
// } from "../../../../../service/login.service";

// export default function AddStudentsToBatchPage() {
//   const router = useRouter();
//   const [batches, setBatches] = useState([]);
//   const [allStudents, setAllStudents] = useState([]);
//   const [selectedBatchId, setSelectedBatchId] = useState("");
//   const [selectedStudentIds, setSelectedStudentIds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [batchesRes, studentsRes] = await Promise.all([
//           getBatches(),
//           getStudents(),
//         ]);

//         setBatches(batchesRes.data || []);
//         setAllStudents(studentsRes.data || []);
//       } catch (error) {
//         toast.error("Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleBatchChange = (batchId) => {
//     setSelectedBatchId(batchId);

//     if (!batchId) {
//       setSelectedStudentIds([]);
//       return;
//     }

//     const batch = batches.find((b) => b._id === batchId);

//     if (batch && batch.students) {
//       setSelectedStudentIds(batch.students.map((s) => s._id));
//     } else {
//       setSelectedStudentIds([]);
//     }
//   };

//   const toggleStudent = (studentId) => {
//     setSelectedStudentIds((prev) =>
//       prev.includes(studentId)
//         ? prev.filter((id) => id !== studentId)
//         : [...prev, studentId]
//     );
//   };

//   const toggleAllStudents = () => {
//     if (selectedStudentIds.length === filteredStudents.length) {
//       setSelectedStudentIds([]);
//     } else {
//       setSelectedStudentIds(filteredStudents.map((s) => s._id));
//     }
//   };

//   const handleSubmit = async () => {
//     if (!selectedBatchId) {
//       toast.error("Please select a batch");
//       return;
//     }

//     if (selectedStudentIds.length === 0) {
//       toast.error("Please select at least one student");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       await addStudentsToBatch(selectedBatchId, selectedStudentIds);

//       toast.success("Students added successfully");

//       const batchesRes = await getBatches();

//       setBatches(batchesRes.data || []);

//       const updatedBatch = batchesRes.data.find(
//         (b) => b._id === selectedBatchId
//       );

//       if (updatedBatch?.students) {
//         setSelectedStudentIds(updatedBatch.students.map((s) => s._id));
//       }
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message || "Failed to add students"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const filteredStudents = allStudents.filter(
//     (student) =>
//       (student.fullName || student.name || "")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       student.email
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//   );

//   const selectedBatch = batches.find(
//     (b) => b._id === selectedBatchId
//   );

//   const enrolledCount = selectedBatch?.students?.length || 0;

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>

//           <p className="mt-4 text-gray-500">
//             Loading batches & students...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => router.back()}
//             className="p-3 rounded-full bg-white shadow-sm border hover:bg-gray-100 transition"
//           >
//             <FaArrowLeft className="text-[var(--primary)]" />
//           </button>

//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               Add Students to Batch
//             </h1>

//             <p className="text-gray-500 mt-1">
//               Select a batch and assign students
//             </p>
//           </div>
//         </div>

//         {selectedBatchId && (
//           <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-4 py-2 rounded-xl">
//             <span className="text-sm text-[var(--primary)] font-medium">
//               <FaUsers className="inline mr-2" />
//               {enrolledCount} student(s) enrolled
//             </span>
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Panel */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="p-5 border-b bg-[var(--primary)]/10">
//               <h2 className="font-semibold text-gray-800 flex items-center gap-2">
//                 <FaLayerGroup className="text-[var(--primary)]" />
//                 Select Batch
//               </h2>
//             </div>

//             <div className="p-4">
//               {batches.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">
//                     No batches found
//                   </p>

//                   <button
//                     onClick={() =>
//                       router.push("/components/batch/create")
//                     }
//                     className="mt-3 text-[var(--primary)] hover:underline text-sm"
//                   >
//                     Create a new batch →
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {batches.map((batch) => (
//                     <button
//                       key={batch._id}
//                       onClick={() =>
//                         handleBatchChange(batch._id)
//                       }
//                       className={`w-full text-left p-4 rounded-xl border transition-all ${selectedBatchId === batch._id
//                           ? "bg-[var(--primary)]/10 border-[var(--primary)] shadow-sm"
//                           : "bg-white hover:bg-gray-50 border-gray-200"
//                         }`}
//                     >
//                       <div className="font-semibold text-gray-800">
//                         {batch.name}
//                       </div>

//                       <div className="text-sm text-gray-500 mt-1">
//                         {batch.program} • {batch.branch}
//                       </div>

//                       <div className="text-xs text-[var(--primary)] mt-2 font-medium">
//                         {batch.students?.length || 0} students
//                         enrolled
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right Panel */}
//         <div className="lg:col-span-2">
//           {!selectedBatchId ? (
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
//               <FaUserGraduate className="text-6xl text-gray-300 mx-auto mb-4" />

//               <h3 className="text-lg font-semibold text-gray-700">
//                 No batch selected
//               </h3>

//               <p className="text-gray-500 mt-2">
//                 Choose a batch from the left panel to
//                 assign students.
//               </p>
//             </div>
//           ) : (
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="p-5 border-b bg-[var(--primary)]/10 flex justify-between items-center flex-wrap gap-3">
//                 <div>
//                   <h2 className="font-semibold text-gray-800 flex items-center gap-2">
//                     <FaUserGraduate className="text-[var(--primary)]" />
//                     Available Students
//                   </h2>

//                   <p className="text-sm text-gray-500 mt-1">
//                     {filteredStudents.length} student(s)
//                     found
//                   </p>
//                 </div>

//                 <div className="flex gap-3 flex-wrap">
//                   <input
//                     type="text"
//                     placeholder="Search by name or email..."
//                     value={searchTerm}
//                     onChange={(e) =>
//                       setSearchTerm(e.target.value)
//                     }
//                     className="px-4 py-2 border rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
//                   />

//                   {filteredStudents.length > 0 && (
//                     <button
//                       onClick={toggleAllStudents}
//                       className="text-sm px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
//                     >
//                       {selectedStudentIds.length ===
//                         filteredStudents.length
//                         ? "Deselect All"
//                         : "Select All"}
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {allStudents.length === 0 ? (
//                 <div className="p-12 text-center">
//                   <p className="text-gray-500">
//                     No students found in the system.
//                   </p>

//                   <button
//                     onClick={() =>
//                       router.push("/auth/register")
//                     }
//                     className="mt-3 text-[var(--primary)] hover:underline"
//                   >
//                     Register new student →
//                   </button>
//                 </div>
//               ) : filteredStudents.length === 0 ? (
//                 <div className="p-12 text-center">
//                   <p className="text-gray-500">
//                     No students match your search.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
//                   {filteredStudents.map((student) => (
//                     <label
//                       key={student._id}
//                       className="flex items-center gap-4 p-4 hover:bg-[var(--primary)]/5 cursor-pointer transition"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedStudentIds.includes(
//                           student._id
//                         )}
//                         onChange={() =>
//                           toggleStudent(student._id)
//                         }
//                         className="w-5 h-5 text-[var(--primary)] rounded border-gray-300 focus:ring-[var(--primary)]"
//                       />

//                       <div className="flex-1">
//                         <div className="font-medium text-gray-800">
//                           {student.fullName || student.name}
//                         </div>

//                         <div className="text-sm text-gray-500">
//                           {student.email}
//                         </div>
//                       </div>

//                       {student.branch && (
//                         <span className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full font-medium">
//                           {student.branch}
//                         </span>
//                       )}
//                     </label>
//                   ))}
//                 </div>
//               )}

//               <div className="p-5 border-t bg-gray-50 flex justify-end">
//                 <button
//                   onClick={handleSubmit}
//                   disabled={
//                     submitting ||
//                     selectedStudentIds.length === 0
//                   }
//                   className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition shadow-sm"
//                 >
//                   <FaSave />

//                   {submitting
//                     ? "Adding Students..."
//                     : `Add ${selectedStudentIds.length} Student(s)`}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  FaSave,
  FaArrowLeft,
  FaUsers,
  FaUserGraduate,
  FaLayerGroup,
  FaSearch,
  FaCheckCircle,
} from "react-icons/fa";

import {
  getBatches,
  addStudentsToBatch,
  getStudents,
} from "../../../../../service/login.service";

export default function AddStudentsToBatchPage() {
  const router = useRouter();

  const [batches, setBatches] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const [batchesRes, studentsRes] = await Promise.all([
        getBatches(),
        getStudents(),
      ]);

      console.log("Batches Response:", batchesRes);
      console.log("Students Response:", studentsRes);

      const batchesData =
        batchesRes?.data || batchesRes || [];

      const studentsData =
        studentsRes?.data || studentsRes || [];

      setBatches(
        Array.isArray(batchesData) ? batchesData : []
      );

      setAllStudents(
        Array.isArray(studentsData) ? studentsData : []
      );
    } catch (error) {
      console.log(error);

      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SELECT BATCH
  ========================= */
  const handleBatchChange = (batchId) => {
    setSelectedBatchId(batchId);

    const selectedBatch = batches.find(
      (b) => b._id === batchId
    );

    if (selectedBatch?.students?.length > 0) {
      setSelectedStudentIds(
        selectedBatch.students.map((s) =>
          typeof s === "object" ? s._id : s
        )
      );
    } else {
      setSelectedStudentIds([]);
    }
  };

  /* =========================
     FILTER STUDENTS
  ========================= */
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      const name = (
        student.fullName ||
        student.name ||
        ""
      ).toLowerCase();

      const email = (
        student.email || ""
      ).toLowerCase();

      return (
        name.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase())
      );
    });
  }, [allStudents, searchTerm]);

  /* =========================
     TOGGLE STUDENT
  ========================= */
  const toggleStudent = (studentId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  /* =========================
     SELECT ALL
  ========================= */
  const toggleAllStudents = () => {
    const filteredIds = filteredStudents.map(
      (s) => s._id
    );

    const allSelected = filteredIds.every((id) =>
      selectedStudentIds.includes(id)
    );

    if (allSelected) {
      setSelectedStudentIds((prev) =>
        prev.filter((id) => !filteredIds.includes(id))
      );
    } else {
      setSelectedStudentIds((prev) => [
        ...new Set([...prev, ...filteredIds]),
      ]);
    }
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    if (!selectedBatchId) {
      toast.error("Please select a batch");
      return;
    }

    if (selectedStudentIds.length === 0) {
      toast.error(
        "Please select at least one student"
      );
      return;
    }

    try {
      setSubmitting(true);

      console.log("Sending:", {
        batchId: selectedBatchId,
        studentIds: selectedStudentIds,
      });

      await addStudentsToBatch(
        selectedBatchId,
        selectedStudentIds
      );

      toast.success(
        "Students added successfully"
      );

      await fetchInitialData();
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to add students"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-gray-200 border-t-[var(--primary)] rounded-full animate-spin mx-auto"></div>

          <p className="mt-5 text-gray-500">
            Loading students & batches...
          </p>
        </div>
      </div>
    );
  }

  const selectedBatch = batches.find(
    (b) => b._id === selectedBatchId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
              >
                <FaArrowLeft className="text-[var(--primary)]" />
              </button>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Add Students To Batch
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage and assign students easily
                </p>
              </div>
            </div>

            {selectedBatch && (
              <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-5 py-3 rounded-2xl">
                <p className="text-sm text-[var(--primary)] font-semibold">
                  <FaUsers className="inline mr-2" />
                  {selectedStudentIds.length} Student(s)
                  Selected
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--primary)]/10 to-transparent px-5 py-4 border-b">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <FaLayerGroup className="text-[var(--primary)]" />
                Select Batch
              </h2>
            </div>

            <div className="p-4 space-y-3 max-h-[700px] overflow-y-auto">
              {batches.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    No batches found
                  </p>
                </div>
              ) : (
                batches.map((batch) => (
                  <button
                    key={batch._id}
                    onClick={() =>
                      handleBatchChange(batch._id)
                    }
                    className={`w-full text-left rounded-2xl p-4 border transition-all duration-300 ${
                      selectedBatchId === batch._id
                        ? "border-[var(--primary)] bg-[var(--primary)]/10 shadow-md"
                        : "border-gray-200 hover:border-[var(--primary)]/30 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {batch.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {batch.program} •{" "}
                          {batch.branch}
                        </p>
                      </div>

                      <div className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-[var(--primary)] shadow-sm">
                        {batch.students?.length || 0}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2">
          {!selectedBatchId ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
              <FaUserGraduate className="text-7xl text-gray-300 mx-auto mb-5" />

              <h2 className="text-2xl font-bold text-gray-700">
                Select a Batch
              </h2>

              <p className="text-gray-500 mt-2">
                Choose any batch from the left side
                to add students.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* TOP */}
              <div className="p-5 border-b bg-gradient-to-r from-[var(--primary)]/10 to-transparent">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-lg flex items-center gap-2">
                      <FaUserGraduate className="text-[var(--primary)]" />
                      Student List
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {filteredStudents.length} students
                      available
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                      <input
                        type="text"
                        placeholder="Search student..."
                        value={searchTerm}
                        onChange={(e) =>
                          setSearchTerm(
                            e.target.value
                          )
                        }
                        className="pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-full sm:w-72"
                      />
                    </div>

                    <button
                      onClick={toggleAllStudents}
                      className="px-4 py-3 rounded-2xl border border-gray-200 hover:bg-gray-100 transition text-sm font-medium"
                    >
                      Select All
                    </button>
                  </div>
                </div>
              </div>

              {/* STUDENT LIST */}
              <div className="max-h-[550px] overflow-y-auto">
                {filteredStudents.length === 0 ? (
                  <div className="p-16 text-center">
                    <p className="text-gray-500">
                      No students found
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
                    {filteredStudents.map((student) => {
                      const isSelected =
                        selectedStudentIds.includes(
                          student._id
                        );

                      return (
                        <div
                          key={student._id}
                          onClick={() =>
                            toggleStudent(student._id)
                          }
                          className={`rounded-2xl border p-4 cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? "border-[var(--primary)] bg-[var(--primary)]/10 shadow-md"
                              : "border-gray-200 hover:border-[var(--primary)]/30 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
                                <FaUserGraduate className="text-[var(--primary)]" />
                              </div>

                              <div>
                                <h3 className="font-semibold text-gray-800">
                                  {student.fullName ||
                                    student.name}
                                </h3>

                                <p className="text-sm text-gray-500 break-all">
                                  {student.email}
                                </p>
                              </div>
                            </div>

                            {isSelected && (
                              <FaCheckCircle className="text-green-500 text-xl" />
                            )}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {student.branch && (
                              <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                {student.branch}
                              </span>
                            )}

                            {student.program && (
                              <span className="px-3 py-1 rounded-full text-xs bg-[var(--primary)]/10 text-[var(--primary)]">
                                {student.program}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="border-t bg-gray-50 p-5 flex justify-between items-center flex-wrap gap-4">
                <div className="text-sm text-gray-600">
                  Selected Students:{" "}
                  <span className="font-bold text-[var(--primary)]">
                    {selectedStudentIds.length}
                  </span>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={
                    submitting ||
                    selectedStudentIds.length === 0
                  }
                  className="px-7 py-3 rounded-2xl bg-[var(--primary)] text-white font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2 shadow-md"
                >
                  <FaSave />

                  {submitting
                    ? "Adding Students..."
                    : "Add Students"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}