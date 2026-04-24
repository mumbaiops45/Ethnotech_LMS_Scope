"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../../store/login.store";
import { updateProfileService } from "../../../../service/login.service";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const getProfile = useAuthStore((state) => state.getProfile);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  const hasFetched = useRef(false);

  // Wait for hydration – redirect only after hydration
  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) router.push("/auth/login");
  }, [hasHydrated, token, router]);

  // Fetch profile once after hydration
  useEffect(() => {
    if (hasHydrated && token && !user && !loading && !hasFetched.current) {
      hasFetched.current = true;
      getProfile();
    }
  }, [hasHydrated, token, user, loading, getProfile]);

  // Populate form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        photo: user.photo || "",
        dob: user.dob ? user.dob.split("T")[0] : "",
        gender: user.gender || "",
        education: user.education || "",
        program: user.program || "",
        branch: user.branch || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Compress & resize image before converting to Base64 to avoid 413 error
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    setUploadingImage(true);
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target.result;
    };

    img.onload = () => {
      let width = img.width;
      let height = img.height;
      const MAX_SIZE = 300;

      if (width > height && width > MAX_SIZE) {
        height = (height * MAX_SIZE) / width;
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width = (width * MAX_SIZE) / height;
        height = MAX_SIZE;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
      setFormData((prev) => ({ ...prev, photo: compressedBase64 }));
      setUploadingImage(false);
      toast.success("Image ready – click Save Changes");
    };

    img.onerror = () => {
      toast.error("Failed to load image");
      setUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

 const handleUpdateProfile = async () => {
  if (!formData.fullName.trim()) {
    toast.error("Full name is required");
    return;
  }

  setLoadingUpdate(true);
  try {
    await updateProfileService(formData);
    // Force refresh from backend
    await getProfile(true);   // true forces the API call
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  } catch (err) {
    const msg = err?.response?.data?.message || "Update failed";
    toast.error(msg);
  } finally {
    setLoadingUpdate(false);
  }
};

  if (!hasHydrated || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    if (error.toLowerCase().includes("token") || error.toLowerCase().includes("unauthorized")) {
      if (typeof window !== "undefined") localStorage.removeItem("token");
      router.push("/auth/login");
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with action button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Avatar & header section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-6 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={
                  formData.photo ||
                  user.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.fullName || "User"
                  )}&background=ffffff&color=3b82f6&size=128`
                }
                alt={user.fullName || "User"}
                className={`w-24 h-24 rounded-full border-4 border-white shadow-md object-cover ${
                  isEditing ? "cursor-pointer hover:opacity-80 transition" : ""
                }`}
                onClick={isEditing ? triggerFileInput : undefined}
              />
              {isEditing && (
                <>
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100 transition"
                    disabled={uploadingImage}
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user.fullName || "Student"}</h2>
              <p className="text-blue-100">Student Profile</p>
            </div>
          </div>
        </div>

        {/* Form / View fields */}
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                  <input
                    type="text"
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={handleUpdateProfile}
                  disabled={loadingUpdate || uploadingImage}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loadingUpdate ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      fullName: user.fullName || "",
                      photo: user.photo || "",
                      dob: user.dob ? user.dob.split("T")[0] : "",
                      gender: user.gender || "",
                      education: user.education || "",
                      program: user.program || "",
                      branch: user.branch || "",
                    });
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}