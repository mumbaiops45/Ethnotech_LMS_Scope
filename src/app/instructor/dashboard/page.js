"use client"
import Layout from "../../components/layout";
import { useEffect } from "react";
import {
  FaBook,
  FaClipboardList,
  FaVideo,
  FaBullhorn
} from "react-icons/fa";
import { useInstructor } from "../../../../hooks/useInstructor";

export default function InstructorDashboard() {

  const {dashboard , loading , error , fetchDashboard} = useInstructor();
  
  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <p>Loading...</p>
   if (error) return <p>Error... {error}</p>

  
  return (
    <div className="space-y-6">
     
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Instructor<span className="text-[var(--primary)]"> Dashboard</span></h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your teaching activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="flex justify-between items-center rounded-xl shadow bg-gradient-to-r from-[var(--primary)] to-green-500  py-2 px-4 border-l-4 text-white">
          <p className="text-sm">Total Courses</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="flex justify-between items-center rounded-xl shadow bg-gradient-to-r from-[var(--primary)] to-blue-500  py-2 px-4 border-l-4 text-white ">
          <p className="text-sm">Active Students</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="flex justify-between items-center rounded-xl shadow bg-gradient-to-r from-[var(--primary)] to-red-500  py-2 px-4 border-l-4 text-white">
          <p className="text-sm">Pending Assignments</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="flex justify-between items-center rounded-xl shadow bg-gradient-to-r from-[var(--primary)] to-yellow-500  py-2 px-4 border-l-4 text-white">
          <p className="text-sm">Upcoming Live Sessions</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        
        <div className="bg-gray-200  rounded-xl shadow-md">
          <h2 className="bg-[var(--primary)] rounded-t-xl text-lg font-semibold px-6 py-2 text-white">Quick Actions</h2>

          <div className="space-y-3 p-6">

            <button className="w-full flex items-center gap-3 px-4 py-2 rounded text-white 
        bg-[var(--primary)]
        hover:opacity-90 transition shadow-sm">
              <FaBook /> Create a new course
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2 rounded text-white 
        bg-[var(--primary)]
        hover:opacity-90 transition shadow-sm">
              <FaClipboardList /> Create an assignment
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2 rounded text-white 
        bg-[var(--primary)]
        hover:opacity-90 transition shadow-sm">
              <FaVideo /> Schedule a live session
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2 rounded text-white 
        bg-[var(--primary)]
        hover:opacity-90 transition shadow-sm">
              <FaBullhorn /> Send batch announcement
            </button>

          </div>
        </div>

       
        <div className="bg-gray-200  rounded-xl shadow-md">
          <h2 className="bg-[var(--primary)] rounded-t-xl text-lg font-semibold px-6 py-2 text-white">Recent Activity</h2>
          <p className="text-center py-6">
            No recent activity yet.
          </p>
        </div>

      </div>
    </div>
  );
}