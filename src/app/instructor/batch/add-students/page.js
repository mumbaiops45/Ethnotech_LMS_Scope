"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaSave, FaArrowLeft, FaUsers, FaBookOpen, FaUserGraduate, FaChevronDown } from "react-icons/fa";
import { getBatches, addStudentsToBatch, getStudents } from "../../../../../service/login.service";

export default function AddStudentsToBatchPage() {
  const router = useRouter();
  const [batches, setBatches] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [batchesRes, studentsRes] = await Promise.all([getBatches(), getStudents()]);
        setBatches(batchesRes.data || []);
        setAllStudents(studentsRes.data || []);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBatchChange = (batchId) => {
    setSelectedBatchId(batchId);
    if (!batchId) {
      setSelectedStudentIds([]);
      return;
    }
    const batch = batches.find((b) => b._id === batchId);
    if (batch && batch.students) {
      setSelectedStudentIds(batch.students.map((s) => s._id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const toggleStudent = (studentId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const toggleAllStudents = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s._id));
    }
  };

  const handleSubmit = async () => {
    if (!selectedBatchId) {
      toast.error("Please select a batch");
      return;
    }
    if (selectedStudentIds.length === 0) {
      toast.error("Please select at least one student");
      return;
    }
    setSubmitting(true);
    try {
      await addStudentsToBatch(selectedBatchId, selectedStudentIds);
      toast.success("Students added successfully");
      const batchesRes = await getBatches();
      setBatches(batchesRes.data || []);
      const updatedBatch = batchesRes.data.find((b) => b._id === selectedBatchId);
      if (updatedBatch?.students) {
        setSelectedStudentIds(updatedBatch.students.map((s) => s._id));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add students");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = allStudents.filter((student) =>
    (student.fullName || student.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedBatch = batches.find((b) => b._id === selectedBatchId);
  const enrolledCount = selectedBatch?.students?.length || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading batches & students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Add Students to Batch</h1>
            <p className="text-gray-500 mt-1">Select a batch and assign students</p>
          </div>
        </div>
        {selectedBatchId && (
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-sm text-blue-700">
              <FaUsers className="inline mr-2" />
              {enrolledCount} student(s) enrolled
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Batch Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FaBookOpen className="text-blue-600" />
                Select Batch
              </h2>
            </div>
            <div className="p-4">
              {batches.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No batches found</p>
                  <button
                    onClick={() => router.push("/components/batch/create")}
                    className="mt-3 text-blue-600 hover:underline text-sm"
                  >
                    Create a new batch →
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {batches.map((batch) => (
                    <button
                      key={batch._id}
                      onClick={() => handleBatchChange(batch._id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedBatchId === batch._id
                          ? "bg-blue-50 border border-blue-200 shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <div className="font-medium text-gray-800">{batch.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {batch.program} • {batch.branch}
                      </div>
                      <div className="text-xs text-blue-600 mt-2">
                        {batch.students?.length || 0} students enrolled
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Student Selection */}
        <div className="lg:col-span-2">
          {!selectedBatchId ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FaUserGraduate className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No batch selected</h3>
              <p className="text-gray-500 mt-2">Choose a batch from the left panel to assign students.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FaUserGraduate className="text-green-600" />
                    Available Students
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredStudents.length} student(s) found
                  </p>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {filteredStudents.length > 0 && (
                    <button
                      onClick={toggleAllStudents}
                      className="text-sm px-3 py-2 border rounded-lg hover:bg-gray-50 transition"
                    >
                      {selectedStudentIds.length === filteredStudents.length ? "Deselect All" : "Select All"}
                    </button>
                  )}
                </div>
              </div>

              {allStudents.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-500">No students found in the system.</p>
                  <button
                    onClick={() => router.push("/auth/register")}
                    className="mt-3 text-blue-600 hover:underline"
                  >
                    Register new student →
                  </button>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-500">No students match your search.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <label
                      key={student._id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(student._id)}
                        onChange={() => toggleStudent(student._id)}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {student.fullName || student.name}
                        </div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                      {student.branch && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                          {student.branch}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}

              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={submitting || selectedStudentIds.length === 0}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm"
                >
                  <FaSave />
                  {submitting ? "Adding Students..." : `Add ${selectedStudentIds.length} Student(s)`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}