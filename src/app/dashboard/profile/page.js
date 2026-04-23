"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../../store/login.store";

export default function ProfilePage() {
  const router = useRouter();

  // ✅ Separate selectors – no infinite loop
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const getProfile = useAuthStore((state) => state.getProfile);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const hasFetched = useRef(false);

  // Redirect to login if no token
  useEffect(() => {
    if (!token && typeof window !== "undefined") {
      router.push("/auth/login");
    }
  }, [token, router]);

  // Fetch profile once if token exists and user missing
  useEffect(() => {
    if (token && !user && !loading && !hasFetched.current) {
      hasFetched.current = true;
      getProfile();
    }
  }, [token, user, loading, getProfile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    if (error.toLowerCase().includes("token") || error.toLowerCase().includes("unauthorized")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        router.push("/auth/login");
      }
      return null;
    }
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
        Error: {error}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center gap-6">
            <img
              src={
                user.photo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.fullName || "User"
                )}&background=ffffff&color=3b82f6`
              }
              alt={user.fullName || "User"}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{user.fullName || "Student"}</h2>
              <p className="text-blue-100">Student Profile</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <p className="text-gray-800 font-medium">{user.fullName || "—"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Date of Birth</label>
              <p className="text-gray-800 font-medium">
                {user.dob ? new Date(user.dob).toLocaleDateString() : "—"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Gender</label>
              <p className="text-gray-800 font-medium">{user.gender || "—"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Education</label>
              <p className="text-gray-800 font-medium">{user.education || "—"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Program</label>
              <p className="text-gray-800 font-medium">{user.program || "—"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Branch</label>
              <p className="text-gray-800 font-medium">{user.branch || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}