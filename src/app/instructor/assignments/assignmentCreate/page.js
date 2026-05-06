"use client";

import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaClipboardList,
  FaCalendarAlt,
  FaCheckCircle,
  FaAward,
} from "react-icons/fa";

import { useAssignmentStore } from "../../../../../store/assignmentCreate.store";
import AssignmentForm from "../../createAssignment";

const cardColors = [
  "from-blue-100 to-blue-50 border-blue-200",
  "from-green-100 to-green-50 border-green-200",
  "from-purple-100 to-purple-50 border-purple-200",
  "from-orange-100 to-orange-50 border-orange-200",
  "from-pink-100 to-pink-50 border-pink-200",
  "from-cyan-100 to-cyan-50 border-cyan-200",
];

export default function AssignmentsPage() {

  const {
    assignments,
    loading,
    error,
    fetchAssignments,
    deleteAssignment,
  } = useAssignmentStore();

  const [editingAssignment, setEditingAssignment] =
    useState(null);

  const [showForm, setShowForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  useEffect(() => {
    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredAssignments.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedAssignments =
    filteredAssignments.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (id, title) => {

    const ok = confirm(
      `Delete "${title}" assignment?`
    );

    if (!ok) return;

    try {
      await deleteAssignment(id);

      fetchAssignments();
    } catch (err) {
      alert(
        "Delete failed: " + err.message
      );
    }
  };

  return (
    <div className="p-6 max-sm:p-3 min-h-screen bg-gradient-to-br from-white to-gray-100">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">

        <div>
          <h1 className="text-3xl max-sm:text-xl font-bold text-[var(--primary)]">
            Assignments
          </h1>

          <p className="text-sm max-sm:text-xs text-gray-500 mt-1">
            Manage and organize assignments
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

          {/* SEARCH */}
          <div className="relative w-full sm:w-64">

            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="pl-9 border border-gray-300 rounded-xl px-4 py-2 text-sm max-sm:text-xs w-full focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={() => {
              setEditingAssignment(null);
              setShowForm(true);
            }}
            className="bg-[var(--primary)] hover:opacity-90 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition text-sm"
          >
            <FaPlus className="text-xs" />
            New Assignment
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading assignments...
        </div>
      ) : error ? (

        /* ERROR */
        <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
          {typeof error === "string"
            ? error
            : error?.message ||
            JSON.stringify(error)}
        </div>

      ) : paginatedAssignments.length === 0 ? (

        /* EMPTY */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center text-gray-500">
          No assignments found
        </div>

      ) : (
        <>
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

            {paginatedAssignments.map(
              (assignment, index) => {

                const cardStyle =
                  cardColors[
                  index % cardColors.length
                  ];

                const deadlineDate =
                  new Date(
                    assignment.deadline
                  );

                const isOverdue =
                  deadlineDate < new Date();

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
                    key={assignment._id}
                    className={`bg-gradient-to-br ${cardStyle} rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border`}
                  >

                    <div className="p-4">

                      {/* TOP */}
                      <div className="flex items-start justify-between gap-3">

                        <div className="flex-1 min-w-0">

                          <h2 className="text-base font-bold text-gray-800 line-clamp-1">
                            {assignment.title}
                          </h2>

                          <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                            {assignment.description ||
                              "No description available"}
                          </p>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-2 shrink-0">

                          {/* EDIT */}
                          <button
                            onClick={() => {
                              setEditingAssignment(
                                assignment
                              );

                              setShowForm(true);
                            }}
                            className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition flex items-center justify-center"
                          >
                            <FaEdit className="text-xs" />
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              handleDelete(
                                assignment._id,
                                assignment.title
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
                            <FaClipboardList className="text-[var(--primary)] text-[10px]" />
                            <span>Type</span>
                          </div>

                          <span
                            className={`font-semibold ${assignment.type ===
                              "descriptive"
                              ? "text-purple-600"
                              : assignment.type ===
                                "quiz"
                                ? "text-green-600"
                                : "text-orange-500"
                              }`}
                          >
                            {assignment.type ||
                              "General"}
                          </span>
                        </div>

                        {/* TOTAL MARKS */}
                        <div className="flex items-center justify-between text-[11px]">

                          <div className="flex items-center gap-2 text-gray-700">
                            <FaAward className="text-[var(--primary)] text-[10px]" />
                            <span>Total Marks</span>
                          </div>

                          <span className="text-gray-600 font-medium">
                            {assignment.totalMarks ||
                              0}
                          </span>
                        </div>

                        {/* PASSING */}
                        <div className="flex items-center justify-between text-[11px]">

                          <div className="flex items-center gap-2 text-gray-700">
                            <FaCheckCircle className="text-[var(--primary)] text-[10px]" />
                            <span>Passing</span>
                          </div>

                          <span className="text-gray-600 font-medium">
                            {assignment.passingMarks ||
                              0}
                          </span>
                        </div>

                        {/* DEADLINE */}
                        <div className="flex items-center justify-between text-[11px]">

                          <div className="flex items-center gap-2 text-gray-700">
                            <FaCalendarAlt className="text-[var(--primary)] text-[10px]" />
                            <span>Deadline</span>
                          </div>

                          <div className="text-right">
                            <span
                              className={`font-medium ${isOverdue
                                ? "text-red-500"
                                : "text-gray-600"
                                }`}
                            >
                              {formattedDeadline}
                            </span>

                            {isOverdue && (
                              <p className="text-[10px] text-red-500">
                                Overdue
                              </p>
                            )}
                          </div>
                        </div>
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
                  onClick={() =>
                    setCurrentPage(page)
                  }
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
                    Math.min(
                      totalPages,
                      p + 1
                    )
                  )
                }
                disabled={
                  currentPage === totalPages
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

          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">

            {/* HEADER */}
            <div className="flex items-center justify-between p-5 border-b">

              <h2 className="text-xl font-bold text-[var(--primary)]">
                {editingAssignment
                  ? "Update Assignment"
                  : "Create Assignment"}
              </h2>

              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingAssignment(null);
                }}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <div className="p-5">

              <AssignmentForm
                initialData={
                  editingAssignment
                }
                onClose={() => {
                  setShowForm(false);
                  setEditingAssignment(
                    null
                  );
                }}
                onSuccess={() => {
                  setShowForm(false);

                  setEditingAssignment(
                    null
                  );

                  fetchAssignments();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}