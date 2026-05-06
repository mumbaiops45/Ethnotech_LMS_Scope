"use client";

import React, { useEffect, useState } from "react";
import CreateLiveclass from "../../components/createLiveclass";
import { useLiveSession } from "../../../../hooks/useLiveSession";
import { useRouter } from "next/navigation";

import {
  FaPlus,
  FaVideo,
  FaClock,
  FaCalendarAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaBan,
} from "react-icons/fa";

const Page = () => {

  const [showCreate, setShowCreate] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const router = useRouter();

  const {
    sessions,
    loading,
    error,
    fetchSessions,
    updateSession,
    cancelSession,
    deleteSession,
  } = useLiveSession();

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-6 max-sm:p-3 min-h-screen bg-gradient-to-br from-white to-gray-100">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">

        <div>
          <h1 className="text-3xl max-sm:text-xl font-bold text-[var(--primary)]">
            Live Classes
          </h1>

          <p className="text-sm max-sm:text-xs text-gray-500 mt-1">
            Manage and organize live sessions
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-[var(--primary)] hover:opacity-90 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition text-sm"
        >
          <FaPlus className="text-xs" />
          Create Live Class
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading sessions...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
          {typeof error === "string"
            ? error
            : error?.message || JSON.stringify(error)}
        </div>
      )}

      {/* SESSIONS */}
      {!loading && sessions?.length > 0 ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

          {sessions.map((session) => {

            const safeDate = session?.scheduledAt
              ? new Date(session.scheduledAt).toLocaleString()
              : "No date";

            return (
              <div
                key={session._id}
                className="bg-gradient-to-br from-[var(--primary)]/10 to-gray-100 border border-[var(--primary)]/20 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >

                <div className="p-4">

                  {/* TOP */}
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex-1 min-w-0">

                      <h2 className="text-base font-bold text-gray-800 line-clamp-1">
                        {session.title}
                      </h2>

                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                        {session.topic || "No topic available"}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2 shrink-0">

                      {/* VIEW */}
                      <button
                        onClick={() =>
                          router.push(
                            `/instructor/live-sessions/${session._id}`
                          )
                        }
                        className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition flex items-center justify-center"
                      >
                        <FaEye className="text-xs" />
                      </button>

                      {/* EDIT */}
                      <button
                        onClick={() => {
                          setEditData(session);
                          setIsEditOpen(true);
                        }}
                        className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition flex items-center justify-center"
                      >
                        <FaEdit className="text-xs" />
                      </button>

                      {/* DELETE / CANCEL */}
                      {session.status === "cancelled" ? (
                        <button
                          onClick={async () => {
                            const ok = confirm(
                              "Delete this session?"
                            );

                            if (!ok) return;

                            await deleteSession(session._id);

                            fetchSessions();
                          }}
                          className="w-8 h-8 rounded-lg bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            const ok = confirm(
                              "Cancel this session?"
                            );

                            if (!ok) return;

                            await cancelSession(session._id);

                            fetchSessions();
                          }}
                          className="w-8 h-8 rounded-lg bg-orange-100 text-orange-500 hover:bg-orange-500 hover:text-white transition flex items-center justify-center"
                        >
                          <FaBan className="text-xs" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">

                    {/* DATE */}
                    <div className="flex items-center justify-between text-[11px]">

                      <div className="flex items-center gap-2 text-gray-700">
                        <FaCalendarAlt className="text-[var(--primary)] text-[10px]" />
                        <span>Date</span>
                      </div>

                      <span className="text-gray-600 font-medium text-right">
                        {safeDate}
                      </span>
                    </div>

                    {/* DURATION */}
                    <div className="flex items-center justify-between text-[11px]">

                      <div className="flex items-center gap-2 text-gray-700">
                        <FaClock className="text-[var(--primary)] text-[10px]" />
                        <span>Duration</span>
                      </div>

                      <span className="text-gray-600 font-medium">
                        {session.duration || 0} min
                      </span>
                    </div>

                    {/* STATUS */}
                    <div className="flex items-center justify-between text-[11px]">

                      <div className="flex items-center gap-2 text-gray-700">
                        <FaVideo className="text-[var(--primary)] text-[10px]" />
                        <span>Status</span>
                      </div>

                      <span
                        className={`font-semibold ${
                          session.status === "completed"
                            ? "text-green-600"
                            : session.status === "cancelled"
                            ? "text-red-500"
                            : "text-orange-500"
                        }`}
                      >
                        {session.status || "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      ) : (
        !loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center text-gray-500">
            No live sessions found
          </div>
        )
      )}

      {/* EDIT MODAL */}
      {isEditOpen && editData && (

        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">

            {/* HEADER */}
            <div className="flex items-center justify-between p-5 border-b">

              <h2 className="text-xl font-bold text-[var(--primary)]">
                Update Session
              </h2>

              <button
                onClick={() => setIsEditOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-5 space-y-4">

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Title
                </p>

                <input
                  className="border border-gray-200 rounded-xl w-full p-3 text-sm outline-none focus:border-[var(--primary)]"
                  value={editData.title || ""}
                  onChange={(e) =>
                    handleEditChange(
                      "title",
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Topic
                </p>

                <input
                  className="border border-gray-200 rounded-xl w-full p-3 text-sm outline-none focus:border-[var(--primary)]"
                  value={editData.topic || ""}
                  onChange={(e) =>
                    handleEditChange(
                      "topic",
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Duration
                </p>

                <input
                  className="border border-gray-200 rounded-xl w-full p-3 text-sm outline-none focus:border-[var(--primary)]"
                  value={editData.duration || ""}
                  onChange={(e) =>
                    handleEditChange(
                      "duration",
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Description
                </p>

                <textarea
                  rows={4}
                  className="border border-gray-200 rounded-xl w-full p-3 text-sm outline-none focus:border-[var(--primary)]"
                  value={editData.description || ""}
                  onChange={(e) =>
                    handleEditChange(
                      "description",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Date
                  </p>

                  <input
                    type="date"
                    className="border border-gray-200 rounded-xl w-full p-3 text-sm outline-none focus:border-[var(--primary)]"
                    value={
                      editData.scheduledAt
                        ? editData.scheduledAt.split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleEditChange(
                        "scheduledAt",
                        new Date(
                          e.target.value + "T00:00:00"
                        ).toISOString()
                      )
                    }
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Time
                  </p>

                  <input
                    type="time"
                    className="border border-gray-200 rounded-xl w-full p-3 text-sm outline-none focus:border-[var(--primary)]"
                    value={
                      editData.scheduledAt
                        ? editData.scheduledAt.substring(11, 16)
                        : ""
                    }
                    onChange={(e) => {

                      const datePart = editData.scheduledAt
                        ? editData.scheduledAt.split("T")[0]
                        : new Date()
                            .toISOString()
                            .split("T")[0];

                      handleEditChange(
                        "scheduledAt",
                        new Date(
                          `${datePart}T${e.target.value}`
                        ).toISOString()
                      );
                    }}
                  />
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3 pt-2">

                <button
                  className="px-4 py-2 rounded-xl bg-gray-200 text-sm hover:bg-gray-300"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm hover:opacity-90"
                  onClick={async () => {

                    await updateSession(
                      editData._id,
                      editData
                    );

                    setIsEditOpen(false);

                    fetchSessions();
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreate && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">

            {/* HEADER */}
            <div className="flex items-center justify-between p-5 border-b">

              <h2 className="text-xl font-bold text-[var(--primary)]">
                Create Live Class
              </h2>

              <button
                onClick={() => setShowCreate(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <div className="p-5">

              <CreateLiveclass
                onSuccess={() => {
                  setShowCreate(false);
                  fetchSessions();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;