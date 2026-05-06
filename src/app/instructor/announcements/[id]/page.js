"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  FaArrowLeft,
  FaBullhorn,
  FaEnvelope,
  FaSms,
  FaMobileAlt,
  FaLayerGroup,
} from "react-icons/fa";

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

  if (loading) {
    return (
      <div className="p-6 max-sm:p-3 min-h-screen bg-gradient-to-br from-white to-gray-100">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center text-gray-500">
          Loading announcement...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-sm:p-3 min-h-screen bg-gradient-to-br from-white to-gray-100">
        <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {typeof error === "string"
            ? error
            : error?.message || JSON.stringify(error)}
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="p-6 max-sm:p-3 min-h-screen bg-gradient-to-br from-white to-gray-100">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center text-red-500">
          Announcement not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-sm:p-3 min-h-screen bg-gradient-to-br from-white to-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl max-sm:text-xl font-bold text-[var(--primary)]">
            Announcement Details
          </h1>

          <p className="text-sm max-sm:text-xs text-gray-500 mt-1">
            View complete announcement information
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="bg-[var(--primary)] hover:opacity-90 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition text-sm"
        >
          <FaArrowLeft className="text-xs" />
          Back
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Top Section */}
        <div className="bg-gradient-to-r from-[var(--primary)]/10 to-gray-100 border-b border-gray-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl max-sm:text-lg font-bold text-gray-800">
                {announcement.title}
              </h2>

              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                {announcement.message}
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
              <FaBullhorn className="text-[var(--primary)] text-xl" />
            </div>
          </div>

          {/* Channels */}
          <div className="flex flex-wrap gap-2 mt-5">
            {announcement.channels?.inApp && (
              <span className="flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-2 rounded-xl text-xs font-medium">
                <FaMobileAlt className="text-[11px]" />
                In-App
              </span>
            )}

            {announcement.channels?.email && (
              <span className="flex items-center gap-2 bg-green-100 text-green-600 px-3 py-2 rounded-xl text-xs font-medium">
                <FaEnvelope className="text-[11px]" />
                Email
              </span>
            )}

            {announcement.channels?.sms && (
              <span className="flex items-center gap-2 bg-purple-100 text-purple-600 px-3 py-2 rounded-xl text-xs font-medium">
                <FaSms className="text-[11px]" />
                SMS
              </span>
            )}
          </div>
        </div>

        {/* Batches */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <FaLayerGroup className="text-[var(--primary)]" />

            <h3 className="text-lg font-bold text-gray-800">
              Assigned Batches
            </h3>
          </div>

          {batches?.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500">
              No batches found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {batches?.map((b) => (
                <div
                  key={b._id}
                  className="bg-gradient-to-br from-[var(--primary)]/5 to-gray-50 border border-[var(--primary)]/10 rounded-xl p-4 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                      <FaLayerGroup className="text-[var(--primary)] text-sm" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 line-clamp-1">
                        {b.name || b.title || "Unnamed Batch"}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Batch ID: {b._id}
                      </p>
                    </div>
                  </div>
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