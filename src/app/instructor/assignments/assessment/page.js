"use client";

import React, { useEffect, useState } from "react";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaClipboardCheck,
  FaCalendarAlt,
  FaCheckCircle,
  FaAward,
  FaUpload,
} from "react-icons/fa";

import { useAssessment } from "../../../../../hooks/useAssessment";

import AssessmentForm from "../../createAssessment";

const cardColors = [
  "from-blue-100 to-blue-50 border-blue-200",
  "from-green-100 to-green-50 border-green-200",
  "from-purple-100 to-purple-50 border-purple-200",
  "from-orange-100 to-orange-50 border-orange-200",
  "from-pink-100 to-pink-50 border-pink-200",
  "from-cyan-100 to-cyan-50 border-cyan-200",
];

export default function AssessmentsPage() {

  const {
    assessments,
    loading,
    error,
    fetchAssessments,
    deleteAssessment,
    publishAssessment,
  } = useAssessment();

  const [editingAssessment, setEditingAssessment] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 9;

  useEffect(() => {
    fetchAssessments();
  }, []);

  const filteredAssessments =
    assessments.filter((assessment) =>
      assessment.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(
    filteredAssessments.length /
    itemsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const paginatedAssessments =
    filteredAssessments.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (
    id,
    title
  ) => {

    const ok = confirm(
      `Delete "${title}" assessment?`
    );

    if (!ok) return;

    try {
      await deleteAssessment(id);

      fetchAssessments();
    } catch (err) {
      alert(
        "Delete failed: " +
        err.message
      );
    }
  };

  const handlePublish = async (
    id,
    title
  ) => {

    const ok = confirm(
      `Publish "${title}"? Students will be able to take it.`
    );

    if (!ok) return;

    try {
      await publishAssessment(id);

      alert(
        "Assessment published!"
      );

      fetchAssessments();
    } catch (err) {
      alert(
        "Publish failed: " +
        err.message
      );
    }
  };

  return (
    <div className="p-6 max-sm:p-3 min-h-screen bg-gradient-to-br from-white to-gray-100">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">

        <div>
          <h1 className="text-3xl max-sm:text-xl font-bold text-[var(--primary)]">
            Assessments
          </h1>

          <p className="text-sm max-sm:text-xs text-gray-500 mt-1">
            Manage and organize assessments
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

          {/* SEARCH */}
          <div className="relative w-full sm:w-64">

            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

            <input
              type="text"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              className="pl-9 border border-gray-300 rounded-xl px-4 py-2 text-sm max-sm:text-xs w-full focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={() => {
              setEditingAssessment(
                null
              );

              setShowForm(true);
            }}
            className="bg-[var(--primary)] hover:opacity-90 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition text-sm"
          >
            <FaPlus className="text-xs" />
            New Assessment
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading assessments...
        </div>
      ) : error ? (

        /* ERROR */
        <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
          {typeof error === "string"
            ? error
            : error?.message ||
            JSON.stringify(
              error
            )}
        </div>

      ) : paginatedAssessments.length ===
        0 ? (

        /* EMPTY */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center text-gray-500">
          No assessments found
        </div>

      ) : (
        <>
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

            {paginatedAssessments.map(
              (
                assessment,
                index
              ) => {

                const cardStyle =
                  cardColors[
                  index %
                  cardColors.length
                  ];

                const deadlineDate =
                  new Date(
                    assessment.deadline
                  );

                const isOverdue =
                  deadlineDate <
                  new Date();

                const formattedDeadline =
                  deadlineDate.toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  );

                return (
                  <div
                    key={assessment._id}
                    className={`bg-gradient-to-br ${cardStyle} rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border flex flex-col h-full`}
                  >
                    <div className="p-4 flex flex-col flex-1">

                      {/* TOP */}
                      <div className="flex items-start justify-between gap-3">

                        <div className="flex-1 min-w-0">

                          <h2 className="text-base font-bold text-gray-800 line-clamp-1">
                            {
                              assessment.title
                            }
                          </h2>

                          <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                            {assessment.description ||
                              "No description available"}
                          </p>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-2 shrink-0">

                          {/* EDIT */}
                          <button
                            onClick={() => {

                              setEditingAssessment(
                                assessment
                              );

                              setShowForm(
                                true
                              );
                            }}
                            className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition flex items-center justify-center"
                          >
                            <FaEdit className="text-xs" />
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              handleDelete(
                                assessment._id,
                                assessment.title
                              )
                            }
                            className="w-8 h-8 rounded-lg bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>

                      {/* DETAILS */}
                      <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">

                        {/* TYPE */}
                        <div className="flex items-center justify-between text-[11px]">

                          <div className="flex items-center gap-2 text-gray-700">
                            <FaClipboardCheck className="text-[var(--primary)] text-[10px]" />
                            <span>
                              Type
                            </span>
                          </div>

                          <span
                            className={`font-semibold ${assessment.type ===
                                "descriptive"
                                ? "text-purple-600"
                                : assessment.type ===
                                  "quiz"
                                  ? "text-green-600"
                                  : "text-orange-500"
                              }`}
                          >
                            {assessment.type ||
                              "General"}
                          </span>
                        </div>

                        {/* TOTAL MARKS */}
                        <div className="flex items-center justify-between text-[11px]">

                          <div className="flex items-center gap-2 text-gray-700">
                            <FaAward className="text-[var(--primary)] text-[10px]" />
                            <span>
                              Total Marks
                            </span>
                          </div>

                          <span className="text-gray-600 font-medium">
                            {assessment.totalMarks ||
                              0}
                          </span>
                        </div>

                        {/* PASSING */}
                        <div className="flex items-center justify-between text-[11px]">

                          <div className="flex items-center gap-2 text-gray-700">
                            <FaCheckCircle className="text-[var(--primary)] text-[10px]" />
                            <span>
                              Passing
                            </span>
                          </div>

                          <span className="text-gray-600 font-medium">
                            {
                              assessment.passingPercent
                            }
                            %
                          </span>
                        </div>

                        {/* STATUS */}
                        <div className="flex items-center justify-between text-[11px]">

                          <div className="flex items-center gap-2 text-gray-700">
                            <FaUpload className="text-[var(--primary)] text-[10px]" />
                            <span>
                              Status
                            </span>
                          </div>

                          <span
                            className={`font-semibold ${assessment.isPublished
                                ? "text-green-600"
                                : "text-orange-500"
                              }`}
                          >
                            {assessment.isPublished
                              ? "Published"
                              : "Draft"}
                          </span>
                        </div>

                        {/* DEADLINE */}
                        <div className="flex items-center justify-between text-[11px]">

                          <div className="flex items-center gap-2 text-gray-700">
                            <FaCalendarAlt className="text-[var(--primary)] text-[10px]" />
                            <span>
                              Deadline
                            </span>
                          </div>

                          <div className="text-right">
                            <span
                              className={`font-medium ${isOverdue
                                  ? "text-red-500"
                                  : "text-gray-600"
                                }`}
                            >
                              {
                                formattedDeadline
                              }
                            </span>

                            {isOverdue && (
                              <p className="text-[10px] text-red-500">
                                Overdue
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* FOOTER ACTION */}
                    
                      <div className="mt-auto pt-3 border-t border-gray-200">
                        {!assessment.isPublished ? (
                          <button
                            onClick={() =>
                              handlePublish(
                                assessment._id,
                                assessment.title
                              )
                            }
                            className="w-full py-2 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/80 transition text-sm font-medium"
                          >
                            Publish Assessment
                          </button>
                        ) : (
                          <div className="w-full py-2 rounded-xl bg-green-100 text-green-700 text-center text-sm font-medium">
                            Published
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.max(
                      1,
                      p - 1
                    )
                  )
                }
                disabled={
                  currentPage === 1
                }
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm"
              >
                Previous
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }
                  className={`px-3 py-1 border rounded-lg transition text-sm ${currentPage ===
                      page
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
                    Math.min(
                      totalPages,
                      p + 1
                    )
                  )
                }
                disabled={
                  currentPage ===
                  totalPages
                }
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* MODAL */}
      {showForm && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative">

            {/* HEADER */}
            <div className="flex items-center justify-between p-5 border-b">

              <h2 className="text-xl font-bold text-[var(--primary)]">
                {editingAssessment
                  ? "Update Assessment"
                  : "Create Assessment"}
              </h2>

              <button
                onClick={() => {
                  setShowForm(
                    false
                  );

                  setEditingAssessment(
                    null
                  );
                }}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <div className="p-5">

              <AssessmentForm
                initialData={
                  editingAssessment
                }
                onClose={() => {
                  setShowForm(
                    false
                  );

                  setEditingAssessment(
                    null
                  );
                }}
                onSuccess={() => {

                  setShowForm(
                    false
                  );

                  setEditingAssessment(
                    null
                  );

                  fetchAssessments();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} ''