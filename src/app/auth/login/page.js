"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  validateEmail,
  validateMobile,
  validateOtp,
} from "../../shared/validation";



import {
  loginService, sendOtpService,
  verifyOtpService,
} from "../../../../service/login.service";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // ================= LOGIN =================
  const handleLogin = async () => {
    let newErrors = {};
    setErrors({});
    setMessage("");

    if (mode === "email") {
      const emailErr = validateEmail(email);
      if (emailErr) newErrors.email = emailErr;

      if (password.length < 6) {
        newErrors.password = "Minimum 6 characters required";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      try {
        const res = await loginService({
          email,
          password,
        });
        if (res?.token) {
          localStorage.setItem("token", res.token);
          router.push("/dashboard/admin");

        } else {
          setErrors({ general: "Invalid email or password" });
        }
      } catch (error) {
        setErrors({
          general:
            error?.response?.data?.message ||
            "Invalid email or password",
        });
      }
    } else {
      // ================= OTP LOGIN =================
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
        return;
      }

      try {
        const res = await verifyOtpService({
          mobile,
          otp,
        });
        if (res?.token) {
          localStorage.setItem("token", res.token);
          router.push("/dashboard/admin");

        } else {
          setErrors({ general: "Invalid OTP" });
        }
      } catch (error) {
        setErrors({
          general:
            error?.response?.data?.message || "Invalid OTP",
        });
      }
    }
  };

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    setErrors({});
    setMessage("");

    const mobileErr = validateMobile(mobile);
    if (mobileErr) {
      setErrors({ mobile: mobileErr });
      return;
    }

    try {
      const res = await sendOtpService({ mobile });

      if (res) {
        setOtpSent(true);
        setMessage("OTP sent successfully");
      }
    } catch (error) {
      setErrors({
        mobile:
          error?.response?.data?.message ||
          "Failed to send OTP",
      });
    }
  };

  return (
    <div className="flex h-screen">

      {/* 🔹 LEFT SIDE (UNCHANGED) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4">Ethnotech LMS</h1>
        <p className="text-lg text-center max-w-md">
          Manage your students, courses, and leads in one powerful CRM + LMS platform.
        </p>

        <img
          src="https://illustrations.popsy.co/blue/work-from-home.svg"
          alt="illustration"
          className="w-80 mt-10"
        />
      </div>

      {/* 🔹 RIGHT SIDE (UNCHANGED UI) */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">

        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl p-8 rounded-3xl w-[400px]">

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h2>
            <p className="text-sm text-gray-500">Login to your account</p>
          </div>

          {/* Toggle */}
          <div className="mb-6">
            <div className="relative flex bg-gray-200 rounded-xl p-1">

              <div
                className={`absolute top-1 bottom-1 w-1/2 rounded-lg bg-white shadow transition-all duration-300 ${mode === "email" ? "left-1" : "left-1/2"
                  }`}
              ></div>

              <button
                onClick={() => {
                  setMode("email");
                  setErrors({});
                  setMessage("");
                }}
                className="relative z-10 flex-1 py-2 text-sm font-medium text-gray-700"
              >
                Email
              </button>

              <button
                onClick={() => {
                  setMode("otp");
                  setErrors({});
                  setMessage("");
                }}
                className="relative z-10 flex-1 py-2 text-sm font-medium text-gray-700"
              >
                OTP
              </button>
            </div>
          </div>

          {/* ERRORS */}
          {errors.general && (
            <p className="text-red-500 text-sm mb-3 text-center">
              {errors.general}
            </p>
          )}

          {message && (
            <p className="text-green-600 text-sm mb-3 text-center">
              {message}
            </p>
          )}

          {/* EMAIL UI */}
          {mode === "email" && (
            <div className="space-y-4">

              <div>
                <div className="flex items-center border rounded-xl px-3 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="text-gray-400 mr-2">📧</span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full py-2 outline-none bg-transparent"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center border rounded-xl px-3 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="text-gray-400 mr-2">🔒</span>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full py-2 outline-none bg-transparent"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* OTP UI */}
          {mode === "otp" && (
            <div className="space-y-4">

              <div>
                <div className="flex items-center border rounded-xl px-3 focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="text-gray-400 mr-2">📱</span>
                  <input
                    type="text"
                    value={mobile}
                    placeholder="Enter mobile number"
                    className="w-full py-2 outline-none bg-transparent"
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
                {errors.mobile && (
                  <span className="text-red-500 text-sm">
                    {errors.mobile}
                  </span>
                )}
              </div>

              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full text-blue-600 font-medium text-sm text-right"
                >
                  Send OTP
                </button>
              ) : (
                <div>
                  <div className="flex items-center border rounded-xl px-3 focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="text-gray-400 mr-2">🔢</span>
                    <input
                      type="text"
                      value={otp}
                      placeholder="Enter OTP"
                      className="w-full py-2 outline-none bg-transparent"
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>

                  {errors.otp && (
                    <span className="text-red-500 text-sm">
                      {errors.otp}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            className="w-full mt-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:scale-[1.02] transition"
          >
            Continue
          </button>

          <p className="text-sm mt-5 text-center">
            Don’t have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}