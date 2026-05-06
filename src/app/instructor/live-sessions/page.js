"use client";

import React, { useEffect, useState } from "react";
import CreateLiveclass from "../../components/createLiveclass";
import { useLiveSession } from "../../../../hooks/useLiveSession";
import { useRouter } from "next/navigation";

const Page = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const router = useRouter();

  const {
    sessions,
    singleSession,
    loading,
    error,
    fetchSessions,
    fetchSingleSession,
    updateSession,
    cancelSession,
    deleteSession,
  } = useLiveSession();

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleEditChange = (field , value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-4">

      <button
        className="bg-violet-500 text-white px-4 py-2 rounded"
        onClick={() => setShowCreate((prev) => !prev)}
      >
        {showCreate ? "Close" : "Create Live Class"}
      </button>


      {showCreate && (
        <CreateLiveclass
          onSuccess={() => {
            setShowCreate(false);
            fetchSessions();
          }}
        />
      )}

      <h3 className="mt-6 font-bold text-lg">Live Sessions</h3>

      {loading && <p className="text-gray-500">Loading...</p>}

      {error && (
        <p className="text-red-500">
          {typeof error === "string"
            ? error
            : error?.message || JSON.stringify(error)}
        </p>
      )}

      {sessions?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

          {sessions.map((session) => {
            const safeDate = session?.scheduledAt
              ? new Date(session.scheduledAt).toLocaleString()
              : "No date";

            return (
              <div
                key={session._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition border p-4 flex flex-col justify-between"
              >

                <div>
                  <div className="flex justify-between items-start gap-2">

                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {session.title}
                    </h2>

                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${session.status === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : session.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                        }`}
                    >
                      {session.status || "active"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    {session.topic || "No topic"}
                  </p>


                  <p className="text-xs text-gray-400 mt-2">
                    📅 {safeDate}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    ⏱ Duration: {session.duration || 0} min
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">

                  <button
                    onClick={() => router.push(`/instructor/live-sessions/${session._id}`)}
                    className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      setEditData(session);
                      setIsEditOpen(true);
                    }}
                    className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Update
                  </button>  

                 {session.status === "cancelled" ? (
                  <button
                    onClick={async () => {
                      const ok = confirm("Delete this session?");
                      if (!ok) return;
                      await deleteSession(session._id);
                      fetchSessions();
                    }}
                    className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                 ): (
                  <button
                    onClick={async () => {
                      const ok = confirm("Delete this session?");
                      if (!ok) return;
                      await cancelSession(session._id);
                      fetchSessions();
                    }}
                    className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Cancel
                  </button>
)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !loading && (
          <p className="text-gray-500 mt-4">No sessions found</p>
        )
      )}

      {isEditOpen && editData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[420px]">

            <h2 className="text-lg font-bold mb-4">
              Update Session
            </h2>

            <input
              className="border w-full p-2 mb-3"
              value={editData.title || ""}
              onChange={(e) =>
                handleEditChange(
                 "title" ,  e.target.value)
              }
            />
            <input
              className="border w-full p-2 mb-3"
              value={editData.topic || ""}
              onChange={(e) =>
                handleEditChange(
                
                  "topic", e.target.value,
                )
              }
            />
            <input
              className="border w-full p-2 mb-3"
              value={editData.duration || ""}
              onChange={(e) =>
                handleEditChange(
                 "duration", e.target.value,
                )
              }
            />
            <input
              className="border w-full p-2 mb-3"
              value={editData.description || ""}
              onChange={(e) =>
                handleEditChange(
                  "description" , e.target.value,
                )
              }
            />

            <input type="date"
              className="border w-full p-2 mb-3"
              value={editData.scheduledAt ? editData.scheduledAt.split("T")[0] : ""}
              onChange={(e) =>
                handleEditChange(
                  "scheduledAt" , new Date(
                    e.target.value + "T00:00:00"
                  ).toISOString(),
                )
              }
            />

            <input type="time"
              className="border w-full p-2 mb-3"
              value={editData.scheduledAt ? editData.scheduledAt.substring(11, 16) : ""}
              onChange={(e) => {
                const datePart = editData.scheduledAt
                  ? editData.scheduledAt.split("T")[0]
                  : new Date().toISOString().split("T")[0];

                handleEditChange(
                  "scheduledAt" , new Date(
                    `${datePart}T${e.target.value}`
                  ).toISOString(),
                );
              }}
            />
            <div className="flex justify-end gap-2">

              <button
                className="px-3 py-1 bg-gray-300"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-blue-600 text-white"
                onClick={async () => {
                  await updateSession(editData._id, editData);
                  setIsEditOpen(false);
                  fetchSessions();
                }}
              >
                Save
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;