"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../../store/login.store";
import {
    createProfileService,
    updateProfileService,
    updateAdmin,
    getInstructorProfileService,
    updateInstructorProfileService,
} from "../../../../service/login.service";

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

    // Role detection
    const role = user?.role || "";
    const isInstructor = role === "Instructor";
    const isSuperAdmin = role === "SuperAdmin" || role === "superadmin";
    const isStudent = !isInstructor && !isSuperAdmin;

    // Profile existence helpers
    const hasStudentProfile = isStudent && user?.fullName?.trim() !== "";
    const hasProfile = isSuperAdmin ? true : (isInstructor ? true : hasStudentProfile);

    // Redirect if no token
    useEffect(() => {
        if (!hasHydrated) return;
        if (!token) router.push("/auth/login");
    }, [hasHydrated, token, router]);

    // Fetch profile if missing (only for students & instructors)
    useEffect(() => {
        if (!hasHydrated) return;
        if (!token) return;
        if (user && !loading && !hasFetched.current) {
            hasFetched.current = true;
            if (isStudent && !user.fullName) {
                getProfile();
            } else if (isInstructor && (!user.email || !user.fullName)) {
                fetchInstructorProfile();
            }
        }
    }, [hasHydrated, token, user, loading, getProfile, isStudent, isInstructor]);

    const fetchInstructorProfile = async () => {
        try {
            const data = await getInstructorProfileService();
            useAuthStore.setState({ user: data });
        } catch (err) {
            console.error("Failed to fetch instructor profile", err);
            toast.error("Could not load instructor profile");
        }
    };

    // Populate form data when user loads
    useEffect(() => {
        if (user && typeof user === "object") {
            if (isSuperAdmin) {
                setFormData({
                    fullName: user.fullName || "",
                    email: user.email || "",
                    mobile: user.mobile || "",
                    role: user.role || "",
                    branch: user.branch || "",
                    gender: user.gender || "",
                });
            } else if (isInstructor) {
                setFormData({
                    fullName: user.fullName || "",
                    email: user.email || "",
                    mobile: user.mobile || "",
                    role: user.role || "",
                    branch: user.branch || "",
                    gender: user.gender || "",
                    photo: user.photo || "",
                });
            } else {
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
        }
    }, [user, isSuperAdmin, isInstructor]);

    // Auto‑open edit mode for students without profile
    useEffect(() => {
        if (hasHydrated && !loading && isStudent && user && !hasStudentProfile && !isEditing) {
            setIsEditing(true);
        }
    }, [hasHydrated, loading, user, hasStudentProfile, isEditing, isStudent]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (!isStudent) return;
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
        reader.onload = (event) => (img.src = event.target.result);
        img.onload = () => {
            let width = img.width,
                height = img.height;
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

    const triggerFileInput = () => fileInputRef.current?.click();

    const handleSaveProfile = async () => {
        if (!formData.fullName?.trim()) {
            toast.error("Full name is required");
            return;
        }
        setLoadingUpdate(true);
        try {
            if (isSuperAdmin) {
                await updateAdmin(user._id, {
                    fullName: formData.fullName,
                    email: formData.email,
                    mobile: formData.mobile,
                    role: formData.role,
                    branch: formData.branch,
                    gender: formData.gender,
                });
                toast.success("Admin profile updated!");
                useAuthStore.setState({ user: { ...user, ...formData } });
                setIsEditing(false);
            } else if (isInstructor) {
                await useAuthStore.getState().updateInstructorProfile(formData);
                toast.success("Profile updated!");
                setIsEditing(false);
            }
            else {
                // Student
                if (hasStudentProfile) {
                    await updateProfileService(formData);
                    toast.success("Profile updated!");
                } else {
                    await createProfileService(formData);
                    toast.success("Profile created!");
                }
                await getProfile(true);
                setIsEditing(false);
            }
        } catch (err) {
            console.error("Save error:", err);
            const msg = err?.response?.data?.message || "Operation failed";
            toast.error(msg);
        } finally {
            setLoadingUpdate(false);
        }
    };

    // Loading / error states
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {isSuperAdmin ? "Super Admin Profile" : isInstructor ? "Instructor Profile" : hasStudentProfile ? "My Profile" : "Complete Your Profile"}
                </h1>
                {!isEditing && hasProfile && (
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

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Avatar header – only for students or instructors with photo */}
                {!isSuperAdmin && (isEditing || hasProfile) && (
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-6 text-white">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative">
                                <img
                                    src={
                                        formData.photo ||
                                        (user.photo) ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || "User")}&background=ffffff&color=3b82f6&size=128`
                                    }
                                    alt={formData.fullName || "User"}
                                    className={`w-24 h-24 rounded-full border-4 border-white shadow-md object-cover ${isEditing ? "cursor-pointer hover:opacity-80 transition" : ""
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
                                <h2 className="text-2xl font-bold">{formData.fullName || "User"}</h2>
                                <p className="text-blue-100">{isSuperAdmin ? "Super Admin" : isInstructor ? "Instructor" : "Student"} Profile</p>
                            </div>
                        </div>
                    </div>
                )}

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
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {(isSuperAdmin || isInstructor) ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                            <input
                                                type="text"
                                                name="role"
                                                value={formData.role}
                                                disabled
                                                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    // Student fields
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
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
                                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                                            <input
                                                type="text"
                                                name="program"
                                                value={formData.program}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL (optional)</label>
                                            <input
                                                type="text"
                                                name="photo"
                                                value={formData.photo}
                                                onChange={handleInputChange}
                                                placeholder="https://example.com/photo.jpg"
                                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Or click on the avatar to upload an image.</p>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                                    <input
                                        type="text"
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {(isSuperAdmin || isInstructor) && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={loadingUpdate || uploadingImage}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                >
                                    {loadingUpdate ? "Saving..." : "Save Changes"}
                                </button>
                                {hasProfile && (
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            // Reset to original user data
                                            if (isSuperAdmin) {
                                                setFormData({
                                                    fullName: user.fullName || "",
                                                    email: user.email || "",
                                                    mobile: user.mobile || "",
                                                    role: user.role || "",
                                                    branch: user.branch || "",
                                                    gender: user.gender || "",
                                                });
                                            } else if (isInstructor) {
                                                setFormData({
                                                    fullName: user.fullName || "",
                                                    email: user.email || "",
                                                    mobile: user.mobile || "",
                                                    role: user.role || "",
                                                    branch: user.branch || "",
                                                    gender: user.gender || "",
                                                    photo: user.photo || "",
                                                });
                                            } else {
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
                                        }}
                                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-500">Full Name</label>
                                <p className="text-gray-800 font-medium">{user.fullName || "—"}</p>
                            </div>
                            {(isSuperAdmin || isInstructor) ? (
                                <>
                                    <div>
                                        <label className="text-sm text-gray-500">Email</label>
                                        <p className="text-gray-800 font-medium">{user.email || "—"}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Mobile</label>
                                        <p className="text-gray-800 font-medium">{user.mobile || "—"}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Role</label>
                                        <p className="text-gray-800 font-medium">{user.role || "—"}</p>
                                    </div>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                            <div>
                                <label className="text-sm text-gray-500">Branch</label>
                                <p className="text-gray-800 font-medium">{user.branch || "—"}</p>
                            </div>
                            {(isSuperAdmin || isInstructor) && (
                                <div>
                                    <label className="text-sm text-gray-500">Gender</label>
                                    <p className="text-gray-800 font-medium">{user.gender || "—"}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}