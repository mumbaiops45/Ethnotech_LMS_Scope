"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  validateEmail,
  validateMobile,
  validateOtp,
} from "../../shared/validation";

import { loginService,adminLoginService,sendOtpService,verifyOtpService } from "../../../../service/login.service";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const clearFieldError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  // ================= LOGIN =================
  const handleLogin = async () => {
    let newErrors = {};
    setErrors({});
    setMessage("");
    setLoading(true);

    if (mode === "email") {
      const emailErr = validateEmail(email);
      if (emailErr) newErrors.email = emailErr;
      if (password.length < 6) newErrors.password = "Minimum 6 characters required";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      try {
        let loginApi;
        if (selectedRole === "student") {
          loginApi = loginService;          // POST /student/login
        } else {
          loginApi = adminLoginService;     // POST /admin/login (superadmin & instructor)
        }

        const res = await loginApi({ email, password });
        if (res?.token) {
          localStorage.setItem("token", res.token);
          toast.success(`Welcome ${selectedRole}! 🎉`);
          setTimeout(() => router.push("/dashboard/admin"), 500);
        } else {
          throw new Error("Invalid credentials – no token received");
        }
      } catch (error) {
        const msg = error?.response?.data?.message || error?.message || "Login failed";
        toast.error(msg);
        setErrors({ general: msg });
      } finally {
        setLoading(false);
      }
    } else {
      // OTP LOGIN – only available for students
      if (selectedRole !== "student") {
        toast.error("OTP login is only available for students");
        setLoading(false);
        return;
      }

      const mobileErr = validateMobile(mobile);
      if (mobileErr) newErrors.mobile = mobileErr;
      if (!otpSent) {
        newErrors.otp = "Please send OTP first";
      } else {
        const otpErr = validateOtp(otp);
        if (otpErr) newErrors.otp = otpErr;
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyOtpService({ mobile, otp });
        if (res?.token) {
          localStorage.setItem("token", res.token);
          toast.success(`Welcome ${selectedRole}! 🎉`);
          setTimeout(() => router.push("/dashboard/admin"), 500);
        } else {
          throw new Error("Invalid OTP");
        }
      } catch (error) {
        const msg = error?.response?.data?.message || error?.message || "Invalid OTP";
        toast.error(msg);
        setErrors({ general: msg });
        setOtpSent(false);
      } finally {
        setLoading(false);
      }
    }
  };

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    clearFieldError("mobile");
    setMessage("");
    setLoading(true);

    const mobileErr = validateMobile(mobile);
    if (mobileErr) {
      setErrors({ mobile: mobileErr });
      setLoading(false);
      return;
    }

    try {
      const res = await sendOtpService({ mobile });
      if (res) {
        setOtpSent(true);
        toast.success("OTP sent successfully 📩");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to send OTP";
      toast.error(msg);
      setErrors({ mobile: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearFieldError("email");
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearFieldError("password");
  };
  const handleMobileChange = (e) => {
    setMobile(e.target.value.replace(/\D/g, ""));
    clearFieldError("mobile");
  };
  const handleOtpChange = (e) => {
    setOtp(e.target.value.replace(/\D/g, ""));
    clearFieldError("otp");
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDE - ILLUSTRATION */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center max-w-md">
          <h1 className="text-5xl font-bold mb-4">Ethnotech LMS</h1>
          <p className="text-lg opacity-90">
            All‑in‑one CRM + LMS platform for students, instructors & admins.
          </p>
        </div>
        <img
          src="https://illustrations.popsy.co/white/work-from-home.svg"
          alt="illustration"
          className="relative z-10 w-80 mt-12 opacity-90"
        />
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>

          {/* Role Selector */}
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">Login as</p>
            <div className="flex justify-center gap-4">
              {[
                { value: "superadmin", label: "Super Admin", icon: "👑" },
                { value: "student", label: "Student", icon: "🎓" },
                { value: "instructor", label: "Instructor", icon: "👨‍🏫" },
              ].map((role) => (
                <label
                  key={role.value}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl cursor-pointer transition-all ${
                    selectedRole === role.value
                      ? "bg-blue-50 text-blue-700 ring-2 ring-blue-500"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={() => {
                      setSelectedRole(role.value);
                      // Disable OTP mode if non‑student
                      if (role.value !== "student" && mode === "otp") {
                        setMode("email");
                      }
                    }}
                    className="hidden"
                  />
                  <span className="text-2xl">{role.icon}</span>
                  <span className="text-xs font-medium">{role.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Toggle Email / OTP (OTP disabled for non‑students) */}
          <div className="mb-6">
            <div className="relative flex bg-gray-100 rounded-xl p-1">
              <div
                className={`absolute top-1 bottom-1 w-1/2 rounded-lg bg-white shadow-sm transition-all duration-300 ${
                  mode === "email" ? "left-1" : "left-1/2"
                }`}
              />
              <button
                onClick={() => {
                  setMode("email");
                  setErrors({});
                  setMessage("");
                  setOtpSent(false);
                }}
                className="relative z-10 flex-1 py-2 text-sm font-medium transition-colors"
              >
                Email
              </button>
              <button
                onClick={() => {
                  if (selectedRole !== "student") {
                    toast.error("OTP login is only available for students");
                    return;
                  }
                  setMode("otp");
                  setErrors({});
                  setMessage("");
                  setOtpSent(false);
                }}
                className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors ${
                  selectedRole !== "student" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                OTP
              </button>
            </div>
          </div>

          {errors.general && (
            <p className="text-red-500 text-sm mb-4 text-center">{errors.general}</p>
          )}
          {message && (
            <p className="text-green-600 text-sm mb-4 text-center">{message}</p>
          )}

          {/* EMAIL LOGIN */}
          {mode === "email" && (
            <div className="space-y-5">
              <div>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    placeholder=" "
                    value={email}
                    onChange={handleEmailChange}
                    className="peer w-full border border-gray-300 rounded-xl px-4 py-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-3 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
                  >
                    Email address
                  </label>
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    placeholder=" "
                    value={password}
                    onChange={handlePasswordChange}
                    className="peer w-full border border-gray-300 rounded-xl px-4 py-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-3 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
                  >
                    Password
                  </label>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                <div className="text-right mt-2">
                  <Link href="/auth/resetPass" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* OTP LOGIN */}
          {mode === "otp" && (
            <div className="space-y-5">
              <div>
                <div className="relative">
                  <input
                    type="tel"
                    id="mobile"
                    placeholder=" "
                    value={mobile}
                    onChange={handleMobileChange}
                    className="peer w-full border border-gray-300 rounded-xl px-4 py-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <label
                    htmlFor="mobile"
                    className="absolute left-3 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
                  >
                    Mobile number
                  </label>
                </div>
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>

              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-blue-600 text-sm font-medium hover:underline text-right w-full transition"
                >
                  {loading ? "Sending..." : "Send OTP →"}
                </button>
              ) : (
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      id="otp"
                      placeholder=" "
                      value={otp}
                      onChange={handleOtpChange}
                      className="peer w-full border border-gray-300 rounded-xl px-4 py-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <label
                      htmlFor="otp"
                      className="absolute left-3 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600"
                    >
                      OTP
                    </label>
                  </div>
                  {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
                </div>
              )}
            </div>
          )}

          {/* CONTINUE BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : "Continue"}
          </button>

          {/* REGISTRATION LINK (only for students) */}
          {selectedRole === "student" && (
            <p className="text-sm text-center mt-6 text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}