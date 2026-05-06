"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAnnouncements } from "../../../../../hooks/useAnnouncement";
import { useInstructor } from "../../../../../hooks/useInstructor";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const { announcements, loading, error } = useAnnouncements();
  const { batches, fetchBatches } = useInstructor();

  
  useEffect(() => {
    fetchBatches();
  }, []);

  const announcement = announcements?.find((a) => a._id === id);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (!announcement) {
    return <p className="text-center text-red-500">Announcement not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-6">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800">
          {announcement.title}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mt-4">
          {announcement.message}
        </p>

        {/* Channels */}
        <div className="flex gap-3 mt-4">
          {announcement.channels?.inApp && (
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
              In-App
            </span>
          )}
          {announcement.channels?.email && (
            <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
              Email
            </span>
          )}
          {announcement.channels?.sms && (
            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded">
              SMS
            </span>
          )}
        </div>

        {/* 🔥 BATCHES SECTION */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Batches
          </h2>

          {batches?.length === 0 ? (
            <p className="text-gray-500">No batches found</p>
          ) : (
            <div className="space-y-2">
              {batches?.map((b) => (
                <div
                  key={b._id}
                  className="p-3 bg-gray-50 border rounded-lg"
                >
                  <p className="font-medium text-gray-700">
                    {b.name || b.title || "Unnamed Batch"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Page;