"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  sendResetOtpService,
  resetPasswordService,
} from "../../../../service/login.service";
import { validateEmail } from "../../shared/validation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = email, 2 = otp+password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Helper to clear specific field error
  const clearFieldError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearFieldError("email");
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value.replace(/\D/g, ""));
    clearFieldError("otp");
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    clearFieldError("newPassword");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    clearFieldError("confirmPassword");
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    setErrors({});
    setMessage("");

    const emailErr = validateEmail(email);
    if (emailErr) {
      setErrors({ email: emailErr });
      toast.error(emailErr);
      return;
    }

    setLoading(true);
    try {
      await sendResetOtpService({ email });
      toast.success("OTP sent to your email. Check spam folder if not received.");
      setMessage("OTP sent to your email. Check spam folder if not received.");
      setStep(2);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to send OTP";
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password
  const handleResetPassword = async () => {
    setErrors({});
    setMessage("");

    const newErrors = {};
    if (!otp) newErrors.otp = "OTP is required";
    if (newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";
    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((err) => toast.error(err));
      return;
    }

    setLoading(true);
    try {
      await resetPasswordService({ email, otp, newPassword });
      toast.success("Password reset successful! Redirecting to login...");
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      const msg = err?.response?.data?.message || "Reset failed";
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4">Reset Password</h1>
        <p className="text-lg text-center max-w-md">
          Enter your email and we'll send you an OTP to reset your password.
        </p>
        <img
          src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400"
          alt="forgot password"
          className="w-80 mt-10 rounded-lg"
        />
      </div>

      {/* Right side */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl p-8 rounded-3xl w-[400px]">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-500">
              {step === 1 ? "Enter your email" : "Enter OTP and new password"}
            </p>
          </div>

          {errors.general && (
            <p className="text-red-500 text-sm mb-3 text-center">{errors.general}</p>
          )}
          {message && (
            <p className="text-green-600 text-sm mb-3 text-center">{message}</p>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center border rounded-xl px-3 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="text-gray-400 mr-2">📧</span>
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full py-2 outline-none bg-transparent"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email}</span>
                )}
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center border rounded-xl px-3 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="text-gray-400 mr-2">🔢</span>
                  <input
                    type="text"
                    placeholder="OTP"
                    className="w-full py-2 outline-none bg-transparent"
                    value={otp}
                    onChange={handleOtpChange}
                  />
                </div>
                {errors.otp && (
                  <span className="text-red-500 text-sm">{errors.otp}</span>
                )}
              </div>
              <div>
                <div className="flex items-center border rounded-xl px-3 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="text-gray-400 mr-2">🔒</span>
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full py-2 outline-none bg-transparent"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                </div>
                {errors.newPassword && (
                  <span className="text-red-500 text-sm">{errors.newPassword}</span>
                )}
              </div>
              <div>
                <div className="flex items-center border rounded-xl px-3 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="text-gray-400 mr-2">🔒</span>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full py-2 outline-none bg-transparent"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </div>
                {errors.confirmPassword && (
                  <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
                )}
              </div>
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          )}

          <p className="text-sm mt-5 text-center">
            Back to{" "}
            <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}