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
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
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
        await login({ email: email.trim(), password: password.trim() });
        await new Promise((resolve) => setTimeout(resolve, 500));
        const user = useAuthStore.getState().user;
        const userRole = user?.role;
        toast.success(`Welcome ${userRole}! 🎉`);
        if (userRole === "SuperAdmin") router.push("/components/dashboard");
        else if (userRole === "Instructor") router.push("/instructor/dashboard");
        else router.push("/student/dashboard");
      } catch (error) {
        toast.error(error?.message || "Login failed");
        setErrors({ general: error?.message || "Login failed" });
      } finally {
        setLoading(false);
      }
    } else {
      const mobileErr = validateMobile(mobile);
      if (mobileErr) newErrors.mobile = mobileErr;
      if (!otpSent) newErrors.otp = "Please send OTP first";
      else {
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
        if (userRole === "SuperAdmin") router.push("/components/dashboard");
        else if (userRole === "Instructor") router.push("/instructor/dashboard");
        else router.push("/student/dashboard");
      } catch (error) {
        toast.error(error?.message || "Invalid OTP");
        setErrors({ general: error?.message || "Invalid OTP" });
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
      setErrors({ mobile: error?.message || "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .lp-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #0c0c0e;
        }

        /* LEFT PANEL */
        .lp-left {
          display: none;
          width: 52%;
          position: relative;
          overflow: hidden;
          background: #0c0c0e;
        }
        @media (min-width: 1024px) { .lp-left { display: flex; flex-direction: column; } }

        .lp-left-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 20% 80%, rgba(99,60,220,0.22) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 20%, rgba(30,180,140,0.14) 0%, transparent 65%);
        }

        .lp-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .lp-left-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          padding: 56px 64px;
        }

        .lp-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .lp-logo-mark {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          color: #fff;
          letter-spacing: -1px;
        }
        .lp-logo-text {
          font-size: 15px;
          font-weight: 500;
          color: #e8e6f0;
          letter-spacing: 0.02em;
        }

        .lp-hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 0;
        }

        .lp-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #4ade80;
          margin-bottom: 24px;
        }

        .lp-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(42px, 4.5vw, 62px);
          line-height: 1.08;
          color: #f0eeff;
          margin-bottom: 28px;
        }
        .lp-headline em {
          font-style: italic;
          color: #86efac;
        }

        .lp-desc {
          font-size: 15px;
          font-weight: 300;
          color: #9490b0;
          line-height: 1.7;
          max-width: 360px;
        }

        .lp-stats {
          display: flex;
          gap: 40px;
          padding-top: 48px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .lp-stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          color: #f0eeff;
          letter-spacing: -0.5px;
        }
        .lp-stat-label {
          font-size: 12px;
          color: #5c5878;
          margin-top: 2px;
        }

        /* RIGHT PANEL */
        .lp-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
          background: #0f0f13;
        }

        .lp-card {
          width: 100%;
          max-width: 440px;
        }

        .lp-card-header {
          margin-bottom: 40px;
        }
        .lp-card-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #4ade80;
          margin-bottom: 12px;
        }
        .lp-card-title {
          font-family: 'DM Serif Display', serif;
          font-size: 36px;
          color: #f0eeff;
          line-height: 1.1;
          margin-bottom: 8px;
        }
        .lp-card-subtitle {
          font-size: 14px;
          color: #6b6885;
          font-weight: 300;
        }

        /* Toggle */
        .lp-toggle {
          display: flex;
          background: #1a1a22;
          border: 1px solid #2a2835;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 32px;
          position: relative;
        }
        .lp-toggle-pill {
          position: absolute;
          top: 4px;
          bottom: 4px;
          width: calc(50% - 4px);
          background: #252434;
          border: 1px solid #34314a;
          border-radius: 9px;
          transition: left 0.25s cubic-bezier(.4,0,.2,1);
        }
        .lp-toggle-btn {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 9px 0;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          transition: color 0.2s;
          letter-spacing: 0.02em;
        }
        .lp-toggle-btn.active { color: #e8e4ff; }
        .lp-toggle-btn:not(.active) { color: #4f4c66; }

        /* Error / message */
        .lp-error-banner {
          background: rgba(226,75,74,0.1);
          border: 1px solid rgba(226,75,74,0.25);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          color: #f09595;
          margin-bottom: 20px;
          text-align: center;
        }
        .lp-success-banner {
          background: rgba(74,222,128,0.08);
          border: 1px solid rgba(74,222,128,0.22);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          color: #4ade80;
          margin-bottom: 20px;
          text-align: center;
        }

        /* Fields */
        .lp-fields { display: flex; flex-direction: column; gap: 16px; }

        .lp-field { display: flex; flex-direction: column; gap: 6px; }

        .lp-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #5a5775;
        }

        .lp-input {
          width: 100%;
          background: #1a1a22;
          border: 1px solid #2a2835;
          border-radius: 12px;
          padding: 14px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: #e8e4ff;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .lp-input::placeholder { color: #3a3755; }
        .lp-input:hover { border-color: #3d3a54; }
        .lp-input:focus {
          border-color: #16a34a;
          background: #1e1c2a;
        }
        .lp-input.error { border-color: rgba(226,75,74,0.5); }

        .lp-field-error {
          font-size: 12px;
          color: #f09595;
          padding-left: 2px;
        }

        .lp-forgot {
          font-size: 12px;
          color: #16a34a;
          text-decoration: none;
          text-align: right;
          margin-top: 4px;
          display: block;
          transition: color 0.2s;
        }
        .lp-forgot:hover { color: #86efac; }

        .lp-send-otp {
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #16a34a;
          cursor: pointer;
          padding: 4px 0;
          text-align: right;
          transition: color 0.2s;
        }
        .lp-send-otp:hover { color: #86efac; }
        .lp-send-otp:disabled { opacity: 0.5; cursor: default; }

        /* Submit */
        .lp-submit {
          width: 100%;
          margin-top: 28px;
          padding: 15px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #16a34a 0%, #4ade80 100%);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #fff;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: opacity 0.2s, transform 0.15s;
          position: relative;
          overflow: hidden;
        }
        .lp-submit:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .lp-submit:active:not(:disabled) { transform: translateY(0); }
        .lp-submit:disabled { opacity: 0.4; cursor: not-allowed; }

        .lp-footer {
          text-align: center;
          margin-top: 28px;
          font-size: 13px;
          color: #4a4766;
          font-weight: 300;
        }
        .lp-footer a {
          color: #16a34a;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .lp-footer a:hover { color: #86efac; }

        /* Divider */
        .lp-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0 0;
        }
        .lp-divider-line {
          flex: 1;
          height: 1px;
          background: #1e1c2a;
        }
        .lp-divider-text {
          font-size: 11px;
          color: #3a3755;
          letter-spacing: 0.08em;
        }
      `}</style>

      <div className="lp-root">
        {/* LEFT */}
        <div className="lp-left">
          <div className="lp-left-bg" />
          <div className="lp-grid" />
          <div className="lp-left-content">
            <div className="lp-logo">
              <div className="lp-logo-mark">E</div>
              <span className="lp-logo-text">Ethnotech</span>
            </div>

            <div className="lp-hero">
              <p className="lp-eyebrow">Learning Management System</p>
              <h1 className="lp-headline">
                Where learning<br />
                meets <em>clarity</em>
              </h1>
              <p className="lp-desc">
                An all-in-one platform for students, instructors, and admins —
                built for focus, designed for progress.
              </p>
            </div>

            <div className="lp-stats">
              <div>
                <div className="lp-stat-num">12k+</div>
                <div className="lp-stat-label">Active learners</div>
              </div>
              <div>
                <div className="lp-stat-num">340+</div>
                <div className="lp-stat-label">Live courses</div>
              </div>
              <div>
                <div className="lp-stat-num">98%</div>
                <div className="lp-stat-label">Satisfaction rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lp-right">
          <div className="lp-card">
            <div className="lp-card-header">
              <p className="lp-card-eyebrow">Welcome back</p>
              <h2 className="lp-card-title">Sign in</h2>
              <p className="lp-card-subtitle">Access your dashboard and continue learning.</p>
            </div>

            {/* Toggle */}
            <div className="lp-toggle">
              <div
                className="lp-toggle-pill"
                style={{ left: mode === "email" ? "4px" : "calc(50%)" }}
              />
              <button
                className={`lp-toggle-btn${mode === "email" ? " active" : ""}`}
                onClick={() => { setMode("email"); setErrors({}); setMessage(""); setOtpSent(false); }}
              >
                Email
              </button>
              <button
                className={`lp-toggle-btn${mode === "otp" ? " active" : ""}`}
                onClick={() => { setMode("otp"); setErrors({}); setMessage(""); setOtpSent(false); }}
              >
                OTP
              </button>
            </div>

            {errors.general && <div className="lp-error-banner">{errors.general}</div>}
            {message && <div className="lp-success-banner">{message}</div>}

            {mode === "email" && (
              <div className="lp-fields">
                <div className="lp-field">
                  <label className="lp-label">Email address</label>
                  <input
                    type="email"
                    className={`lp-input${errors.email ? " error" : ""}`}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                    autoComplete="email"
                  />
                  {errors.email && <span className="lp-field-error">{errors.email}</span>}
                </div>

                <div className="lp-field">
                  <label className="lp-label">Password</label>
                  <input
                    type="password"
                    className={`lp-input${errors.password ? " error" : ""}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                    autoComplete="current-password"
                  />
                  {errors.password && <span className="lp-field-error">{errors.password}</span>}
                  <Link href="/auth/resetPass" className="lp-forgot">Forgot password?</Link>
                </div>
              </div>
            )}

            {mode === "otp" && (
              <div className="lp-fields">
                <div className="lp-field">
                  <label className="lp-label">Mobile number</label>
                  <input
                    type="tel"
                    className={`lp-input${errors.mobile ? " error" : ""}`}
                    placeholder="10-digit number"
                    value={mobile}
                    onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "")); clearFieldError("mobile"); }}
                  />
                  {errors.mobile && <span className="lp-field-error">{errors.mobile}</span>}
                </div>

                {!otpSent ? (
                  <button className="lp-send-otp" style={{ textAlign: "right" }} onClick={handleSendOtp} disabled={loading}>
                    {loading ? "Sending…" : "Send OTP →"}
                  </button>
                ) : (
                  <div className="lp-field">
                    <label className="lp-label">One-time password</label>
                    <input
                      type="text"
                      className={`lp-input${errors.otp ? " error" : ""}`}
                      placeholder="6-digit code"
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); clearFieldError("otp"); }}
                      maxLength={6}
                    />
                    {errors.otp && <span className="lp-field-error">{errors.otp}</span>}
                  </div>
                )}
              </div>
            )}

            <button className="lp-submit" onClick={handleLogin} disabled={loading}>
              {loading ? "Please wait…" : "Continue →"}
            </button>

            <p className="lp-footer">
              Don't have an account?{" "}
              <Link href="/auth/register">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}