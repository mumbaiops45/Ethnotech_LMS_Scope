"use client"
import React, { useEffect, useState } from 'react';
import CreateLiveclass from '../../components/createLiveclass';
import { useLiveSession } from '../../../../hooks/useLiveSession';

const Page = () => {
  const [showCreate, setShowCreate] = useState(false);

  const {
    sessions,
    singleSession,
    loading,
    error,
    fetchSessions,
    fetchSingleSession,
    updateSession,
    deleteSession
  } = useLiveSession();

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div>

      <button
        className='bg-violet-500 text-white px-4 py-2'
        onClick={() => setShowCreate(prev => !prev)}
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


      <h3 className='mt-4 font-bold'>Live Sessions</h3>

      {loading && <p>Loading...</p>}

      
      {error && (
        <p className="text-red-500">
          {typeof error === "string"
            ? error
            : error?.message || JSON.stringify(error)}
        </p>
      )}
{sessions?.scheduledAt
  ? new Date(sessions.scheduledAt).toLocaleString()
  : "No date"}
      {sessions?.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
    {sessions.map((session) => (
      <div
        key={session._id}
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 p-4 flex flex-col justify-between"
      >
        {/* Header */}
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {session.title}
            </h2>

            {/* Status badge */}
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                session.status === "cancelled"
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
            {session.topic}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            📅 {new Date(session.date).toLocaleString()}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            ⏱ Duration: {session.duration} min
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => fetchSingleSession(session._id)}
            className="px-3 py-1 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            View
          </button>

          <button
            onClick={async () => {
              await updateSession(session._id, {
                title: session.title + " ✨ Updated"
              });
              fetchSessions();
            }}
            className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            Update
          </button>

          <button
            onClick={async () => {
              const ok = confirm("Delete this session?");
              if (!ok) return;
              await deleteSession(session._id);
              fetchSessions();
            }}
            className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
  !loading && (
    <p className="text-gray-500 mt-4">No sessions found</p>
  )
)}


      {singleSession && (
        <div className="border p-4 mt-6 bg-gray-100">
          <h3 className="font-bold">Session Details</h3>

          <p><strong>Title:</strong> {singleSession.title}</p>
          <p><strong>Topic:</strong> {singleSession.topic}</p>
          <p><strong>Description:</strong> {singleSession.description}</p>


          {singleSession.recordingUrl ? (
            <video width="400" controls className="mt-2">
              <source src={singleSession.recordingUrl} type="video/mp4" />
            </video>
          ) : (
            <p className="mt-2 text-gray-500">No recording available</p>
          )}


          <button
            className="bg-blue-600 text-white px-3 py-1 mt-3 mr-2"
            onClick={async () => {
              await updateSession(singleSession._id, {
                title: singleSession.title + " (Updated)"
              });
              fetchSessions();
              fetchSingleSession(singleSession._id);
            }}
          >
            Update
          </button>


          <button
            className="bg-red-600 text-white px-3 py-1 mt-3"
            onClick={async () => {
              const confirmDelete = confirm("Delete this session?");
              if (!confirmDelete) return;

              await deleteSession(singleSession._id);
              fetchSessions();
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;