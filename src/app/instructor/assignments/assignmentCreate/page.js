"use client";
import React, { useEffect, useState } from "react";
import { useAssignmentStore } from "../../../../../store/assignmentCreate.store";
import AssignmentForm from "../../createAssignment";

export default function AssignmentsPage() {
  const { assignments, loading, error, fetchAssignments, deleteAssignment } = useAssignmentStore();
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      try {
        await deleteAssignment(id);
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  if (loading && assignments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-600 text-center">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📚 Assignments</h1>
        <button
          onClick={() => {
            setEditingAssignment(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Assignment
        </button>
      </div>

      {showForm && (
        <AssignmentForm
          initialData={editingAssignment}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            setEditingAssignment(null);
            fetchAssignments();
          }}
        />
      )}

      {assignments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">No assignments yet. Click "New Assignment" to create one.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => {
            const deadlineDate = new Date(assignment.deadline);
            const isOverdue = deadlineDate < new Date();
            const formattedDeadline = deadlineDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={assignment._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-5 border border-gray-100"
              >
                <div className="flex justify-between items-start gap-2">
                  <h2 className="text-xl font-bold text-gray-800 flex-1 line-clamp-2">
                    {assignment.title}
                  </h2>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      assignment.type === "descriptive"
                        ? "bg-purple-100 text-purple-700"
                        : assignment.type === "quiz"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {assignment.type}
                  </span>
                </div>

                <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                  {assignment.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                    📊 {assignment.totalMarks} pts
                  </div>
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                    🎯 Pass {assignment.passingMarks}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div
                    className={`text-sm flex items-center gap-1 ${
                      isOverdue ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    <span>📅</span>
                    <span>Due {formattedDeadline}</span>
                    {isOverdue && (
                      <span className="ml-1 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                        Overdue
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-5 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setEditingAssignment(assignment);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(assignment._id, assignment.title)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}