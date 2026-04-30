"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* ---------------- DATA ---------------- */
const studentData = [
  {
    progress: 65,

    stats: [
      { label: "Progress", value: "65%" },
      { label: "Courses", value: 3 },
      { label: "Live Classes", value: 2 },
      { label: "Assignments", value: 2 },
      { label: "Activity", value: "3 logs" },
      { label: "Announcements", value: 3 }
    ],

    enrolledCourses: [
      // 🔹 TECH PROGRAM
      {
        id: "course1",
        programId: "program1",
        name: "Full Stack Development",
        instructor: "Rahul Sharma",
        totalLessons: 32,
        duration: "12h 45m",
        progress: 70,
        coverImage: "/student cource.jpg",
        program: "Tech",
      },
      {
        id: "course2",
        programId: "program1",
        name: "Frontend Mastery",
        instructor: "Priya Verma",
        totalLessons: 24,
        duration: "8h 20m",
        progress: 50,
        coverImage: "/Frontend Mastery.jpg",
        program: "Tech",
      },
      {
        id: "course3",
        programId: "program1",
        name: "Backend Essentials",
        instructor: "Amit Patel",
        totalLessons: 28,
        duration: "10h 15m",
        progress: 40,
        coverImage: "/Backend Essentials.jpg",
        program: "Tech",
      },

      // 🔹 DESIGN PROGRAM
      {
        id: "course4",
        programId: "program2",
        name: "UI/UX Design Fundamentals",
        instructor: "Neha Kapoor",
        totalLessons: 20,
        duration: "6h 30m",
        progress: 60,
        coverImage: "/UIUX Design Fundamentals.jpg",
        program: "Design",
      },
      {
        id: "course5",
        programId: "program2",
        name: "Figma Masterclass",
        instructor: "Arjun Mehta",
        totalLessons: 18,
        duration: "5h 10m",
        progress: 30,
        coverImage: "/Figma Masterclass.jpg",
        program: "Design",
      },

      // 🔹 BUSINESS PROGRAM
      {
        id: "course6",
        programId: "program3",
        name: "Startup Basics",
        instructor: "Rohit Agarwal",
        totalLessons: 22,
        duration: "7h 15m",
        progress: 80,
        coverImage: "/Startup Basics.jpg",
        program: "Business",
      },
      {
        id: "course7",
        programId: "program3",
        name: "Digital Marketing",
        instructor: "Sneha Iyer",
        totalLessons: 26,
        duration: "9h 40m",
        progress: 45,
        coverImage: "/Digital Marketing.jpg",
        program: "Business",
      },
    ],

    liveClasses: [
      { title: "React Advanced Session", time: "Tomorrow 10:00 AM" },
      { title: "Node.js Workshop", time: "Friday 2:00 PM" }
    ],

    assignments: [
      { title: "React Project", status: "Pending" },
      { title: "API Design Task", status: "Pending" }
    ],

    activity: [
      "Completed HTML module",
      "Watched React Intro",
      "Attempted Quiz: JavaScript Basics"
    ],

    announcements: [
      "New batch starts Monday",
      "Assignment deadline extended",
      "Live class schedule updated"
    ],

    quickAccess: [
      "Join Class",
      "Assignments",
      "Ask Doubt",
      "Certificates"
    ]
  }
];

const programs = [...new Set(studentData[0].enrolledCourses.map((item) => {
  return item.program
}))];



