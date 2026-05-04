// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useState, useEffect, useRef } from "react";
// import { useAuthStore } from "../../../store/login.store";
// import { FiMenu } from "react-icons/fi";


// // React Icons
// import {
//   FaHome,
//   FaBook,
//   FaVideo,
//   FaUser,
//   FaBullhorn,
//   FaChartBar,
//   FaClipboardList,
//   FaUsers,
//   FaBox,
//   FaUpload,
//   FaPlus,            // ✅ added for "Create Batch" if needed
// } from "react-icons/fa";

// export default function DashboardLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const loggedInUser = useAuthStore((state) => state.user);
//   const token = useAuthStore((state) => state.token);
//   const getProfile = useAuthStore((state) => state.getProfile);
//   const logout = useAuthStore((state) => state.logout);

//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const profileRef = useRef(null);
//   const notificationRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isOpen, setisOpen] = useState(false);
//   const [openMenus, setOpenMenus] = useState({});

//   useEffect(() => {
//     if (token && !loggedInUser) {
//       getProfile().finally(() => setIsLoading(false));
//     } else {
//       setIsLoading(false);
//     }
//   }, [token, loggedInUser, getProfile]);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (profileRef.current && !profileRef.current.contains(event.target))
//         setShowProfileMenu(false);
//       if (notificationRef.current && !notificationRef.current.contains(event.target))
//         setShowNotifications(false);
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleMenu = (key) => setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

//   // ================= ROLE-BASED MENUS =================
//   const superadminMenu = [
//     { name: "Users", icon: <FaUsers />, path: "/components/card" },
//     {
//       name: "Batch Management",
//       icon: <FaBox />,
//       isMaster: true,
//       key: "batch",
//       subItems: [
//         { name: "All Batches", icon: <FaBox />, path: "/instructor/batch/batches" },
//         { name: "Add Students to Batch", icon: <FaUser />, path: "/instructor/batch/add-students" },
//         { name: "Assign Courses to Batch", icon: <FaBook />, path: "/instructor/batch/assign-courses" },
//       ],
//     },
//   ];

//   const instructorMenu = [
//     { name: "Dashboard", icon: <FaHome />, path: "/instructor/dashboard" },
//     { name: "My Courses", icon: <FaBook />, path: "/instructor/courses" },
//     { name: "Live Sessions", icon: <FaVideo />, path: "/instructor/live-sessions" },
//     { name: "Assignments to Grade", icon: <FaClipboardList />, path: "/instructor/assignments/review" },
//     { name: "Create Questions", icon: <FaClipboardList />, path: "/instructor/assignments/question" },
//     { name: "Student Progress", icon: <FaChartBar />, path: "/instructor/progress" },
//     { name: "Announcements", icon: <FaBullhorn />, path: "/instructor/announcements" },
//     { name: "Profile", icon: <FaUser />, path: "/instructor/profile" },
//     { name: "User", icon: <FaUsers />, path: "/components/card" },
//   ];

//   const studentMenu = [
//     { name: "Dashboard", icon: <FaHome />, path: "/student/dashboard" },
//     { name: "My Courses", icon: <FaBook />, path: "/student/courses" },
//     { name: "Assignments", icon: <FaClipboardList />, path: "/student/assignments" },
//     { name: "Live Sessions", icon: <FaVideo />, path: "/student/live-sessions" },
//     { name: "Certificates", icon: <FaBook />, path: "/student/certificates" },
//     { name: "Profile", icon: <FaUser />, path: "/student/profile" },
//   ];

//   const role = loggedInUser?.role?.toLowerCase() || "student";
//   let currentMenu = studentMenu;
//   if (role === "superadmin") currentMenu = superadminMenu;
//   else if (role === "instructor") currentMenu = instructorMenu;

//   const displayName = loggedInUser?.fullName || loggedInUser?.name || "User";
//   const displayEmail = loggedInUser?.email || "";
//   const avatarUrl = loggedInUser?.photo
//     ? loggedInUser.photo
//     : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff`;

//   const [notifications] = useState([
//     { id: 1, message: "New announcement", time: "5 min ago", read: false },
//   ]);
//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const handleLogout = () => {
//     logout();
//     router.push("/auth/login");
//   };

//   const getProfileLink = () => {
//     if (role === "instructor") return "/instructor/profile";
//     if (role === "superadmin") return "/components/profile";
//     return "/student/profile";
//   };

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="text-gray-500">Loading dashboard...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen">

//       {/* ✅ SIDEBAR */}
//       <aside
//         className={`
//     fixed top-0 left-0 z-50 h-screen w-64
//     bg-[var(--primary)] text-white flex flex-col p-5
//     transition-transform duration-300
//     ${isOpen ? "translate-x-0" : "-translate-x-full"}
//     md:translate-x-0 md:static
//   `}
//       >
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold mb-8">Ethnotech LMS</h2>

