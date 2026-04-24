"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

// ✅ validation
import {
  validateEmail,
  validateMobile,
} from "../../shared/validation";

// ✅ service
import { registerService } from "../../../../service/login.service";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // Helper to clear specific field error
  const clearFieldError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearFieldError("email");
  };

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 10) setMobile(val);
    clearFieldError("mobile");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearFieldError("password");
  };

  // ================= REGISTER API =================
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
      const msg = error?.response?.data?.message || "Registration failed";
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 relative text-blue-800 flex-col justify-center items-center p-10 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
          alt="education"
          className="absolute w-full h-full object-cover"
        />
        <div className="bg-gradient-to-br from-blue-800/80 to-indigo-900/80"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">Ethnotech LMS</h1>
          <p className="text-lg max-w-md opacity-90">
            Smart CRM + LMS platform for managing students, courses & growth 🚀
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl p-8 rounded-3xl w-[420px]">
          <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

          {/* GENERAL ERROR */}
          {errors.general && (
            <p className="text-red-500 text-sm text-center mb-3">{errors.general}</p>
          )}
          {message && (
            <p className="text-green-600 text-sm text-center mb-3">{message}</p>
          )}

          <div className="space-y-4">
            {/* EMAIL */}
            <div>
              <div className="flex items-center border rounded-xl px-3">
                <span className="mr-2">📧</span>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full py-2 outline-none bg-transparent"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* MOBILE */}
            <div>
              <div className="flex items-center border rounded-xl px-3">
                <span className="mr-2">📱</span>
                <input
                  type="text"
                  value={mobile}
                  placeholder="Mobile Number"
                  className="w-full py-2 outline-none bg-transparent"
                  onChange={handleMobileChange}
                />
              </div>
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center border rounded-xl px-3">
                <span className="mr-2">🔒</span>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full py-2 outline-none bg-transparent"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:scale-[1.03] transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-sm text-center mt-3">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}