/* ---------------- COMPONENT ---------------- */
export default function StudentClint() {
  const router = useRouter();
  const [student, setStudent] = useState(studentData[0]);
  const [tab, setTab] = useState("overview");
  const [showEdit, setShowEdit] = useState(false);

  const [form, setForm] = useState(JSON.parse(JSON.stringify(studentData[0])));

  const tabs = ["overview", "courses", "progress"];

  function handleUpdate() {
    setStudent(form);
    setShowEdit(false);
  }

  return (
    <div className="min-h-screen gap-6 relative">


      {/* EDIT BUTTON */}
      {/* <button
        onClick={() => setShowEdit(true)}
        className="absolute top-4 right-6 bg-black text-white px-6 py-2 rounded-md text-sm"
      >
        Edit
      </button> */}

      {/* LEFT SIDEBAR */}
      <div className={`${tab === "courses" ? "hidden" : `block`} bg-gray-100 rounded-2xl py-6 px-6 shadow-md space-y-6`}>
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Student<span className="text-[var(--primary)]"> Dashboard</span></h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your learning activity.</p>
        </div>

        <div className="grid grid-cols-6 gap-3">
          {student.stats.map((s, i) => (
            <div key={i} className="flex justify-between items-center rounded-xl shadow bg-gradient-to-r from-[var(--primary)] to-green-500 px-4 border-l-4 text-white">
              <p className="text-sm">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className={`${tab === "courses" ? "w-full" : `w-full`} bg-gray-100 rounded-2xl p-6 shadow-md`}>

        {/* TABS */}
        <div className="flex mb-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-semibold ${tab === t
                ? "bg-white shadow-md text-black"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-2xl ">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="grid grid-cols-2 gap-5 p-5">

              {/* COURSES */}
              <div>
                <h2 className="font-semibold mb-3">Courses</h2>
                {student.enrolledCourses.map((c, i) => (
                  <div key={i} className="flex justify-between items-center mb-2">

                    <p>• {c.name}</p>

                    {/* ✅ VIEW COURSE BUTTON */}
                    <button
                      onClick={() =>
                        router.push(
                          `/components/dashboard/programs/${c.programId}/courses/${c.id}`
                        )
                      }
                      className="text-xs bg-black text-white px-2 py-1 rounded"
                    >
                      View
                    </button>

                  </div>
                ))}
              </div>

              {/* LIVE CLASSES */}
              <div>
                <h2 className="font-semibold mb-3">Live Classes</h2>
                {student.liveClasses.map((l, i) => (
                  <p key={i} className="text-sm mb-1">{l.title}</p>
                ))}
              </div>

              {/* ASSIGNMENTS */}
              <div>
                <h2 className="font-semibold mb-3">Assignments</h2>
                {student.assignments.map((a, i) => (
                  <p key={i}>
                    • {a.title} -{" "}
                    <span className="text-red-500">{a.status}</span>
                  </p>
                ))}
              </div>

              {/* ACTIVITY */}
              <div>
                <h2 className="font-semibold mb-3">Activity</h2>
                {student.activity.map((a, i) => (
                  <p key={i}>✔ {a}</p>
                ))}
              </div>

              {/* ANNOUNCEMENTS */}
              <div className="col-span-2">
                <h2 className="font-semibold mb-3">Announcements</h2>
                {student.announcements.map((a, i) => (
                  <p key={i} className="bg-gray-100 p-2 rounded mb-2">
                    {a}
                  </p>
                ))}
              </div>

              {/* QUICK ACCESS */}
              <div className="col-span-2">
                <h2 className="font-semibold mb-3">Quick Access</h2>
                <div className="flex gap-2 flex-wrap">
                  {student.quickAccess.map((q, i) => (
                    <button key={i} className="px-3 py-1 bg-gray-100 rounded">
                      {q}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* COURSES TAB */}
          {tab === "courses" && (
            <div className="flex flex-col gap-3">
              {programs.map((item, index) => {
                return (
                  <div key={index} className="rounded-3xl">
                    <h2 className="bg-gray-200 px-5 py-2">{item}</h2>

                    <div className="grid grid-cols-3 gap-4 p-5">
                      {student.enrolledCourses
                        .filter((course) => course.program === item)
                        .map((c, i) => (
                          <div
                            key={i}
                            className="bg-gray-50 rounded-xl shadow-md overflow-hidden flex flex-col"
                          >
                            {/* COVER IMAGE */}
                            <div className="relative h-[25vh]">
                              <Image
                                fill
                                src={c.coverImage || "/student cource.jpg"}
                                alt={c.name}
                                className="w-full h-32 object-fill"
                              />
                            </div>

                            <div className="p-4 flex flex-col justify-between flex-1">
                              {/* TITLE */}
                              <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold mb-2">{c.name}</h3>
                                <p className="px-3 py-1 bg-gray-200 rounded-xl">
                                  {c.program}
                                </p>
                              </div>

                              {/* INSTRUCTOR */}
                              <p className="text-xs text-gray-600 mb-1">
                                Instructor: {c.instructor}
                              </p>

                              {/* DETAILS */}
                              <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>{c.totalLessons} Lessons</span>
                                <span>{c.duration}</span>
                              </div>

                              {/* PROGRESS */}
                              <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                                <div
                                  className="bg-black h-2 rounded-full"
                                  style={{ width: c.progress + "%" }}
                                />
                              </div>

                              {/* STATUS */}
                              <p className="text-xs mb-3">
                                Status:{" "}
                                <span className="font-medium">
                                  {c.progress === 100
                                    ? "Completed"
                                    : c.progress > 0
                                      ? "In Progress"
                                      : "Not Started"}
                                </span>
                              </p>

                              {/* BUTTON */}
                              <button
                                onClick={() =>
                                  router.push(
                                    `/components/dashboard/programs/${c.programId}/courses/${c.id}`
                                  )
                                }
                                className="text-xs bg-black text-white px-3 py-1 rounded"
                              >
                                View Course
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PROGRESS */}
          {tab === "progress" && (
            <div>
              <h2 className="font-semibold mb-4">Overall Progress</h2>

              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="bg-black h-3 rounded-full"
                  style={{ width: student.progress + "%" }}
                />
              </div>

              <p className="mt-2 text-sm">{student.progress}% Completed</p>
            </div>
          )}

        </div>
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[600px]">

            <h2 className="font-bold mb-4">Edit Data</h2>

            {form.enrolledCourses.map((c, i) => (
              <input
                key={i}
                value={c.name}
                onChange={(e) => {
                  const newData = [...form.enrolledCourses];
                  newData[i].name = e.target.value;
                  setForm({ ...form, enrolledCourses: newData });
                }}
                className="border p-2 w-full mb-2"
              />
            ))}

            <button
              onClick={handleUpdate}
              className="bg-black text-white px-4 py-2 w-full rounded"
            >
              Update
            </button>

          </div>
        </div>
      )}

    </div>
  );
}