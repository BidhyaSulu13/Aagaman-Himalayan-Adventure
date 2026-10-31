import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, KeyRound, Lock, Mountain, ShieldAlert, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import "./AdminDashboard.css";

export function AdminLoginPage() {
  const { login, user, isAdmin } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();

  // Pre-filled default credentials for 1-click test login
  const [email, setEmail] = useState("admin@agaaman.com");
  const [password, setPassword] = useState("admin123456");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // If already logged in as admin, redirect to admin dashboard
  if (user && isAdmin) {
    navigate("/admin/dashboard", { replace: true });
    return null;
  }

  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        notify("Welcome to Agaaman Admin Console");
        navigate("/admin/dashboard", { replace: true });
      } else {
        setErrorMsg(res.message || "Invalid credentials. Please verify email and password.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Login failed. Check server status or credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (em, pw) => {
    setEmail(em);
    setPassword(pw);
  };

  return (
    <div className="admin-login-fullscreen">
      <div className="admin-login-backdrop-glow" />

      {/* Top Bar with back link */}
      <header className="admin-login-nav">
        <Link to="/" className="admin-nav-back">
          <ArrowLeft size={16} />
          <span>Return to Public Website</span>
        </Link>
        <div className="admin-system-status">
          <span className="status-dot-live" />
          <span>Console Node Active (v2.6)</span>
        </div>
      </header>

      {/* Center Login Card */}
      <div className="admin-login-container">
        <div className="admin-card-surface">
          {/* Brand header */}
          <div className="admin-card-header">
            <div className="admin-brand-emblem">
              <Mountain size={28} />
            </div>
            <h1>Admin Console</h1>
            <p className="admin-card-subtitle">
              Agaaman Himalayan Adventure · Executive Management Portal
            </p>
          </div>

          {/* Quick 1-click test credentials badge */}
          <div className="admin-test-pill" onClick={() => fillCredentials("admin@agaaman.com", "admin123456")}>
            <div className="test-pill-left">
              <Sparkles size={16} className="sparkle-icon" />
              <div>
                <strong>Pre-Filled Developer Credentials</strong>
                <p>admin@agaaman.com · admin123456</p>
              </div>
            </div>
            <span className="ready-badge">
              <CheckCircle2 size={14} /> Ready
            </span>
          </div>

          {errorMsg && (
            <div className="admin-login-error">
              <ShieldAlert size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="admin-login-form">
            <div className="admin-input-group">
              <label htmlFor="admin-email">Admin Email Address</label>
              <div className="admin-input-wrap">
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@agaaman.com"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="admin-input-group">
              <div className="admin-label-row">
                <label htmlFor="admin-password">Secure Password</label>
                <span className="admin-hint">Pre-filled for instant testing</span>
              </div>
              <div className="admin-input-wrap">
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="admin-login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-spinner-row">
                  <span className="spinner-dot" /> Authenticating...
                </span>
              ) : (
                <span className="btn-label-row">
                  <KeyRound size={18} />
                  <span>Sign In to Admin Dashboard</span>
                </span>
              )}
            </button>
          </form>

          <footer className="admin-card-footer">
            <Lock size={13} />
            <span>Encrypted Session · Token Protected · Local & Cloud Synchronized</span>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
