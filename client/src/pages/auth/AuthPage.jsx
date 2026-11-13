import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Mountain } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { api } from "../../services/api.js";

function safeReturnPath(value) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export function AuthPage({ mode }) {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, loginWithGoogle, loginWithEmailLink, user, logout } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(location.state?.email || searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const googleButtonRef = useRef(null);
  const googleCallbackRef = useRef(null);
  const emailLinkPromiseRef = useRef(null);

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";
  const isEmailLink = mode === "email-link";
  const isLogin = !isRegister && !isForgot && !isReset && !isEmailLink;
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const returnTo = safeReturnPath(location.state?.returnTo || searchParams.get("returnTo"));
  const title = isForgot
    ? "A fresh start."
    : isReset
      ? "Choose a new password."
      : isRegister
        ? "Make yourself at home."
        : "Welcome back.";

  googleCallbackRef.current = async (credential) => {
    setBusy(true);
    setError("");
    try {
      const response = await loginWithGoogle(credential);
      navigate(response.user?.role === "admin" ? "/admin/dashboard" : returnTo, { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Google sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (isEmailLink || !googleClientId || !(isLogin || isRegister)) return undefined;
    let active = true;
    const initializeGoogle = () => {
      const google = window.google?.accounts?.id;
      if (!active || !google || !googleButtonRef.current) return;
      google.initialize({
        client_id: googleClientId,
        callback: (response) => googleCallbackRef.current?.(response.credential),
      });
      google.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        width: Math.min(350, googleButtonRef.current.clientWidth || 350),
      });
      setGoogleReady(true);
    };

    let script = document.getElementById("google-identity-services");
    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      if (!script) {
        script = document.createElement("script");
        script.id = "google-identity-services";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", initializeGoogle);
      script.addEventListener("error", () => {
        if (active) setError("Google sign-in could not load. Check your connection or use email sign-in.");
      }, { once: true });
    }

    return () => {
      active = false;
      script?.removeEventListener("load", initializeGoogle);
    };
  }, [googleClientId, isEmailLink, isLogin, isRegister]);

  useEffect(() => {
    if (!isEmailLink || !token) return undefined;
    if (user?.role === "admin") {
      setError("Log out of the admin account before using a traveler sign-in link.");
      return undefined;
    }
    let active = true;
    if (!emailLinkPromiseRef.current) {
      setBusy(true);
      emailLinkPromiseRef.current = loginWithEmailLink(token);
    }
    emailLinkPromiseRef.current
      .then(() => {
        if (active) navigate(safeReturnPath(searchParams.get("returnTo")), { replace: true });
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "This sign-in link has expired. Request a new one.");
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => { active = false; };
  }, [isEmailLink, token, loginWithEmailLink, navigate, searchParams, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (isRegister) {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        await register(name, email, password);
        navigate(returnTo, { replace: true });
      } else if (isForgot) {
        const response = await api.auth.forgotPassword(email);
        setNotice(response.message || "If the email matches an account, password reset instructions have been sent.");
      } else if (isReset) {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        const response = await api.auth.resetPassword(token, password);
        setNotice(response.message || "Password updated. You can now sign in.");
      } else {
        const response = await login(email, password);
        navigate(response.user?.role === "admin" ? "/admin/dashboard" : returnTo, { replace: true });
      }
    } catch (requestError) {
      setError(requestError.message || "Unable to complete this request.");
    } finally {
      setBusy(false);
    }
  };

  const requestEmailLink = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await api.auth.requestLoginLink({ email, returnTo });
      setNotice(response.message);
    } catch (requestError) {
      setError(requestError.message || "Unable to request a sign-in link.");
    } finally {
      setBusy(false);
    }
  };

  if (isEmailLink) {
    return (
      <Page className="auth-page">
        <div className="auth-card">
          <span className="auth-mark"><Mountain size={21} /></span>
          <p className="eyebrow">Secure email sign-in</p>
          <h1>{busy ? "Signing you in." : error ? "Link unavailable." : "Welcome back."}</h1>
          <p className="auth-description" role={error ? "alert" : "status"}>
            {error || (busy ? "Verifying your one-time sign-in link…" : "Opening your traveler dashboard…")}
          </p>
          {error && <Link className="button button-dark button-full" to="/login">Return to sign in</Link>}
        </div>
      </Page>
    );
  }

  if (user?.role === "admin" && (isLogin || isRegister)) {
    return (
      <Page className="auth-page">
        <div className="auth-card">
          <span className="auth-mark"><Mountain size={21} /></span>
          <p className="eyebrow">Account session active</p>
          <h1>Admin is signed in.</h1>
          <p className="auth-description">Log out of the admin account before signing in or registering as a traveler. Your current session will stay active until you choose to end it.</p>
          <button className="button button-dark button-full" type="button" onClick={logout}>Log out admin and continue</button>
        </div>
      </Page>
    );
  }

  return (
    <Page className="auth-page">
      <div className="auth-card">
        <Link className="auth-back" to="/"><ArrowLeft size={15} /> Back to the trail</Link>
        <span className="auth-mark"><Mountain size={21} /></span>
        <p className="eyebrow">{isForgot || isReset ? "Account access" : "Your travel dashboard"}</p>
        <h1>{title}</h1>
        <p className="auth-description">
          {isForgot
            ? "Enter your account email and we’ll send password reset instructions if it matches."
            : isReset
              ? "Choose a new password for your account."
              : isRegister
                ? "Create an account to keep your bookings and reviews together."
                  : "Sign in to book treks, save favorites, and manage your bookings and reviews."}
        </p>

        {(isLogin || isRegister) && (
          <>
            {googleClientId ? (
              <div className="google-signin-wrap" aria-label="Continue with Google">
                <div ref={googleButtonRef} />
                {!googleReady && <span className="auth-note">Loading Google sign-in…</span>}
                <span className="auth-note">
                  Authorize this exact origin in Google Cloud Console: <strong>{window.location.origin}</strong>
                </span>
              </div>
            ) : (
              <div className="auth-config-note" role="note">Google sign-in will be available after the Google client ID is configured.</div>
            )}
            <div className="auth-divider"><span>or continue with email</span></div>
          </>
        )}

        {notice && <div className="auth-success-message" role="status"><Check size={18} /><span>{notice}</span></div>}
        {error && <p className="auth-error-message" role="alert">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>Your name
              <input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" placeholder="Your full name" />
            </label>
          )}
          {!isReset && <label>Email address
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required autoComplete="email" placeholder="you@example.com" />
          </label>}
          {!isForgot && (
            <label>{isReset ? "New password" : "Password"}
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required minLength={6} autoComplete={isRegister || isReset ? "new-password" : "current-password"} />
            </label>
          )}
          {(isRegister || isReset) && (
            <label>Confirm password
              <input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" required minLength={6} autoComplete="new-password" />
            </label>
          )}
          {isLogin && <Link className="auth-forgot" to="/forgot-password">Forgot password?</Link>}
          <button className="button button-dark button-full" type="submit" disabled={busy}>
            {busy
              ? "Please wait…"
              : isForgot
                ? "Send reset instructions"
                : isReset
                  ? "Update password"
                  : isRegister
                    ? "Create account"
                    : "Sign in"}
            <ArrowRight size={15} />
          </button>
        </form>

        {isLogin && (
          <>
            <button className="auth-email-link-button" type="button" onClick={requestEmailLink} disabled={busy || !email}>
              Email me a one-time sign-in link
            </button>
            <p className="auth-note">
              If you created your account with Google, use Continue with Google; a Google password won’t work in this form.
            </p>
          </>
        )}

        <div className="auth-switch">
          {isForgot || isReset
            ? <Link to="/login" state={{ returnTo }}>Back to sign in</Link>
            : isRegister
              ? <>Already have an account? <Link to="/login" state={{ returnTo }}>Sign in</Link></>
              : <>New around here? <Link to="/register" state={{ returnTo }}>Create an account</Link></>}
        </div>
      </div>
    </Page>
  );
}
