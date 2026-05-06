"use client";
import React, { useEffect, useState } from "react";
import { useCreateAnnouncement } from "../../../hooks/useAnnouncement";
import { useInstructor } from "../../../hooks/useInstructor";

const CreateAnnouncement = () => {
  const { createAnnouncement, loading, error } = useCreateAnnouncement();
  const { batches, fetchBatches } = useInstructor();

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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Create Announcement
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          
          <textarea
            name="message"
            placeholder="Enter message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

     

         
          {formData.targetType === "batch" && (
            <select
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Batch</option>
              {batches?.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name || b.title || b._id}
                </option>
              ))}
            </select>
          )}

        
          <div className="flex flex-wrap gap-4">
            {["inApp", "email", "sms"].map((channel) => (
              <label key={channel} className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  name={channel}
                  checked={formData.channels[channel]}
                  onChange={handleChannelChange}
                  className="accent-blue-600"
                />
                {channel === "inApp" ? "In-App" : channel.toUpperCase()}
              </label>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Announcement"}
          </button>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncement;