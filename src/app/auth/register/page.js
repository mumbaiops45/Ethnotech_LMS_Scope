"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ✅ import validation service
import {
  validateName,
  validateEmail,
  validateMobile,
  validateOtp,
} from "../../utils/validation";

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // ✅ STEP 1 VALIDATION
  const handleSendOtp = () => {
    let newErrors = {};
    setErrors({});
    setMessage("");

    const nameErr = validateName(name);
    if (nameErr) newErrors.name = nameErr;

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const mobileErr = validateMobile(mobile);
    if (mobileErr) newErrors.mobile = mobileErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setMessage("OTP sent successfully (demo: 1234)");
    setStep(2);
  };

  // ✅ STEP 2 VALIDATION
  const handleVerifyOtp = () => {
    let newErrors = {};
    setErrors({});
    setMessage("");

    const otpErr = validateOtp(otp);
    if (otpErr) newErrors.otp = otpErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (otp === "123456") {
      setStep(3);
    } else {
      setErrors({ general: "Invalid OTP" });
    }
  };

  return (
    <div className="flex h-screen">

      {/* 🔹 LEFT SIDE (UNCHANGED) */}
      <div className="hidden md:flex w-1/2 relative text-white flex-col justify-center items-center p-10 overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
          alt="education"
          className="absolute w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/80 to-indigo-900/80"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">Ethnotech LMS</h1>
          <p className="text-lg max-w-md opacity-90">
            Smart CRM + LMS platform for managing students, courses & growth 🚀
          </p>
        </div>
      </div>

      {/* 🔹 RIGHT SIDE (UNCHANGED UI) */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">

        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl p-8 rounded-3xl w-[420px]">

          <h2 className="text-3xl font-bold text-center mb-6">
            {step === 1 && "Create Account"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Success 🎉"}
          </h2>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">

              <div>
                <div className="flex items-center border rounded-xl px-3">
                  <span className="mr-2">👤</span>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full py-2 outline-none bg-transparent"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <div className="flex items-center border rounded-xl px-3">
                  <span className="mr-2">📧</span>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full py-2 outline-none bg-transparent"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center border rounded-xl px-3">
                  <span className="mr-2">📱</span>
                  <input
                    type="text"
                    value={mobile}
                    placeholder="Mobile Number"
                    className="w-full py-2 outline-none bg-transparent"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 10) setMobile(val);
                    }}
                  />
                </div>
                {errors.mobile && (
                  <p className="text-red-500 text-sm">{errors.mobile}</p>
                )}
              </div>

              <button
                onClick={handleSendOtp}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:scale-[1.03] transition"
              >
                Send OTP
              </button>

              <p className="text-sm text-center mt-3">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">
                  Login
                </Link>
              </p>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5 text-center">

              <p className="text-gray-600 text-sm">
                OTP sent to <span className="font-semibold">{mobile}</span>
              </p>

              <div className="flex justify-between gap-2">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center border rounded-xl text-lg"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (!val) return;
                      const newOtp = otp.split("");
                      newOtp[i] = val;
                      setOtp(newOtp.join(""));
                    }}
                  />
                ))}
              </div>

              {errors.otp && (
                <p className="text-red-500 text-sm">{errors.otp}</p>
              )}

              <button
                onClick={handleVerifyOtp}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-md hover:scale-[1.03] transition"
              >
                Verify & Register
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="text-center space-y-4">

              <div className="text-5xl">✅</div>

              <h3 className="text-xl font-semibold text-green-600">
                Registration Successful
              </h3>

              <p className="text-gray-500 text-sm">
                Email verification link has been sent.
              </p>

              <button
                onClick={() => router.push("/auth/login")}
                className="w-full py-2 rounded-xl bg-blue-600 text-white"
              >
                Go to Login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}