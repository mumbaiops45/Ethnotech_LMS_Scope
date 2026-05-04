"use client";

import React, { useState , useEffect  } from "react";
import { useLiveSession } from "../../../hooks/useLiveSession";
import { useInstructor } from "../../../hooks/useInstructor";

const CreateLiveClass = () => {
  const { createSession, loading } = useLiveSession();
  const { batches, courses, fetchBatches, fetchCourses } = useInstructor();

  useEffect(() => {
  fetchBatches();
  fetchCourses();
}, [fetchBatches, fetchCourses]);


  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    description: "",
    batch: "",
    course: "",
    scheduledAt: "",
    duration: "",
    joinLink: "",
    platform: "meet",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createSession({
        ...formData,
        duration: Number(formData.duration),
      });

      alert("Live Session Created ");

      setFormData({
        title: "",
        topic: "",
        description: "",
        batch: "",
        course: "",
        scheduledAt: "",
        duration: "",
        joinLink: "",
        platform: "meet",
      });

      
    } catch (error) {
      console.log(error);
      alert("Error creating session ❌");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Create Live Session</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

     
        <input
          type="text"
          name="title"
          placeholder="Session Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="border p-3 w-full rounded"
        />

       
        <input
          type="text"
          name="topic"
          placeholder="Topic"
          value={formData.topic}
          onChange={handleChange}
          required
          className="border p-3 w-full rounded"
        />

        
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-3 w-full rounded"
        />

        

        <select
  name="batch"
  value={formData.batch}
  onChange={handleChange}
  required
  className="border p-3 w-full rounded"
>
  <option value="">Select Batch</option>

  {batches?.map((batch) => (
    <option key={batch._id} value={batch._id}>
      {batch.name || batch.title || `Batch ${batch._id}`}
    </option>
  ))}
</select>

        
<select
  name="course"
  value={formData.course}
  onChange={handleChange}
  className="border p-3 w-full rounded"
>
  <option value="">Select Course (Optional)</option>

  {courses?.map((course) => (
    <option key={course._id} value={course._id}>
      {course.title || course.name}
    </option>
  ))}
</select>


       
        <input
          type="datetime-local"
          name="scheduledAt"
          value={formData.scheduledAt}
          onChange={handleChange}
          required
          className="border p-3 w-full rounded"
        />

       
        <input
          type="number"
          name="duration"
          placeholder="Duration (in minutes)"
          value={formData.duration}
          onChange={handleChange}
          required
          className="border p-3 w-full rounded"
        />

       
        <input
          type="text"
          name="joinLink"
          placeholder="Join Link"
          value={formData.joinLink}
          onChange={handleChange}
          required
          className="border p-3 w-full rounded"
        />

      
        <select
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          className="border p-3 w-full rounded"
        >
          <option value="meet">Google Meet</option>
          <option value="zoom">Zoom</option>
          <option value="other">Other</option>
        </select>

       
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-5 py-3 rounded w-full"
        >
          {loading ? "Creating..." : "Create Session"}
        </button>
      </form>
    </div>
  );
};

export default CreateLiveClass;