//           <button
//             onClick={() => setisOpen(false)}
//             className="text-white text-2xl self-start md:hidden"
//           >
//             ✕
//           </button>
//         </div>
//       {/* SIDEBAR */}
//       <aside className="w-64 bg-[var(--primary)] text-white flex flex-col p-5">
//         <h2 className="text-2xl font-bold mb-8">Ethnotech LMS</h2>

//         <nav className="space-y-2 flex-1">
//           {currentMenu.map((item) => (
//             <div key={item.name}>
//               <Link
//                 href={item.path}
//                 onClick={setisOpen(false)}
//                 className={`flex items-center gap-3 px-3 py-2 rounded transition ${pathname === item.path
//                   ? "bg-white/20"
//                   : "hover:bg-white/10"
//                   }`}
//               >
//                 {item.icon}
//                 {item.name}
//               </Link>
//               {/* ✅ Handle master dropdown (has subItems) */}
//               {item.subItems ? (
//                 <div>
//                   <button
//                     onClick={() => toggleMenu(item.key || item.name)}
//                     className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-white/10 transition"
//                   >
//                     <span className="flex items-center gap-3">
//                       {item.icon}
//                       {item.name}
//                     </span>
//                     <svg
//                       className={`w-4 h-4 transition-transform ${openMenus[item.key || item.name] ? "rotate-180" : ""}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {openMenus[item.key || item.name] && (
//                     <div className="ml-6 mt-1 space-y-1">
//                       {item.subItems.map((sub) => (
//                         <Link
//                           key={sub.path}
//                           href={sub.path}
//                           className={`flex items-center gap-3 px-3 py-2 rounded transition ${
//                             pathname === sub.path ? "bg-white/20" : "hover:bg-white/10"
//                           }`}
//                         >
//                           {sub.icon}
//                           {sub.name}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 /* ✅ Regular link – only if path exists */
//                 item.path && (
//                   <Link
//                     href={item.path}
//                     className={`flex items-center gap-3 px-3 py-2 rounded transition ${
//                       pathname === item.path ? "bg-white/20" : "hover:bg-white/10"
//                     }`}
//                   >
//                     {item.icon}
//                     {item.name}
//                   </Link>
//                 )
//               )}
//             </div>
//           ))}
//         </nav>
//       </aside>

//       {/* MAIN CONTENT */}
//       <div className="flex-1 flex flex-col bg-gray-100">

//         {/* ✅ HEADER UPDATED */}
//         {/* <header className="bg-[var(--primary)] shadow-sm px-6 py-3 flex justify-between md:justify-end items-center">
//           <FiMenu
//             onClick={() => setisOpen(!isOpen)}
//             className="text-white text-2xl cursor-pointer block md:hidden"
//           /> */}
//         {/* HEADER */}
//         <header className="bg-[var(--primary)] shadow-sm px-6 py-3 flex justify-end items-center">
//           <div className="flex items-center gap-5">
//             {/* Notifications */}
//             <div className="relative" ref={notificationRef}>
//               <button
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 className="relative p-2 text-white hover:bg-white/15 rounded-full"
//               >
//                 🔔
//                 {unreadCount > 0 && (
//                   <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
//                 )}
//               </button>
//               {showNotifications && (
//                 <div className="absolute right-0 mt-3 w-80 bg-[var(--primary)] text-white rounded-2xl shadow-xl z-50">
//                   <div className="p-4">
//                     <h3 className="font-semibold">Notifications</h3>
//                   </div>
//                   {notifications.map((n) => (
//                     <div key={n.id} className="p-4 hover:bg-white/10">
//                       <p className="text-sm">{n.message}</p>
//                       <p className="text-xs">{n.time}</p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Profile */}
//             <div className="relative" ref={profileRef}>
//               <button onClick={() => setShowProfileMenu(!showProfileMenu)}>
//                 <img src={avatarUrl} className="w-10 h-10 rounded-full border-2 border-white" alt="avatar" />
//               </button>
//               {showProfileMenu && (
//                 <div className="absolute right-0 mt-3 w-64 bg-[var(--primary)] text-white rounded-2xl shadow-xl z-50">
//                   <div className="p-4">
//                     <p className="font-semibold">{displayName}</p>
//                     <p className="text-xs">{displayEmail}</p>
//                   </div>
//                   <Link href={getProfileLink()} className="block p-4 hover:bg-white/10">
//                     Profile
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left text-red-400 p-4 hover:bg-white/10"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         <main className="p-6 overflow-y-auto">{children}</main>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../../store/login.store";
import { FiMenu, FiX } from "react-icons/fi";

