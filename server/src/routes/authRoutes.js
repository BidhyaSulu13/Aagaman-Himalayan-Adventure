import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  changePassword,
  forgotPassword,
  getMe,
  adminLogin,
  googleLogin,
  login,
  logout,
  register,
  requestLoginLink,
  resetPassword,
  updateProfile,
  verifyLoginLink,
} from "../controllers/authController.js";
import { optionalAuth, protect } from "../middleware/auth.js";

const router = Router();
const loginAndRegistrationLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many authentication attempts. Please try again later." },
});
const passwordResetLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many password reset requests. Please try again later." },
});
const loginLinkLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many sign-in link requests. Please try again later." },
});

router.post("/register", loginAndRegistrationLimit, register);
router.post("/login", loginAndRegistrationLimit, login);
router.post("/admin/login", loginAndRegistrationLimit, adminLogin);
router.post("/google", loginAndRegistrationLimit, googleLogin);
router.post("/request-login-link", loginLinkLimit, requestLoginLink);
router.post("/verify-login-link", loginLinkLimit, verifyLoginLink);
router.post("/logout", logout);
router.get("/me", optionalAuth, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", passwordResetLimit, forgotPassword);
router.post("/reset-password/:token", passwordResetLimit, resetPassword);

export default router;
