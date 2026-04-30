"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import {
  getBatches,
  assignCoursesToBatch,
  getCourses,
} from "../../../../../service/login.service";

export default function BatchCourseAssignPage() {
  const router = useRouter();
  const [batches, setBatches] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [batchesRes, coursesRes] = await Promise.all([
          getBatches(),
          getCourses(),
        ]);
        setBatches(batchesRes.data || []);
        setAllCourses(coursesRes.data || []);
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
      setSelectedCourseIds([]);
      return;
    }
    const batch = batches.find((b) => b._id === batchId);
    if (batch && batch.courses) {
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
    setSubmitting(true);
    try {
      await assignCoursesToBatch(selectedBatchId, selectedCourseIds);
      toast.success("Courses assigned successfully");

      const batchesRes = await getBatches();
      setBatches(batchesRes.data || []);

      const updatedBatch = batchesRes.data.find((b) => b._id === selectedBatchId);
      if (updatedBatch && updatedBatch.courses) {
        setSelectedCourseIds(updatedBatch.courses.map((c) => c._id));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Assignment failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Assign Courses to Batch</h1>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Batch
          </label>
          <select
            value={selectedBatchId}
            onChange={(e) => handleBatchChange(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose a batch --</option>
            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.name} ({batch.program || "No program"})
              </option>
            ))}
          </select>
        </div>

        {selectedBatchId && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Available Courses</h2>
              {allCourses.length === 0 ? (
                <p className="text-gray-500">No courses available.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto border rounded-lg p-3">
                  {allCourses.map((course) => (
                    <label
                      key={course._id}
                      className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCourseIds.includes(course._id)}
                        onChange={() => handleToggleCourse(course._id)}
                        className="mt-1 w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{course.title}</div>
                        {course.description && (
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {course.description}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
              >
                <FaSave /> {submitting ? "Saving..." : "Save Assignments"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}