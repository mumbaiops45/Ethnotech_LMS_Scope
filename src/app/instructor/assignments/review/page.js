"use client"
import React, { useEffect } from "react";
import { useAssignment } from "../../../../../hooks/useReviewAssignment";

const Page = () => {
  const { pending, fetchPending, loading } = useAssignment();

  useEffect(() => {
    fetchPending();
  }, []);


  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Pending Assignments</h2>

      {pending?.length === 0 && <p>No pending submissions</p>}

      {pending?.map((item) => (
        <div key={item._id} className="border p-3 my-2">
          
          {/* Assignment title */}
          <h3 className="font-bold">
            {item.assignment?.title}
          </h3>

          {/* Content */}
          <p><strong>Answer:</strong> {item.content}</p>

          {/* Status */}
          <p><strong>Status:</strong> {item.status}</p>

          {/* File */}
          {item.fileUrl && (
            <a
              href={item.fileUrl}
              target="_blank"
              className="text-blue-500 underline"
            >
              View Submission
            </a>
          )}

        
          <p>
            <strong>Student:</strong>{" "}
            {item.student?.name || "Not assigned"}
          </p>

        </div>
      ))}
    </div>
  );
};

export default Page;