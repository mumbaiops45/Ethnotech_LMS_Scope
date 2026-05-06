"use client";

import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaBullhorn,
  FaEnvelope,
  FaSms,
  FaMobileAlt,
  FaTimes,
} from "react-icons/fa";

import { useAnnouncements } from "../../../../hooks/useAnnouncement";
import { useCreateAnnouncement } from "../../../../hooks/useAnnouncement";
import { useInstructor } from "../../../../hooks/useInstructor";

import { useRouter } from "next/navigation";

const cardColors = [
  "from-blue-100 to-blue-50 border-blue-200",
  "from-green-100 to-green-50 border-green-200",
  "from-purple-100 to-purple-50 border-purple-200",
  "from-orange-100 to-orange-50 border-orange-200",
  "from-pink-100 to-pink-50 border-pink-200",
  "from-cyan-100 to-cyan-50 border-cyan-200",
];


const Page = () => {
  const router = useRouter();

  const { announcements, loading, error } = useAnnouncements();

  const {
    createAnnouncement,
    loading: createLoading,
    error: createError,
  } = useCreateAnnouncement();

  const { batches, fetchBatches } = useInstructor();

  const [showCreate, setShowCreate] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetType: "batch",
    batch: "",
    channels: {
      inApp: true,
      email: false,
      sms: false,
    },
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChannelChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createAnnouncement(formData);

    setFormData({
      title: "",
      message: "",
      targetType: "batch",
      batch: "",
      channels: {
        inApp: true,
        email: false,
        sms: false,
      },
    });

    setShowCreate(false);
  };

  return (
    <div className="p-6 max-sm:p-3 min-h-screen bg-gradient-to-br from-white to-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl max-sm:text-xl font-bold text-[var(--primary)]">
            Announcements
          </h1>

          <p className="text-sm max-sm:text-xs text-gray-500 mt-1">
            Manage and publish announcements for students
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-[var(--primary)] hover:opacity-90 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition text-sm"
        >
          <FaPlus className="text-xs" />
          Create Announcement
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading announcements...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
          {typeof error === "string"
            ? error
            : error?.message || JSON.stringify(error)}
        </div>
      )}

      {/* Announcement List */}
      {!loading && announcements?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
  {announcements.map((a, index) => {
    const colorClass =
      cardColors[index % cardColors.length];

    return (
      <div
        key={a._id}
        onClick={() =>
          router.push(`/instructor/announcements/${a._id}`)
        }
        className={`bg-gradient-to-br ${colorClass} rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border`}
      >
        <div className="p-4">
          {/* Top */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-gray-800 line-clamp-1">
                {a.title}
              </h2>

              <p className="text-[11px] text-gray-600 mt-1 line-clamp-3">
                {a.message}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
              <FaBullhorn className="text-gray-700 text-sm" />
            </div>
          </div>

          {/* Channels */}
          <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-3">
            {a.channels?.inApp && (
              <span className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-[11px] font-medium">
                <FaMobileAlt className="text-[10px]" />
                In-App
              </span>
            )}

            {a.channels?.email && (
              <span className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-lg text-[11px] font-medium">
                <FaEnvelope className="text-[10px]" />
                Email
              </span>
            )}

            {a.channels?.sms && (
              <span className="flex items-center gap-1 bg-purple-100 text-purple-600 px-2 py-1 rounded-lg text-[11px] font-medium">
                <FaSms className="text-[10px]" />
                SMS
              </span>
            )}
          </div>
        </div>
      </div>
    );
  })}
</div>
      ) : (
        !loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center text-gray-500">
            No announcements found
          </div>
        )
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-xl font-bold text-[var(--primary)]">
                Create Announcement
              </h2>

              <button
                onClick={() => setShowCreate(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Form */}
            <div className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    placeholder="Enter title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Message
                  </label>

                  <textarea
                    name="message"
                    placeholder="Enter message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                {/* Batch */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Select Batch
                  </label>

                  <select
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    <option value="">Select Batch</option>

                    {batches?.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name || b.title || b._id}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Channels */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-3">
                    Delivery Channels
                  </label>

                  <div className="flex flex-wrap gap-3">
                    {["inApp", "email", "sms"].map((channel) => (
                      <label
                        key={channel}
                        className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name={channel}
                          checked={formData.channels[channel]}
                          onChange={handleChannelChange}
                          className="accent-[var(--primary)]"
                        />

                        {channel === "inApp"
                          ? "In-App"
                          : channel.toUpperCase()}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Error */}
                {createError && (
                  <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {createError}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={createLoading}
                    className="px-5 py-2 rounded-xl bg-[var(--primary)] text-white text-sm hover:opacity-90 disabled:opacity-50"
                  >
                    {createLoading
                      ? "Creating..."
                      : "Create Announcement"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;