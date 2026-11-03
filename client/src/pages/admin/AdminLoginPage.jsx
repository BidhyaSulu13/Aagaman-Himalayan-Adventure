import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, Lock, Mountain, ShieldAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import "./AdminDashboard.css";

export function AdminLoginPage() {
  const { loginAdmin, user, isAdmin, loading: authLoading } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [authLoading, isAdmin, navigate, user]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await loginAdmin(email.trim(), password);
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

  if (authLoading || (user && isAdmin)) return null;

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
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="admin-input-group">
              <div className="admin-label-row">
                <label htmlFor="admin-password">Secure Password</label>
                <span className="admin-hint">Use your administrator account password</span>
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
                  disabled={loading}
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
