"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaFolder,
  FaGraduationCap,
  FaClipboardCheck,
} from "react-icons/fa";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../../../service/login.service";

export default function InstructorCoursesPage() {
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    category: "",
    program: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCourses = async () => {
    setLoading(true);

    try {
      const response = await getCourses();
      const list = response.data || [];
      setCourses(list);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredCourses.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const openCourseDetail = (courseId) => {
    router.push(`/instructor/courses/${courseId}`);
  };

  // Modal handlers
  const openAddModal = () => {
    setEditingCourse(null);

    setFormData({
      title: "",
      description: "",
      coverImage: "",
      category: "",
      program: "",
    });

    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);

    setFormData({
      title: course.title || "",
      description: course.description || "",
      coverImage: course.coverImage || "",
      category: course.category || "",
      program: course.program || "",
    });

    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    setUploadingImage(true);

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target.result;
    };

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      const MAX_SIZE = 300;

      if (width > height && width > MAX_SIZE) {
        height = (height * MAX_SIZE) / width;
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width = (width * MAX_SIZE) / height;
        height = MAX_SIZE;
      }

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL(
        "image/jpeg",
        0.7
      );

      setFormData((prev) => ({
        ...prev,
        coverImage: compressedBase64,
      }));

      setUploadingImage(false);

      toast.success("Image ready");
    };

    img.onerror = () => {
      toast.error("Failed to process image");
      setUploadingImage(false);
    };

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSubmitting(true);

    try {
      if (editingCourse) {
        await updateCourse(editingCourse._id, formData);
        toast.success("Course updated");
      } else {
        await createCourse(formData);
        toast.success("Course created");
      }

      await fetchCourses();

      setModalOpen(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Operation failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Delete this course? This will also delete all modules and lessons."
      )
    )
      return;

    try {
      await deleteCourse(id);

      toast.success("Course deleted");

      await fetchCourses();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Delete failed"
      );
    }
  };

  return (
    <div className="p-6 max-sm:p-3 min-h-screen bg-gradient-to-br from-white to-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl max-sm:text-xl font-bold text-[var(--primary)]">
            My Courses
          </h1>

          <p className="text-sm max-sm:text-xs text-gray-500 mt-1">
            Manage and organize your courses
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

            <input
              type="text"
              placeholder="Search courses..."
              className="pl-9 border border-gray-300 rounded-xl px-4 py-2 text-sm max-sm:text-xs w-full focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            onClick={openAddModal}
            className="bg-[var(--primary)] hover:opacity-90 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition text-sm"
          >
            <FaPlus className="text-xs" />
            New Course
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading courses...
        </div>
      ) : paginatedCourses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center text-gray-500">
          No courses found
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-gradient-to-br from-[var(--primary)]/10 to-gray-100 border border-[var(--primary)]/20 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => openCourseDetail(course._id)}
              >
                {/* Image */}
                {course.coverImage && (
                  <div className="relative h-28 overflow-hidden">
                    <Image
                      src={course.coverImage}
                      alt={course.title}
                      fill
                      className=" object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                <div className="p-3">
                  {/* Top Section */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="text-base font-bold text-gray-800 line-clamp-1">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                        {course.description || "No description available"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div
                      className="flex items-center gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openEditModal(course)}
                        className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition flex items-center justify-center"
                        title="Edit"
                      >
                        <FaEdit className="text-xs" />
                      </button>

                      <button
                        onClick={() => handleDelete(course._id)}
                        className="w-8 h-8 rounded-lg bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                        title="Delete"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
                    {/* Category */}
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaFolder className="text-[var(--primary)] text-[10px]" />
                        <span>Category</span>
                      </div>

                      <span className="text-gray-600 font-medium">
                        {course.category || "NA"}
                      </span>
                    </div>

                    {/* Program */}
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaGraduationCap className="text-[var(--primary)] text-[10px]" />
                        <span>Program</span>
                      </div>

                      <span className="text-gray-600 font-medium">
                        {course.program || "NA"}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaClipboardCheck className="text-[var(--primary)] text-[10px]" />
                        <span>Status</span>
                      </div>

                      <span
                        className={`font-semibold ${course.isPublished
                            ? "text-green-600"
                            : "text-orange-500"
                          }`}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.max(1, p - 1)
                  )
                }
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded-lg transition text-sm ${currentPage === page
                      ? "bg-[var(--primary)] text-white"
                      : "hover:bg-gray-50"
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-sm:p-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-2xl max-sm:text-lg font-bold text-[var(--primary)] mb-5">
              {editingCourse
                ? "Edit Course"
                : "Create Course"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>

                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  />
                </div>

                {/* Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Cover Image
                  </label>

                  <div className="flex items-start gap-4 flex-wrap">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      disabled={uploadingImage}
                      className="px-4 py-2 border rounded-xl hover:bg-gray-50 text-sm"
                    >
                      {uploadingImage
                        ? "Uploading..."
                        : "Upload Image"}
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {formData.coverImage && (
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border">
                        <img
                          src={formData.coverImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Or enter a direct image URL below:
                  </p>
                </div>

                {/* Image URL */}
                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    placeholder="https://example.com/course-cover.jpg"
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  />
                </div>

                {/* Program */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Program
                  </label>

                  <input
                    type="text"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-xl hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting || uploadingImage
                  }
                  className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl hover:opacity-90 disabled:opacity-50 text-sm"
                >
                  {submitting
                    ? "Saving..."
                    : editingCourse
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}