"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../../store/login.store";
import {
  validateEmail,
  validateMobile,
  validateOtp,
  validatePassword,
} from "../../shared/validation";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const sendOtp = useAuthStore((state) => state.sendOtp);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);

  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const clearFieldError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      general: undefined,
    }));
  };

  const handleLogin = async () => {
    let newErrors = {};
    setErrors({});
    setMessage("");
    setLoading(true);

    if (mode === "email") {
      const emailErr = validateEmail(email);
      if (emailErr) newErrors.email = emailErr;

      const passwordErr = validatePassword(password);
      if (passwordErr) newErrors.password = passwordErr;

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      try {
        await login({
          email: email.trim(),
          password: password.trim(),
        });

        await new Promise((resolve) => setTimeout(resolve, 500));

        const user = useAuthStore.getState().user;
        const userRole = user?.role;

        toast.success(`Welcome ${userRole}! 🎉`);

        if (userRole === "SuperAdmin") {
          router.push("/components/dashboard");
        } else if (userRole === "Instructor") {
          router.push("/instructor/dashboard");
        } else {
          router.push("/student/dashboard");
        }
      } catch (error) {
        toast.error(error?.message || "Login failed");
        setErrors({
          general: error?.message || "Login failed",
        });
      } finally {
        setLoading(false);
      }
    } else {
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
        await verifyOtp({ mobile, otp });

        const user = useAuthStore.getState().user;
        const userRole = user?.role;

        toast.success(`Welcome! 🎉`);

        if (userRole === "SuperAdmin") {
          router.push("/components/user");
        } else if (userRole === "Instructor") {
          router.push("/instructor/dashboard");
        } else {
          router.push("/student/dashboard");
        }
      } catch (error) {
        toast.error(error?.message || "Invalid OTP");

        setErrors({
          general: error?.message || "Invalid OTP",
        });

        setOtpSent(false);
      } finally {
        setLoading(false);
      }
    }
  };

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
      await sendOtp({ mobile });

      setOtpSent(true);

      toast.success("OTP sent");
    } catch (error) {
      toast.error(error?.message || "Failed to send OTP");

      setErrors({
        mobile: error?.message || "Failed to send OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--primary)]">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 flex flex-col justify-between h-full p-14 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white text-[var(--primary)] font-bold flex items-center justify-center text-xl shadow-lg">
              E
            </div>

            <div>
              <h2 className="text-xl font-bold">Ethnotech</h2>
              <p className="text-sm text-white/80">
                Learning Management System
              </p>
            </div>
          </div>

          {/* Hero */}
          <div className="max-w-xl">
            <p className="uppercase tracking-[0.3em] text-sm text-white/70 mb-5">
              Welcome Back
            </p>

            <h1 className="text-6xl font-bold leading-tight">
              Learn.
              <br />
              Grow.
              <br />
              Succeed.
            </h1>

            <p className="mt-6 text-lg text-white/80 leading-8">
              Continue learning. Track progress. Achieve more every day.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
            <div>
              <h3 className="text-3xl font-bold">12k+</h3>
              <p className="text-sm text-white/70 mt-1">Students</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">340+</h3>
              <p className="text-sm text-white/70 mt-1">Courses</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">98%</h3>
              <p className="text-sm text-white/70 mt-1">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            {/* Header */}
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--primary)] font-semibold">
                Welcome Back
              </p>

              <h1 className="text-4xl font-bold text-gray-800 mt-2">
                Sign In
              </h1>

              <p className="text-gray-500 mt-2">
                Access your dashboard and continue learning.
              </p>
            </div>

            {/* Toggle */}
            <div className="bg-gray-100 rounded-xl p-1 flex mb-6 relative">
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-[var(--primary)] transition-all duration-300 ${
                  mode === "email" ? "left-1" : "left-1/2"
                }`}
              />

              <button
                type="button"
                onClick={() => {
                  setMode("email");
                  setErrors({});
                  setMessage("");
                  setOtpSent(false);
                }}
                className={`relative z-10 flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                  mode === "email"
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Email
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("otp");
                  setErrors({});
                  setMessage("");
                  setOtpSent(false);
                }}
                className={`relative z-10 flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                  mode === "otp"
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                OTP
              </button>
            </div>

            {/* Error */}
            {errors.general && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {errors.general}
              </div>
            )}

            {message && (
              <div className="mb-5 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl">
                {message}
              </div>
            )}

            {/* EMAIL LOGIN */}
            {mode === "email" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearFieldError("email");
                    }}
                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      errors.email
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />

                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFieldError("password");
                    }}
                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      errors.password
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />

                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}

                  <div className="mt-2 text-right">
                    <Link
                      href="/auth/resetPass"
                      className="text-sm text-[var(--primary)] hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* OTP LOGIN */}
            {mode === "otp" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value.replace(/\D/g, ""));
                      clearFieldError("mobile");
                    }}
                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      errors.mobile
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />

                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="text-sm font-medium text-[var(--primary)] hover:underline"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OTP
                    </label>

                    <input
                      type="text"
                      placeholder="6-digit code"
                      value={otp}
                      maxLength={6}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ""));
                        clearFieldError("otp");
                      }}
                      className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                        errors.otp
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                    />

                    {errors.otp && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.otp}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-8 bg-[var(--primary)] hover:opacity-90 text-white py-3.5 rounded-xl font-medium transition disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Continue"}
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[var(--primary)] font-medium hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}