"use client"
import React from 'react'
import { useAnnouncements } from '../../../../hooks/useAnnouncement'
import CreateAnnouncement from "../../components/CreateAnnouncemnt"
import { useRouter } from 'next/navigation'

const page = () => {
  const { announcements, loading, error } = useAnnouncements();
  const router = useRouter();
  console.log("hello", announcements);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <CreateAnnouncement />

      <div className="mt-8 max-w-3xl mx-auto space-y-4">
        {announcements?.map((a) => (
          <div
            key={a._id}
            onClick={() => router.push(`/instructor/announcements/${a._id}`)}
            className="bg-white shadow-md rounded-xl p-4 border border-gray-200 cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {a.title}
            </h3>

            <p className="text-gray-600 mt-1">
              {a.message}
            </p>

            <div className="flex gap-3 mt-3 text-sm text-gray-500">
              {a.channels?.inApp && (
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  In-App
                </span>
              )}
              {a.channels?.email && (
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                  Email
                </span>
              )}
              {a.channels?.sms && (
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded">
                  SMS
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default page
