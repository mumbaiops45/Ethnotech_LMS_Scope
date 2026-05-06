"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaSave,
  FaArrowLeft,
  FaLayerGroup,
  FaBookOpen,
  FaCheckCircle,
  FaUniversity,
} from "react-icons/fa";
import {
  getBatches,
  assignCoursesToBatch,
} from "../../../../../service/login.service";
import { useCourse } from "../../../../../hooks/useCourses";

export default function BatchCourseAssignPage() {
  const router = useRouter();
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);

  const {
    courses: allCourses,
    loading: loadingCourses,
    getAllCoursesAdmin,
  } = useCourse();

  const extractData = (response) => {
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (response?.data?.data && Array.isArray(response.data.data)) return response.data.data;
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingBatches(true);
      try {
        const batchesRes = await getBatches();
        const batchesList = extractData(batchesRes);
        setBatches(batchesList);
        await getAllCoursesAdmin();
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load data");
      } finally {
        setLoadingBatches(false);
      }
    };
    fetchData();
  }, [getAllCoursesAdmin]);

  const handleBatchSelect = (batchId) => {
    setSelectedBatchId(batchId);
    const batch = batches.find((b) => b._id === batchId);
    if (batch?.courses) {
      setSelectedCourseIds(batch.courses.map((c) => c._id));
    } else {
      setSelectedCourseIds([]);
    }
  };

  const handleToggleCourse = (courseId) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedBatchId) {
      toast.error("Please select a batch");
      return;
    }
    if (selectedCourseIds.length === 0) {
      toast.error("Please select at least one course");
      return;
    }

    try {
      await assignCoursesToBatch(selectedBatchId, selectedCourseIds);
      toast.success("Courses assigned successfully");

      // Refresh batches
      const batchesRes = await getBatches();
      const batchesList = extractData(batchesRes);
      setBatches(batchesList);

      const updatedBatch = batchesList.find((b) => b._id === selectedBatchId);
      if (updatedBatch?.courses) {
        setSelectedCourseIds(updatedBatch.courses.map((c) => c._id));
      }
    } catch (error) {
      console.error("Assignment error:", error);
      toast.error(error?.response?.data?.message || "Assignment failed");
    }
  };

  const isLoading = loadingBatches || loadingCourses;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading batches & courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-purple-600"
            >
              <FaArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaLayerGroup className="text-purple-600" />
                Assign Courses to Batch
              </h1>
              <p className="text-gray-500 mt-1">
                Select a batch and assign courses from the library
              </p>
            </div>
          </div>
          {selectedBatchId && selectedCourseIds.length > 0 && (
            <div className="bg-purple-50 px-4 py-2 rounded-full">
              <span className="text-sm text-purple-700 font-medium">
                {selectedCourseIds.length} course(s) selected
              </span>
            </div>
          )}
        </div>

        {/* Two‑Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column – Batches */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                  <FaUniversity />
                  Available Batches
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  {batches.length} batch(s) found
                </p>
              </div>
              <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
                {batches.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    No batches available.
                  </div>
                ) : (
                  batches.map((batch) => (
                    <button
                      key={batch._id}
                      onClick={() => handleBatchSelect(batch._id)}
                      className={`w-full text-left p-4 transition-all duration-200 ${
                        selectedBatchId === batch._id
                          ? "bg-purple-50 border-l-4 border-purple-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {batch.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {batch.program || "No program"} • {batch.branch || "All branches"}
                          </p>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {batch.courses?.length || 0} courses
                        </span>
                      </div>
                      {selectedBatchId === batch._id && (
                        <div className="mt-2 text-xs text-purple-600 flex items-center gap-1">
                          <FaCheckCircle size={12} />
                          <span>Selected</span>
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column – Course Selection */}
          <div className="lg:col-span-2">
            {!selectedBatchId ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBookOpen className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">
                  No Batch Selected
                </h3>
                <p className="text-gray-500 mt-2">
                  Choose a batch from the left panel to assign courses.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                      <FaBookOpen className="text-purple-600" />
                      Course Library
                    </h2>
                    <p className="text-sm text-gray-500">
                      {allCourses.length} course(s) available
                    </p>
                  </div>
                  {allCourses.length > 0 && (
                    <button
                      onClick={() =>
                        setSelectedCourseIds(
                          selectedCourseIds.length === allCourses.length
                            ? []
                            : allCourses.map((c) => c._id)
                        )
                      }
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      {selectedCourseIds.length === allCourses.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  )}
                </div>

                {allCourses.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">
                    No courses found in the library.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 max-h-[60vh] overflow-y-auto">
                    {allCourses.map((course) => (
                      <label
                        key={course._id}
                        className={`group flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          selectedCourseIds.includes(course._id)
                            ? "border-purple-400 bg-purple-50 shadow-sm"
                            : "border-gray-200 hover:border-purple-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCourseIds.includes(course._id)}
                          onChange={() => handleToggleCourse(course._id)}
                          className="mt-1 w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">
                            {course.title}
                          </h3>
                          {course.description && (
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {course.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            {course.category && (
                              <span>📁 {course.category}</span>
                            )}
                            {course.program && (
                              <span>🎓 {course.program}</span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={selectedCourseIds.length === 0}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium"
                  >
                    <FaSave />
                    Save Assignments ({selectedCourseIds.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}