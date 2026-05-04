"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { validateEmail, validateMobile } from "../../shared/validation";
import { registerService } from "../../../../service/login.service";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const clearFieldError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      general: undefined,
    }));
  };

  const handleRegister = async () => {
    let newErrors = {};

    setErrors({});
    setMessage("");
    setLoading(true);

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const mobileErr = validateMobile(mobile);
    if (mobileErr) newErrors.mobile = mobileErr;

    if (password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await registerService({
        mobile,
        email,
        password,
      });

      toast.success("Registration successful! 🎉 Redirecting to login...");

      setMessage("Registration successful 🎉");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Registration failed";

      toast.error(msg);

      setErrors({
        general: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* LEFT SIDE */}
      
<div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            {/* Header */}
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--primary)] font-semibold">
                New Here?
              </p>

              <h1 className="text-4xl font-bold text-gray-800 mt-2">
                Create Account
              </h1>

              <p className="text-gray-500 mt-2">
                Fill in your details to get started for free.
              </p>
            </div>

            {/* Error */}
            {errors.general && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {errors.general}
              </div>
            )}

            {/* Success */}
            {message && (
              <div className="mb-5 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl">
                {message}
              </div>
            )}

            {/* Fields */}
            <div className="space-y-5">
              {/* Email */}
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
                  autoComplete="email"
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

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  placeholder="10-digit number"
                  value={mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");

                    if (val.length <= 10) {
                      setMobile(val);
                    }

                    clearFieldError("mobile");
                  }}
                  autoComplete="tel"
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

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError("password");
                  }}
                  autoComplete="new-password"
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                    errors.password
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />

                {errors.password ? (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Use letters, numbers, and symbols for a stronger password.
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full mt-8 bg-[var(--primary)] hover:opacity-90 text-white py-3.5 rounded-xl font-medium transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[var(--primary)] font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* RIGHT SIDE */}
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
             
            </div>
          </div>

          {/* Hero */}
          <div className="max-w-xl">
            <p className="uppercase tracking-[0.3em] text-sm text-white/70 mb-5">
              Get Started Today
            </p>

            <h1 className="text-6xl font-bold leading-tight">
              Your journey
              <br />
              starts here.
            </h1>

            <p className="mt-6 text-lg text-white/80 leading-8">
              Join thousands of learners and instructors on the platform built
              for modern education.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6 pt-8 border-t border-white/20">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-sm font-semibold">
                1
              </div>

              <div>
                <h3 className="font-semibold">Create your account</h3>
                <p className="text-sm text-white/70">
                  Takes less than a minute
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-sm font-semibold">
                2
              </div>

              <div>
                <h3 className="font-semibold">Explore courses</h3>
                <p className="text-sm text-white/70">
                  Browse 340+ curated programmes
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-sm font-semibold">
                3
              </div>

              <div>
                <h3 className="font-semibold">Track progress</h3>
                <p className="text-sm text-white/70">
                  Real-time dashboards & certificates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}