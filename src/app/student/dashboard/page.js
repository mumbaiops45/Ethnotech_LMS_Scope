"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  FaBookOpen,
  FaClipboardList,
  FaBullhorn,
  FaChartLine,
  FaPlayCircle,
  FaArrowRight,
  FaCalendarAlt,
  FaFire,
  FaMedal,
} from "react-icons/fa";

import { useDashboard } from "../../../../hooks/useDashboard";

export default function StudentDashboard() {
  const router = useRouter();

  const {
    student,
    stats,
    enrolledCourses,
    upcomingClasses,
    pendingAssignments,
    recentActivity,
    announcements,
    loading,
    error,
    fetchDashboard,
  } = useDashboard();

  const [tab, setTab] = useState("overview");

  const tabs = ["overview", "courses", "progress"];

  useEffect(() => {
    fetchDashboard().catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-14 w-14 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-gray-800">
            Loading Dashboard...
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full text-center border border-red-100">
          <div className="text-red-500 text-5xl mb-4">⚠</div>

          <h2 className="text-2xl font-bold text-gray-800">
            Failed to Load Dashboard
          </h2>

          <p className="text-gray-500 mt-3">{error}</p>

          <button
            onClick={() => fetchDashboard()}
            className="mt-6 bg-[var(--primary)] hover:opacity-90 text-white px-6 py-3 rounded-2xl font-medium transition"
          >
            Retry Again
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            No Dashboard Data
          </h2>

          <p className="text-gray-500 mt-2">
            Please login again or refresh dashboard
          </p>

          <button
            onClick={() => fetchDashboard()}
            className="mt-5 bg-[var(--primary)] text-white px-6 py-3 rounded-2xl"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const overallProgress = student?.completenessPercent || 0;

  const statsCards = [
    {
      title: "Overall Progress",
      value: `${overallProgress}%`,
      icon: <FaChartLine />,
      bg: "from-indigo-500 to-purple-500",
    },
    {
      title: "Enrolled Courses",
      value:
        stats?.totalEnrolledCourses || enrolledCourses.length,
      icon: <FaBookOpen />,
      bg: "from-emerald-500 to-green-500",
    },
    {
      title: "Upcoming Classes",
      value: upcomingClasses.length,
      icon: <FaPlayCircle />,
      bg: "from-orange-500 to-red-500",
    },
    {
      title: "Assignments",
      value: pendingAssignments.length,
      icon: <FaClipboardList />,
      bg: "from-pink-500 to-rose-500",
    },
  ];

  const programs = [
    ...new Set(
      enrolledCourses
        .map((course) => course.program)
        .filter(Boolean)
    ),
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[var(--primary)] to-indigo-700 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-widest text-white/70">
              Student Portal
            </p>

            <h1 className="text-3xl sm:text-5xl font-bold mt-2 leading-tight">
              Welcome Back,
              <br />
              {student.fullName}
            </h1>

            <p className="mt-4 text-white/80 max-w-2xl text-sm sm:text-base">
              Continue your learning journey and track your
              progress in real time.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <button className="bg-white text-black px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition">
                Continue Learning
              </button>

              <button className="border border-white/40 px-5 py-3 rounded-2xl hover:bg-white/10 transition">
                View Certificates
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-5 min-w-[250px] border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <FaFire className="text-yellow-300 text-2xl" />

              <div>
                <p className="text-sm text-white/70">
                  Learning Streak
                </p>

                <h3 className="text-2xl font-bold">12 Days</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Profile Completion</span>
                  <span>{overallProgress}%</span>
                </div>

                <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-white h-3 rounded-full"
                    style={{
                      width: `${overallProgress}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <FaMedal className="text-yellow-300" />

                <span className="text-sm">
                  Keep going! You're doing great.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${card.bg} rounded-3xl p-5 text-white shadow-lg hover:scale-[1.02] transition duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <div className="text-4xl opacity-80">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3 mt-8">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-5 py-3 rounded-2xl font-semibold transition ${
              tab === item
                ? "bg-[var(--primary)] text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          {/* LEFT */}
          <div className="xl:col-span-2 space-y-6">
            {/* COURSES */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                  My Courses
                </h2>

                <button
                  onClick={() => setTab("courses")}
                  className="text-[var(--primary)] text-sm font-semibold flex items-center gap-2"
                >
                  View All <FaArrowRight />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {enrolledCourses.slice(0, 4).map((course, index) => (
                  <div
                    key={index}
                    className="border border-gray-100 rounded-3xl overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative h-44">
                      <Image
                        fill
                        src={
                          course.coverImage ||
                          "/student cource.jpg"
                        }
                        alt={course.name}
                        className="object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start gap-3">
                        <h3 className="font-semibold text-gray-800 line-clamp-2">
                          {course.name}
                        </h3>

                        <span className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-1 rounded-xl whitespace-nowrap">
                          {course.program}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mt-2">
                        {course.instructor}
                      </p>

                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{course.progress || 0}%</span>
                        </div>

                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-[var(--primary)] rounded-full"
                            style={{
                              width: `${course.progress || 0}%`,
                            }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          router.push(
                            `/components/dashboard/programs/${course.programId}/courses/${course.id}`
                          )
                        }
                        className="w-full mt-4 bg-black hover:bg-gray-800 text-white py-3 rounded-2xl text-sm font-medium transition"
                      >
                        Continue Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ANNOUNCEMENTS */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <FaBullhorn className="text-[var(--primary)]" />

                <h2 className="text-xl font-bold">
                  Announcements
                </h2>
              </div>

              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No announcements available
                  </p>
                ) : (
                  announcements.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition"
                    >
                      <h3 className="font-semibold text-gray-800">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-600 mt-1">
                        {item.message}
                      </p>

                      <p className="text-xs text-gray-400 mt-3">
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* LIVE CLASSES */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <FaCalendarAlt className="text-[var(--primary)]" />

                <h2 className="text-xl font-bold">
                  Upcoming Classes
                </h2>
              </div>

              <div className="space-y-4">
                {upcomingClasses.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No upcoming classes
                  </p>
                ) : (
                  upcomingClasses.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-100 rounded-2xl p-4"
                    >
                      <h3 className="font-semibold text-sm">
                        {item.title}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(
                          item.scheduledAt
                        ).toLocaleString()}
                      </p>

                      <button className="mt-3 bg-[var(--primary)] text-white px-4 py-2 rounded-xl text-xs">
                        Join Class
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ASSIGNMENTS */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-5">
                Pending Assignments
              </h2>

              <div className="space-y-3">
                {pendingAssignments.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No pending assignments
                  </p>
                ) : (
                  pendingAssignments.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-red-50 rounded-2xl p-4"
                    >
                      <div>
                        <h3 className="text-sm font-semibold">
                          {item.title}
                        </h3>

                        <p className="text-xs text-red-500 mt-1">
                          Pending Submission
                        </p>
                      </div>

                      <button className="text-xs bg-red-500 text-white px-3 py-2 rounded-xl">
                        Submit
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COURSES */}
      {tab === "courses" && (
        <div className="mt-6 space-y-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {program}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {enrolledCourses
                  .filter((course) => course.program === program)
                  .map((course, i) => (
                    <div
                      key={i}
                      className="rounded-3xl overflow-hidden bg-gray-50 hover:shadow-xl transition"
                    >
                      <div className="relative h-52">
                        <Image
                          fill
                          src={
                            course.coverImage ||
                            "/student cource.jpg"
                          }
                          alt={course.name}
                          className="object-cover"
                        />
                      </div>

                      <div className="p-5">
                        <div className="flex justify-between items-start gap-3">
                          <h3 className="font-bold text-gray-800">
                            {course.name}
                          </h3>

                          <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2 py-1 rounded-xl">
                            {course.progress || 0}%
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                          Instructor: {course.instructor}
                        </p>

                        <div className="mt-4 w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 rounded-full bg-[var(--primary)]"
                            style={{
                              width: `${course.progress || 0}%`,
                            }}
                          />
                        </div>

                        <button
                          onClick={() =>
                            router.push(
                              `/components/dashboard/programs/${course.programId}/courses/${course.id}`
                            )
                          }
                          className="w-full mt-5 bg-black hover:bg-gray-800 text-white py-3 rounded-2xl font-medium transition"
                        >
                          View Course
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROGRESS */}
      {tab === "progress" && (
        <div className="mt-6 bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Learning Progress
          </h2>

          <div className="bg-gray-100 rounded-3xl p-6">
            <div className="flex justify-between mb-3">
              <span className="font-medium">
                Overall Completion
              </span>

              <span className="font-bold text-[var(--primary)]">
                {overallProgress}%
              </span>
            </div>

            <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[var(--primary)] to-indigo-600 h-5 rounded-full"
                style={{
                  width: `${overallProgress}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {enrolledCourses.map((course, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-2xl p-5"
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {course.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {course.program}
                    </p>
                  </div>

                  <span className="font-bold text-[var(--primary)]">
                    {course.progress || 0}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{
                      width: `${course.progress || 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}