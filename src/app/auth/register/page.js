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
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
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
    if (password.length < 6) newErrors.password = "Minimum 6 characters required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await registerService({ mobile, email, password });
      toast.success("Registration successful! 🎉 Redirecting to login...");
      setMessage("Registration successful 🎉");
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (error) {
      const msg = error?.response?.data?.message || "Registration failed";
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

        .rp-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .rp-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #0c0c0e;
        }

        /* LEFT PANEL */
        .rp-left {
          display: none;
          width: 52%;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 1024px) { .rp-left { display: flex; flex-direction: column; } }

        .rp-left-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 55% at 80% 20%, rgba(74,222,128,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 55% 60% at 15% 80%, rgba(22,163,74,0.22) 0%, transparent 65%);
        }

        .rp-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .rp-left-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          padding: 56px 64px;
        }

        .rp-logo { display: flex; align-items: center; gap: 12px; }
        .rp-logo-mark {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Serif Display', serif;
          font-size: 20px; color: #fff; letter-spacing: -1px;
        }
        .rp-logo-text { font-size: 15px; font-weight: 500; color: #e8e6f0; letter-spacing: 0.02em; }

        .rp-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 40px 0; }

        .rp-eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 0.16em;
          text-transform: uppercase; color: #4ade80; margin-bottom: 24px;
        }

        .rp-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(42px, 4.5vw, 62px);
          line-height: 1.08; color: #f0eeff; margin-bottom: 28px;
        }
        .rp-headline em { font-style: italic; color: #86efac; }

        .rp-desc { font-size: 15px; font-weight: 300; color: #9490b0; line-height: 1.7; max-width: 360px; }

        .rp-steps { display: flex; flex-direction: column; gap: 20px; padding-top: 48px; border-top: 1px solid rgba(255,255,255,0.07); }

        .rp-step { display: flex; align-items: flex-start; gap: 16px; }
        .rp-step-num {
          width: 28px; height: 28px; border-radius: 50%;
          border: 1px solid rgba(22,163,74,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 500; color: #16a34a;
          flex-shrink: 0; margin-top: 2px;
        }
        .rp-step-title { font-size: 13px; font-weight: 500; color: #c8c4e0; }
        .rp-step-desc { font-size: 12px; color: #4e4b66; margin-top: 2px; }

        /* RIGHT PANEL */
        .rp-right {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          padding: 32px 24px;
          background: #0f0f13;
        }

        .rp-card { width: 100%; max-width: 440px; }

        .rp-card-header { margin-bottom: 40px; }
        .rp-card-eyebrow {
          font-size: 11px; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: #4ade80; margin-bottom: 12px;
        }
        .rp-card-title {
          font-family: 'DM Serif Display', serif;
          font-size: 36px; color: #f0eeff; line-height: 1.1; margin-bottom: 8px;
        }
        .rp-card-subtitle { font-size: 14px; color: #6b6885; font-weight: 300; }

        .rp-error-banner {
          background: rgba(226,75,74,0.1); border: 1px solid rgba(226,75,74,0.25);
          border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #f09595;
          margin-bottom: 20px; text-align: center;
        }
        .rp-success-banner {
          background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.22);
          border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #4ade80;
          margin-bottom: 20px; text-align: center;
        }

        .rp-fields { display: flex; flex-direction: column; gap: 16px; }
        .rp-field { display: flex; flex-direction: column; gap: 6px; }

        .rp-label {
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: #5a5775;
        }

        .rp-input {
          width: 100%; background: #1a1a22; border: 1px solid #2a2835;
          border-radius: 12px; padding: 14px 16px;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 300;
          color: #e8e4ff; outline: none; transition: border-color 0.2s, background 0.2s;
        }
        .rp-input::placeholder { color: #3a3755; }
        .rp-input:hover { border-color: #3d3a54; }
        .rp-input:focus { border-color: #16a34a; background: #1e1c2a; }
        .rp-input.error { border-color: rgba(226,75,74,0.5); }

        .rp-field-error { font-size: 12px; color: #f09595; padding-left: 2px; }

        .rp-hint { font-size: 11px; color: #3e3b56; padding-left: 2px; }

        .rp-submit {
          width: 100%; margin-top: 28px; padding: 15px; border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #16a34a 0%, #4ade80 100%);
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
          color: #fff; cursor: pointer; letter-spacing: 0.03em;
          transition: opacity 0.2s, transform 0.15s;
        }
        .rp-submit:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .rp-submit:active:not(:disabled) { transform: translateY(0); }
        .rp-submit:disabled { opacity: 0.4; cursor: not-allowed; }

        .rp-footer {
          text-align: center; margin-top: 28px;
          font-size: 13px; color: #4a4766; font-weight: 300;
        }
        .rp-footer a { color: #16a34a; text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .rp-footer a:hover { color: #86efac; }

        .rp-divider {
          display: flex; align-items: center; gap: 12px; margin: 28px 0 0;
        }
        .rp-divider-line { flex: 1; height: 1px; background: #1e1c2a; }
        .rp-divider-text { font-size: 11px; color: #3a3755; letter-spacing: 0.08em; }
      `}</style>

      <div className="rp-root">
        {/* LEFT */}
        <div className="rp-left">
          <div className="rp-left-bg" />
          <div className="rp-grid" />
          <div className="rp-left-content">
            <div className="rp-logo">
              <div className="rp-logo-mark">E</div>
              <span className="rp-logo-text">Ethnotech</span>
            </div>

            <div className="rp-hero">
              <p className="rp-eyebrow">Get started today</p>
              <h1 className="rp-headline">
                Your journey<br />
                starts <em>here</em>
              </h1>
              <p className="rp-desc">
                Join thousands of learners and instructors on the platform
                built for modern education.
              </p>
            </div>

            <div className="rp-steps">
              <div className="rp-step">
                <div className="rp-step-num">1</div>
                <div>
                  <div className="rp-step-title">Create your account</div>
                  <div className="rp-step-desc">Takes less than a minute</div>
                </div>
              </div>
              <div className="rp-step">
                <div className="rp-step-num">2</div>
                <div>
                  <div className="rp-step-title">Explore courses</div>
                  <div className="rp-step-desc">Browse 340+ curated programmes</div>
                </div>
              </div>
              <div className="rp-step">
                <div className="rp-step-num">3</div>
                <div>
                  <div className="rp-step-title">Track your progress</div>
                  <div className="rp-step-desc">Real-time dashboards & certificates</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rp-right">
          <div className="rp-card">
            <div className="rp-card-header">
              <p className="rp-card-eyebrow">New here?</p>
              <h2 className="rp-card-title">Create account</h2>
              <p className="rp-card-subtitle">Fill in your details to get started for free.</p>
            </div>

            {errors.general && <div className="rp-error-banner">{errors.general}</div>}
            {message && <div className="rp-success-banner">{message}</div>}

            <div className="rp-fields">
              <div className="rp-field">
                <label className="rp-label">Email address</label>
                <input
                  type="email"
                  className={`rp-input${errors.email ? " error" : ""}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                  autoComplete="email"
                />
                {errors.email && <span className="rp-field-error">{errors.email}</span>}
              </div>

              <div className="rp-field">
                <label className="rp-label">Mobile number</label>
                <input
                  type="tel"
                  className={`rp-input${errors.mobile ? " error" : ""}`}
                  placeholder="10-digit number"
                  value={mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 10) setMobile(val);
                    clearFieldError("mobile");
                  }}
                  autoComplete="tel"
                />
                {errors.mobile && <span className="rp-field-error">{errors.mobile}</span>}
              </div>

              <div className="rp-field">
                <label className="rp-label">Password</label>
                <input
                  type="password"
                  className={`rp-input${errors.password ? " error" : ""}`}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                  autoComplete="new-password"
                />
                {errors.password
                  ? <span className="rp-field-error">{errors.password}</span>
                  : <span className="rp-hint">Use letters, numbers, and symbols for a stronger password.</span>
                }
              </div>
            </div>

            <button className="rp-submit" onClick={handleRegister} disabled={loading}>
              {loading ? "Creating account…" : "Create account →"}
            </button>

            <p className="rp-footer">
              Already have an account?{" "}
              <Link href="/auth/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}