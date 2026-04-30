"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { sendResetOtpService, resetPasswordService } from "../../../../service/login.service";
import { validateEmail } from "../../shared/validation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const clearFieldError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const handleSendOtp = async () => {
    setErrors({});
    setMessage("");
    const emailErr = validateEmail(email);
    if (emailErr) { setErrors({ email: emailErr }); toast.error(emailErr); return; }
    setLoading(true);
    try {
      await sendResetOtpService({ email });
      toast.success("OTP sent to your email.");
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

  const handleResetPassword = async () => {
    setErrors({});
    setMessage("");
    const newErrors = {};
    if (!otp) newErrors.otp = "OTP is required";
    if (newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";
    if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((e) => toast.error(e));
      return;
    }
    setLoading(true);
    try {
      await resetPasswordService({ email, otp, newPassword });
      toast.success("Password reset successful!");
      setMessage("Password reset successful! Redirecting to login…");
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .fp-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .fp-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #0c0c0e;
        }

        /* LEFT PANEL */
        .fp-left {
          display: none;
          width: 52%;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 1024px) { .fp-left { display: flex; flex-direction: column; } }

        .fp-left-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 55% 60% at 25% 75%, rgba(22,163,74,0.2) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 75% 25%, rgba(74,222,128,0.15) 0%, transparent 65%);
        }

        .fp-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .fp-left-content {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; justify-content: space-between;
          height: 100%; padding: 56px 64px;
        }

        .fp-logo { display: flex; align-items: center; gap: 12px; }
        .fp-logo-mark {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          font-family: 'DM Serif Display', serif; font-size: 20px; color: #fff;
        }
        .fp-logo-text { font-size: 15px; font-weight: 500; color: #e8e6f0; letter-spacing: 0.02em; }

        .fp-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 40px 0; }

        .fp-eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 0.16em;
          text-transform: uppercase; color: #4ade80; margin-bottom: 24px;
        }

        .fp-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(42px, 4.5vw, 62px);
          line-height: 1.08; color: #f0eeff; margin-bottom: 28px;
        }
        .fp-headline em { font-style: italic; color: #86efac; }

        .fp-desc { font-size: 15px; font-weight: 300; color: #9490b0; line-height: 1.7; max-width: 360px; }

        /* Step indicator on the left */
        .fp-steps-indicator {
          display: flex; flex-direction: column; gap: 0;
          padding-top: 48px; border-top: 1px solid rgba(255,255,255,0.07);
        }
        .fp-step-row { display: flex; align-items: flex-start; gap: 16px; }
        .fp-step-track { display: flex; flex-direction: column; align-items: center; }
        .fp-step-dot {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 500; flex-shrink: 0; transition: all 0.3s;
        }
        .fp-step-dot.done {
          background: rgba(74,222,128,0.15); border: 1px solid rgba(74,222,128,0.4); color: #4ade80;
        }
        .fp-step-dot.active {
          background: rgba(22,163,74,0.2); border: 1px solid rgba(22,163,74,0.5); color: #86efac;
        }
        .fp-step-dot.pending {
          background: transparent; border: 1px solid #2a2835; color: #3a3755;
        }
        .fp-step-line { width: 1px; height: 24px; background: #2a2835; margin: 4px 0; }
        .fp-step-body { padding-bottom: 24px; }
        .fp-step-title { font-size: 13px; font-weight: 500; color: #c8c4e0; }
        .fp-step-subdesc { font-size: 12px; color: #4e4b66; margin-top: 2px; }

        /* RIGHT PANEL */
        .fp-right {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 32px 24px; background: #0f0f13;
        }

        .fp-card { width: 100%; max-width: 440px; }

        .fp-card-header { margin-bottom: 36px; }
        .fp-card-eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: #4ade80; margin-bottom: 12px;
        }
        .fp-card-title {
          font-family: 'DM Serif Display', serif;
          font-size: 36px; color: #f0eeff; line-height: 1.1; margin-bottom: 8px;
        }
        .fp-card-subtitle { font-size: 14px; color: #6b6885; font-weight: 300; }

        /* Step pill progress */
        .fp-progress {
          display: flex; align-items: center; gap: 8px; margin-bottom: 32px;
        }
        .fp-prog-step {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 12px; border-radius: 20px;
          transition: all 0.2s;
        }
        .fp-prog-step.done {
          background: rgba(74,222,128,0.12); color: #4ade80;
          border: 1px solid rgba(74,222,128,0.25);
        }
        .fp-prog-step.active {
          background: rgba(22,163,74,0.15); color: #86efac;
          border: 1px solid rgba(22,163,74,0.3);
        }
        .fp-prog-step.pending {
          background: transparent; color: #3a3755;
          border: 1px solid #2a2835;
        }
        .fp-prog-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
        .fp-prog-line { flex: 1; height: 1px; background: #2a2835; }

        .fp-error-banner {
          background: rgba(226,75,74,0.1); border: 1px solid rgba(226,75,74,0.25);
          border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #f09595;
          margin-bottom: 20px; text-align: center;
        }
        .fp-success-banner {
          background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.22);
          border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #4ade80;
          margin-bottom: 20px; text-align: center;
        }

        .fp-fields { display: flex; flex-direction: column; gap: 16px; }
        .fp-field { display: flex; flex-direction: column; gap: 6px; }

        .fp-label {
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: #5a5775;
        }

        .fp-input {
          width: 100%; background: #1a1a22; border: 1px solid #2a2835;
          border-radius: 12px; padding: 14px 16px;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 300;
          color: #e8e4ff; outline: none; transition: border-color 0.2s, background 0.2s;
        }
        .fp-input::placeholder { color: #3a3755; }
        .fp-input:hover { border-color: #3d3a54; }
        .fp-input:focus { border-color: #16a34a; background: #1e1c2a; }
        .fp-input.error { border-color: rgba(226,75,74,0.5); }

        .fp-field-error { font-size: 12px; color: #f09595; padding-left: 2px; }
        .fp-hint { font-size: 11px; color: #3e3b56; padding-left: 2px; }

        .fp-submit {
          width: 100%; margin-top: 28px; padding: 15px; border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #16a34a 0%, #4ade80 100%);
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
          color: #fff; cursor: pointer; letter-spacing: 0.03em;
          transition: opacity 0.2s, transform 0.15s;
        }
        .fp-submit:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .fp-submit:active:not(:disabled) { transform: translateY(0); }
        .fp-submit:disabled { opacity: 0.4; cursor: not-allowed; }

        .fp-back-btn {
          background: none; border: 1px solid #2a2835; border-radius: 12px;
          width: 100%; margin-top: 12px; padding: 13px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400;
          color: #6b6885; cursor: pointer; transition: border-color 0.2s, color 0.2s;
        }
        .fp-back-btn:hover { border-color: #3d3a54; color: #86efac; }

        .fp-footer {
          text-align: center; margin-top: 28px;
          font-size: 13px; color: #4a4766; font-weight: 300;
        }
        .fp-footer a { color: #16a34a; text-decoration: none; font-weight: 500; }
        .fp-footer a:hover { color: #86efac; }
      `}</style>

      <div className="fp-root">
        {/* LEFT */}
        <div className="fp-left">
          <div className="fp-left-bg" />
          <div className="fp-grid" />
          <div className="fp-left-content">
            <div className="fp-logo">
              <div className="fp-logo-mark">E</div>
              <span className="fp-logo-text">Ethnotech</span>
            </div>

            <div className="fp-hero">
              <p className="fp-eyebrow">Account recovery</p>
              <h1 className="fp-headline">
                Back in a<br />
                <em>few steps</em>
              </h1>
              <p className="fp-desc">
                Forgot your password? No worries — we'll verify your email and
                get you back in under a minute.
              </p>
            </div>

            <div className="fp-steps-indicator">
              <div className="fp-step-row">
                <div className="fp-step-track">
                  <div className={`fp-step-dot ${step >= 1 ? "done" : "pending"}`}>1</div>
                  <div className="fp-step-line" />
                </div>
                <div className="fp-step-body">
                  <div className="fp-step-title">Verify email</div>
                  <div className="fp-step-subdesc">We'll send a 6-digit OTP</div>
                </div>
              </div>
              <div className="fp-step-row">
                <div className="fp-step-track">
                  <div className={`fp-step-dot ${step === 2 ? "active" : "pending"}`}>2</div>
                </div>
                <div className="fp-step-body">
                  <div className="fp-step-title">Set new password</div>
                  <div className="fp-step-subdesc">Enter OTP and choose a new password</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="fp-right">
          <div className="fp-card">
            <div className="fp-card-header">
              <p className="fp-card-eyebrow">Password reset</p>
              <h2 className="fp-card-title">
                {step === 1 ? "Forgot password?" : "Set new password"}
              </h2>
              <p className="fp-card-subtitle">
                {step === 1
                  ? "Enter your email address and we'll send you a one-time code."
                  : `OTP sent to ${email}. Enter it below with your new password.`}
              </p>
            </div>

            {/* Step progress pills */}
            <div className="fp-progress">
              <div className={`fp-prog-step ${step >= 1 ? "done" : "pending"}`}>
                <span className="fp-prog-dot" />
                Email
              </div>
              <div className="fp-prog-line" />
              <div className={`fp-prog-step ${step === 2 ? "active" : "pending"}`}>
                <span className="fp-prog-dot" />
                Reset
              </div>
            </div>

            {errors.general && <div className="fp-error-banner">{errors.general}</div>}
            {message && <div className="fp-success-banner">{message}</div>}

            {step === 1 && (
              <div className="fp-fields">
                <div className="fp-field">
                  <label className="fp-label">Email address</label>
                  <input
                    type="email"
                    className={`fp-input${errors.email ? " error" : ""}`}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                    autoComplete="email"
                  />
                  {errors.email && <span className="fp-field-error">{errors.email}</span>}
                </div>

                <button className="fp-submit" onClick={handleSendOtp} disabled={loading}>
                  {loading ? "Sending OTP…" : "Send OTP →"}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="fp-fields">
                <div className="fp-field">
                  <label className="fp-label">One-time password</label>
                  <input
                    type="text"
                    className={`fp-input${errors.otp ? " error" : ""}`}
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); clearFieldError("otp"); }}
                    maxLength={6}
                  />
                  {errors.otp && <span className="fp-field-error">{errors.otp}</span>}
                </div>

                <div className="fp-field">
                  <label className="fp-label">New password</label>
                  <input
                    type="password"
                    className={`fp-input${errors.newPassword ? " error" : ""}`}
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); clearFieldError("newPassword"); }}
                    autoComplete="new-password"
                  />
                  {errors.newPassword && <span className="fp-field-error">{errors.newPassword}</span>}
                </div>

                <div className="fp-field">
                  <label className="fp-label">Confirm password</label>
                  <input
                    type="password"
                    className={`fp-input${errors.confirmPassword ? " error" : ""}`}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError("confirmPassword"); }}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword
                    ? <span className="fp-field-error">{errors.confirmPassword}</span>
                    : newPassword && confirmPassword && newPassword === confirmPassword
                      ? <span style={{ fontSize: "12px", color: "#4ade80", paddingLeft: "2px" }}>Passwords match ✓</span>
                      : null}
                </div>

                <button className="fp-submit" onClick={handleResetPassword} disabled={loading}>
                  {loading ? "Resetting…" : "Reset password →"}
                </button>

                <button className="fp-back-btn" onClick={() => { setStep(1); setErrors({}); setMessage(""); }}>
                  ← Back to email
                </button>
              </div>
            )}

            <p className="fp-footer">
              Remembered it?{" "}
              <Link href="/auth/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}