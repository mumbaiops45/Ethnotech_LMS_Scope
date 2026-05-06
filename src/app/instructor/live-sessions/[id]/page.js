
"use client";
import React, {useEffect} from 'react';
import { useParams } from 'next/navigation';
import { useLiveSession } from '../../../../../hooks/useLiveSession';

const page = () => {
    const {id} = useParams();

    const {
        singleSession,
        fetchSingleSession,
        loading,
        error,
    } = useLiveSession();

    useEffect(() => {
        if (id) {
            fetchSingleSession(id);
        }
    }, [id]);

    if (loading) return <p>Loading...</p>;

    return (
    <div className="p-6">

      <h1 className="text-2xl font-bold">
        {singleSession?.title}
      </h1>

      <p className="text-gray-600 mt-2">
        Topic: {singleSession?.topic}
      </p>

      <p className="mt-2">
        {singleSession?.description}
      </p>

      <p className="text-sm text-gray-500 mt-2">
        📅{" "}
        {singleSession?.scheduledAt
          ? new Date(singleSession.scheduledAt).toLocaleString()
          : "No date"}
      </p>

      <p className="text-sm mt-2">
        ⏱ Duration: {singleSession?.duration} min
      </p>

      {singleSession?.recordingUrl && (
        <video
          className="mt-4 rounded"
          width="500"
          controls
        >
          <source
            src={singleSession.recordingUrl}
            type="video/mp4"
          />
        </video>
      )}

    </div>
  )
}

export default page

