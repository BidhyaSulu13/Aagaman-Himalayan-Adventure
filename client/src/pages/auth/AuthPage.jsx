import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Mountain } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";

export function AuthPage({ mode }) {
  const [submitted, setSubmitted] = useState(false);
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";
  const title = isForgot ? "A fresh start." : isReset ? "Choose a new password." : isRegister ? "Make yourself at home." : "Welcome back.";
  return (
    <Page className="auth-page">
      <div className="auth-card">
        <Link className="auth-back" to="/"><ArrowLeft size={15} /> Back to the trail</Link>
        <span className="auth-mark"><Mountain size={21} /></span>
        <p className="eyebrow">{isForgot ? "Account access" : "Your travel notebook"}</p>
        <h1>{title}</h1>
        <p className="auth-description">{isForgot ? "Enter the email you registered with and we’ll show you the reset flow." : isReset ? "This demonstration form shows the reset-password screen. No token is verified or password stored." : "Save the journeys that stay on your mind."}</p>
        {submitted ? (
          <div className="auth-demo-message" role="status"><Check size={18} /><span>Demo only: authentication is not connected yet. No account data was sent or saved.</span></div>
        ) : (
          <form className="auth-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
            {isRegister && <label>Your name<input required autoComplete="name" placeholder="Your full name" /></label>}
            <label>Email address<input type="email" required autoComplete="email" placeholder="you@example.com" /></label>
            {!isForgot && <label>{isReset ? "New password" : "Password"}<input type="password" required minLength="8" autoComplete={isRegister || isReset ? "new-password" : "current-password"} placeholder="At least 8 characters" /></label>}
            {isReset && <label>Confirm new password<input type="password" required minLength="8" autoComplete="new-password" placeholder="Enter the password again" /></label>}
            {!isRegister && !isForgot && <Link className="auth-forgot" to="/forgot-password">Forgot password?</Link>}
            <button className="button button-dark button-full" type="submit">{isForgot ? "Preview reset email" : isReset ? "Preview password reset" : isRegister ? "Create demo account" : "Log in"} <ArrowRight size={15} /></button>
          </form>
        )}
        <div className="auth-switch">
          {isForgot || isReset ? <Link to="/login">Back to log in</Link> : isRegister ? <>Already have an account? <Link to="/login">Log in</Link></> : <>New around here? <Link to="/register">Create an account</Link></>}
        </div>
        <p className="auth-note">This frontend demo does not create accounts or authenticate users.</p>
      </div>
    </Page>
  );
}
