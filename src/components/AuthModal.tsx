import { useState } from "react";
import { authenticateCredentials, DEMO_OTP_CODE, quickJudgeLogin, registerAccount, requestPasswordReset, verifyTwoFactorCode } from "../services/auth";
import type { User } from "../types";
import { CheckCircle2, KeyRound, Lock, Shield, Sparkles, UserCheck, X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [stage, setStage] = useState<"creds" | "otp" | "done">("creds");

  const [email, setEmail] = useState("judge@hackathon.ai");
  const [password, setPassword] = useState("hackathon2026");
  const [name, setName] = useState("Alex Morgan");
  const [role, setRole] = useState("Lead Compliance Auditor");

  const [tempSessionId, setTempSessionId] = useState("");
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleCredsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = tab === "register"
        ? await registerAccount(name, email, password, role as User["role"])
        : await authenticateCredentials(email, password);
      setPendingUser(res.user);
      setTempSessionId(res.tempSessionId);
      setStage("otp");
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUser) return;
    setError("");
    setLoading(true);

    try {
      const res = await verifyTwoFactorCode(tempSessionId, otpCode, pendingUser);
      if (res.success && res.user) {
        setStage("done");
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 1200);
      } else {
        setError(res.error || "Verification code incorrect.");
      }
    } catch (err: any) {
      setError(err.message || "OTP verification error.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setResetSent(false);
    try {
      await requestPasswordReset(email);
      setResetSent(true);
    } catch (err: any) { setError(err.message || "Unable to start password reset."); }
  };

  const handleQuickJudge = () => {
    const user = quickJudgeLogin();
    setStage("done");
    setTimeout(() => {
      onSuccess(user);
      onClose();
    }, 800);
  };

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn auth-close" onClick={onClose}><X size={18} /></button>

        {stage === "creds" && (
          <>
            <div className="auth-head">
              <div className="auth-icon"><Shield size={26} /></div>
              <h2>TrustLens Authentication</h2>
              <p>Secure identity gateway for KYC compliance officers & auditors.</p>
            </div>

            <div className="judge-quick-box">
              <div className="judge-badge"><Sparkles size={14} /> HACKATHON EVALUATION</div>
              <div>
                <strong>Judge 1-Click Access</strong>
                <span>Instantly sign in as Lead KYC Compliance Officer</span>
              </div>
              <button className="primary-btn" type="button" onClick={handleQuickJudge}>
                Quick Login
              </button>
            </div>

            <div className="auth-tabs">
              <button className={tab === "login" ? "active" : ""} onClick={() => { setTab("login"); setError(""); }}>
                Sign In
              </button>
              <button className={tab === "register" ? "active" : ""} onClick={() => { setTab("register"); setError(""); }}>
                Register Officer
              </button>
            </div>

            <form onSubmit={handleCredsSubmit} className="auth-form">
              {tab === "register" && (
                <>
                  <div className="auth-field">
                    <label>Full Officer Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="auth-field">
                    <label>Compliance Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                      <option>Lead Compliance Auditor</option>
                      <option>Senior KYC Officer</option>
                      <option>Fraud Risk Analyst</option>
                      <option>Hackathon Evaluator</option>
                    </select>
                  </div>
                </>
              )}

              <div className="auth-field">
                <label>Officer Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="analyst@trustlens.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label>Master Security Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button className="primary-btn wide" type="submit" disabled={loading}>
                {loading ? "Authenticating..." : tab === "login" ? "Continue to 2FA Verification →" : "Create Officer Account →"}
              </button>
              {tab === "login" && (
              <button type="button" className="text-btn auth-forgot" onClick={handleForgotPassword}>
                Forgot password?
              </button>
            )}
            {resetSent && <div className="success-box"><CheckCircle2 size={15}/> Reset request accepted. Check your email.</div>}
          </form>
          </>
        )}

        {stage === "otp" && (
          <div className="otp-stage">
            <div className="auth-head">
              <div className="auth-icon otp"><KeyRound size={26} /></div>
              <h2>Two-Factor Verification</h2>
              <p>Enter the 6-digit security code sent to <b>{pendingUser?.email}</b></p>
            </div>

            <div className="otp-hint-banner">
              <span>Test Simulator: Active Code is <b>{DEMO_OTP_CODE}</b></span>
              <button type="button" className="text-btn" onClick={() => setOtpCode(DEMO_OTP_CODE)}>
                Auto-fill Code
              </button>
            </div>

            <form onSubmit={handleOtpSubmit} className="auth-form">
              <div className="auth-field">
                <label>6-Digit Verification PIN</label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="849201"
                  className="otp-input"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button className="primary-btn wide" type="submit" disabled={loading || otpCode.length < 6}>
                {loading ? "Verifying PIN..." : "Verify & Authorize Session"}
              </button>

              <button type="button" className="ghost-btn wide" onClick={() => setStage("creds")}>
                ← Back to Credentials
              </button>
            </form>
          </div>
        )}

        {stage === "done" && (
          <div className="auth-success">
            <div className="success-icon"><CheckCircle2 size={48} /></div>
            <h2>Session Authorized</h2>
            <p>Identity verified. Redirecting to TrustLens Security Workspace...</p>
          </div>
        )}
      </div>
    </div>
  );
}
