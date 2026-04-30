"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../../store/login.store";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const loggedInUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const getProfile = useAuthStore((state) => state.getProfile);
  const logout = useAuthStore((state) => state.logout);
  // ❌ removed: const hydrate = useAuthStore((state) => state.hydrate);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // ❌ removed the useEffect that called hydrate()

  useEffect(() => {
    if (token && !loggedInUser) {
      getProfile().finally(() => setIsLoading(false));
    } else if (loggedInUser) {
      setIsLoading(false);
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

  // ================= ROLE‑BASED MENUS =================
  const superadminMenu = [
    { name: "Users", icon: "👥", path: "/components/users" },
    { name: "Batches", icon: "📦", path: "/components/batches" },
    { name: "courses", icon: "📦", path: "/components/courses" },
  ];

  const instructorMenu = [
    { name: "Dashboard", icon: "🏠", path: "/instructor/dashboard" },
    { name: "My Courses", icon: "📚", path: "/instructor/courses" },
    { name: "Live Sessions", icon: "🎥", path: "/instructor/live-sessions" },
    { name: "Assignments to Grade", icon: "📝", path: "/instructor/assignments/review" },
    { name: "Student Progress", icon: "📊", path: "/instructor/progress" },
    { name: "Announcements", icon: "📢", path: "/instructor/announcements" },
    { name: "Profile", icon: "👤", path: "/instructor/profile" },
    { name: "User", icon: "👤", path: "/components/user" },
    { name: "courses", icon: "📦", path: "/components/courses" },
  ];

  const studentMenu = [
    { name: "Dashboard", icon: "🏠", path: "/student/dashboard" },
    { name: "My Courses", icon: "📚", path: "/student/courses" },
    { name: "Assignments", icon: "📝", path: "/student/assignments" },
    { name: "Live Sessions", icon: "🎥", path: "/student/live-sessions" },
    { name: "Certificates", icon: "📜", path: "/student/certificates" },
    { name: "Profile", icon: "👤", path: "/student/profile" },
  ];

  const role = loggedInUser?.role?.toLowerCase() || "student";
  let currentMenu = studentMenu;
  if (role === "superadmin") currentMenu = superadminMenu;
  else if (role === "instructor") currentMenu = instructorMenu;

  const [openMenus, setOpenMenus] = useState({});
  const toggleMenu = (key) => setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

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
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-5">
        <h2 className="text-2xl font-bold mb-8">Ethnotech LMS</h2>
        <nav className="space-y-2 flex-1">
          {currentMenu.map((item) => (
            <div key={item.name}>
              {item.isMaster ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-700"
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span> {item.name}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${openMenus[item.key] ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openMenus[item.key] && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.path}
                          href={sub.path}
                          className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                            pathname === sub.path ? "bg-blue-600" : "hover:bg-gray-700"
                          }`}
                        >
                          <span>{sub.icon}</span> {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                    pathname === item.path ? "bg-blue-600" : "hover:bg-gray-700"
                  }`}
                >
                  <span>{item.icon}</span> {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
          <h1 className="font-semibold text-lg capitalize text-gray-800"></h1>
          <div className="flex items-center gap-5">
            {/* Notifications bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border z-50">
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 hover:bg-gray-50 border-b">
                        <p className="text-sm">{n.message}</p>
                        <p className="text-xs text-gray-400">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full border-2 border-gray-200" />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center gap-3">
                      <img src={avatarUrl} alt={displayName} className="w-12 h-12 rounded-full border-2 border-white" />
                      <div>
                        <p className="font-semibold">{displayName}</p>
                        <p className="text-xs text-gray-500">{displayEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link
                      href={getProfileLink()}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Profile
                    </Link>
                  </div>
                  <div className="border-t p-2">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
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