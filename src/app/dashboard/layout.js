"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../../store/login.store";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Correct store selectors – separate calls, no object creation
  const loggedInUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const getProfile = useAuthStore((state) => state.getProfile);
  const logout = useAuthStore((state) => state.logout);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [openMenus, setOpenMenus] = useState({ userManagement: true });

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
  hydrate();
}, [hydrate]);

  // Fetch user profile if token exists but user is missing
  useEffect(() => {
    if (token && !loggedInUser) {
      getProfile();
    }
  }, [token, loggedInUser, getProfile]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Menu structure
  const menuItems = [
    {
      name: "User Management",
      icon: "👤",
      isMaster: true,
      subItems: [
        { name: "Users", path: "/dashboard/user", icon: "👥" },
        { name: "Roles", path: "/dashboard/roles", icon: "🔑" },
        // { name: "Permissions", path: "/dashboard/permissions", icon: "🔒" },
      ],
    },
    { name: "Courses", path: "/dashboard/courses", icon: "📚" },
    { name: "Students", path: "/dashboard/students", icon: "🎓" },
  ];

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  // Use real user data if available, otherwise fallback
  const displayName = loggedInUser?.fullName || loggedInUser?.name || "User";
  const displayEmail = loggedInUser?.email || "";
  const avatarUrl = loggedInUser?.photo
    ? loggedInUser.photo
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        displayName
      )}&background=3b82f6&color=fff`;

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New lead assigned to you",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      message: "Course completion certificate ready",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      message: "Meeting scheduled for tomorrow",
      time: "3 hours ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ✅ Correct logout – clears storage and store state
  const handleLogout = () => {
    logout();
    router.push("/auth/login");
    // Optional: force full reload
    // window.location.href = "/auth/login";
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-5">
        <h2 className="text-2xl font-bold mb-8">Ethnotech CRM</h2>
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.isMaster ? (
                <div>
                  <button
                    onClick={() => toggleMenu("userManagement")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded transition hover:bg-gray-700"
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      {item.name}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        openMenus.userManagement ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openMenus.userManagement && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.path}
                          href={sub.path}
                          className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                            pathname === sub.path
                              ? "bg-blue-600"
                              : "hover:bg-gray-700"
                          }`}
                        >
                          <span>{sub.icon}</span>
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                    pathname === item.path
                      ? "bg-blue-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
          <h1 className="font-semibold text-lg capitalize text-gray-800"></h1>

          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden transition-all duration-200 ease-out">
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 text-sm">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                            !notif.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 mt-2 rounded-full ${
                                !notif.read ? "bg-blue-500" : "bg-gray-300"
                              }`}
                            ></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 text-center border-t bg-gray-50">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View all notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile - Real user data */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full transition-transform hover:scale-105"
              >
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-sm"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-12 h-12 rounded-full border-2 border-white shadow"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500">{displayEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Your Profile
                    </Link>
                    {/* <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
                    </Link> */}
                  </div>
                  <div className="border-t p-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Separate Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition flex items-center gap-2 shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </header>

        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}