// React Icons
import {
  FaHome,
  FaBook,
  FaVideo,
  FaUser,
  FaBullhorn,
  FaChartBar,
  FaClipboardList,
  FaUsers,
  FaBox,
} from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const loggedInUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const getProfile = useAuthStore((state) => state.getProfile);
  const logout = useAuthStore((state) => state.logout);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    if (token && !loggedInUser) {
      getProfile().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token, loggedInUser, getProfile]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target))
        setShowProfileMenu(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target))
        setShowNotifications(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (key) => setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  // ================= ROLE-BASED MENUS =================
  const superadminMenu = [
    { name: "Users", icon: <FaUsers />, path: "/components/card" },
    {
      name: "Batch Management",
      icon: <FaBox />,
      isMaster: true,
      key: "batch",
      subItems: [
        { name: "All Batches", icon: <FaBox />, path: "/instructor/batch/batches" },
        { name: "Add Students to Batch", icon: <FaUser />, path: "/instructor/batch/add-students" },
        // { name: "Assign Courses to Batch", icon: <FaBook />, path: "/instructor/batch/assign-courses" },
      ],
    },
  ];

  const instructorMenu = [
    { name: "Dashboard", icon: <FaHome />, path: "/instructor/dashboard" },
    { name: "My Courses", icon: <FaBook />, path: "/instructor/courses" },
    { name: "Live Sessions", icon: <FaVideo />, path: "/instructor/live-sessions" },
    { name: "Assignments to Grade", icon: <FaClipboardList />, path: "/instructor/assignments/review" },
    { name: "Create Questions", icon: <FaClipboardList />, path: "/instructor/assignments/question" },
    { name: "Student Progress", icon: <FaChartBar />, path: "/instructor/progress" },
    { name: "Announcements", icon: <FaBullhorn />, path: "/instructor/announcements" },
    { name: "Profile", icon: <FaUser />, path: "/instructor/profile" },
    { name: "User", icon: <FaUsers />, path: "/components/card" },
  ];

  const studentMenu = [
    { name: "Dashboard", icon: <FaHome />, path: "/student/dashboard" },
    { name: "My Courses", icon: <FaBook />, path: "/student/courses" },
    { name: "Assignments", icon: <FaClipboardList />, path: "/student/assignments" },
    { name: "Live Sessions", icon: <FaVideo />, path: "/student/live-sessions" },
    { name: "Certificates", icon: <FaBook />, path: "/student/certificates" },
    { name: "Profile", icon: <FaUser />, path: "/student/profile" },
  ];

  const role = loggedInUser?.role?.toLowerCase() || "student";
  let currentMenu = studentMenu;
  if (role === "superadmin") currentMenu = superadminMenu;
  else if (role === "instructor") currentMenu = instructorMenu;

  const displayName = loggedInUser?.fullName || loggedInUser?.name || "User";
  const displayEmail = loggedInUser?.email || "";
  const avatarUrl = loggedInUser?.photo
    ? loggedInUser.photo
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff`;

  const [notifications] = useState([
    { id: 1, message: "New announcement", time: "5 min ago", read: false },
  ]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const getProfileLink = () => {
    if (role === "instructor") return "/instructor/profile";
    if (role === "superadmin") return "/components/profile";
    return "/student/profile";
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Mobile overlay/backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - responsive */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64
          bg-[var(--primary)] text-white flex flex-col p-5
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Ethnotech LMS</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white text-2xl md:hidden"
          >
            <FiX />
          </button>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto">
          {currentMenu.map((item) => (
            <div key={item.name}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.key || item.name)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-white/10 transition"
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      {item.name}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${openMenus[item.key || item.name] ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openMenus[item.key || item.name] && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.path}
                          href={sub.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded transition ${
                            pathname === sub.path ? "bg-white/20" : "hover:bg-white/10"
                          }`}
                        >
                          {sub.icon}
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                item.path && (
                  <Link
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded transition ${
                      pathname === item.path ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* HEADER */}
        <header className="bg-[var(--primary)] shadow-sm px-6 py-3 flex justify-between md:justify-end items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white text-2xl md:hidden"
          >
            <FiMenu />
          </button>
          <div className="flex items-center gap-5">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-white hover:bg-white/15 rounded-full"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-[var(--primary)] text-white rounded-2xl shadow-xl z-50">
                  <div className="p-4">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 hover:bg-white/10">
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <img src={avatarUrl} className="w-10 h-10 rounded-full border-2 border-white" alt="avatar" />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-[var(--primary)] text-white rounded-2xl shadow-xl z-50">
                  <div className="p-4">
                    <p className="font-semibold">{displayName}</p>
                    <p className="text-xs">{displayEmail}</p>
                  </div>
                  <Link href={getProfileLink()} className="block p-4 hover:bg-white/10">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-400 p-4 hover:bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}