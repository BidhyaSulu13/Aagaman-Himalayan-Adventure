import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { Booking } from "../models/Booking.js";
import { User } from "../models/User.js";
import { clearTokenCookie, setTokenCookie, signToken } from "../middleware/auth.js";
import {
  sendLoginLinkEmail,
  sendPasswordResetEmail,
} from "../services/emailService.js";

const googleOAuthClient = new OAuth2Client();

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Helper to sanitize user object for client response (NEVER return passwordHash)
function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.passwordHash;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.__v;
  return obj;
}

// POST /api/auth/register
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with that email already exists.",
      });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: "traveler",
      emailVerified: false,
    });

    const token = signToken(user);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      user: sanitizeUser(user),
      token,
      message: "Account created successfully. Welcome to Agaaman!",
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/google
export async function googleLogin(req, res, next) {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const credential = String(req.body.credential || "");
      if (!clientId) {
        return res.status(503).json({
          success: false,
          message: "Google sign-in is not configured. Set GOOGLE_CLIENT_ID on the API and VITE_GOOGLE_CLIENT_ID on the client.",
        });
      }
      if (!credential || credential.length > 10_000) {
        return res.status(400).json({ success: false, message: "A valid Google credential is required." });
      }

      const ticket = await googleOAuthClient.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email || payload.email_verified !== true) {
        return res.status(401).json({ success: false, message: "Google could not verify this email address." });
      }

      const email = payload.email.toLowerCase().trim();
      let user = await User.findOne({ googleId: payload.sub }).select("+googleId");
      if (!user) {
        user = await User.findOne({ email }).select("+googleId");
      }
      if (user?.role === "admin") {
        return res.status(403).json({ success: false, message: "Use the admin sign-in page for this account." });
      }
      if (user?.status === "suspended") {
        return res.status(403).json({ success: false, message: "Account is suspended. Please contact support." });
      }
      if (user?.googleId && user.googleId !== payload.sub) {
        return res.status(409).json({ success: false, message: "This account is linked to a different Google identity." });
      }

      if (!user) {
        user = await User.create({
          name: String(payload.name || email.split("@")[0]).trim().slice(0, 100),
          email,
          googleId: payload.sub,
          emailVerified: true,
          avatar: payload.picture || undefined,
          role: "traveler",
        });
      } else {
        user.googleId = payload.sub;
        user.emailVerified = true;
        if (payload.picture) user.avatar = payload.picture;
        await user.save();
      }

      const token = signToken(user);
      setTokenCookie(res, token);
      return res.json({
        success: true,
        user: sanitizeUser(user),
        token,
        message: "Signed in with Google.",
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ success: false, message: "This Google account could not be linked. Please sign in with your existing method." });
      }
      next(error);
    }
  }

// POST /api/auth/request-login-link
export async function requestLoginLink(req, res, next) {
    try {
      const email = String(req.body.email || "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        return res.status(400).json({ success: false, message: "Enter a valid email address." });
      }

      let user = await User.findOne({ email }).select("+loginLinkTokenHash +loginLinkExpiresAt");
      if (!user) {
        const booking = await Booking.findOne({
          "travelerDetails.email": new RegExp(`^${escapeRegex(email)}$`, "i"),
        }).select("travelerDetails");
        const traveler = booking?.travelerDetails.find(
          (detail) => detail.email.toLowerCase() === email
        );
        if (traveler) {
          user = await User.create({
            name: traveler.fullName,
            email,
            role: "traveler",
          });
        }
      }

      if (user && user.role === "traveler" && user.status !== "suspended") {
        const token = crypto.randomBytes(32).toString("base64url");
        user.loginLinkTokenHash = hashToken(token);
        user.loginLinkExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        const returnTo = String(req.body.returnTo || "/dashboard");
        await sendLoginLinkEmail({
          email,
          name: user.name,
          token,
          returnTo,
        });
      }

      return res.json({
        success: true,
        message: "If this email matches an account or booking, a one-time sign-in link has been sent.",
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.json({
          success: true,
          message: "If this email matches an account or booking, a one-time sign-in link has been sent.",
        });
      }
      next(error);
    }
  }

// POST /api/auth/verify-login-link
export async function verifyLoginLink(req, res, next) {
    try {
      const token = String(req.body.token || "");
      if (!token || token.length > 200) {
        return res.status(400).json({ success: false, message: "This sign-in link is invalid or has expired." });
      }

      const user = await User.findOneAndUpdate(
        {
          loginLinkTokenHash: hashToken(token),
          loginLinkExpiresAt: { $gt: new Date() },
          status: "active",
          role: "traveler",
        },
        {
          $set: { emailVerified: true },
          $unset: { loginLinkTokenHash: 1, loginLinkExpiresAt: 1 },
        },
        { returnDocument: "after" }
      );
      if (!user) {
        return res.status(400).json({ success: false, message: "This sign-in link is invalid or has expired. Request a new link." });
      }

      const sessionToken = signToken(user);
      setTokenCookie(res, sessionToken);
      return res.json({
        success: true,
        user: sanitizeUser(user),
        token: sessionToken,
        message: "Email verified. You are signed in.",
      });
    } catch (error) {
      next(error);
    }
  }
async function authenticate(req, res, next, requiredRole) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Account is suspended. Please contact support.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (requiredRole && user.role !== requiredRole) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = signToken(user);
    setTokenCookie(res, token);

    res.json({
      success: true,
      user: sanitizeUser(user),
      token,
      message: "Logged in successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login
export function login(req, res, next) {
  return authenticate(req, res, next, "traveler");
}

// POST /api/auth/admin/login
export function adminLogin(req, res, next) {
  return authenticate(req, res, next, "admin");
}

// POST /api/auth/logout
export async function logout(_req, res) {
  clearTokenCookie(res);
  res.json({
    success: true,
    message: "Logged out successfully.",
  });
}

// GET /api/auth/me
export async function getMe(req, res) {
  if (!req.user) {
    return res.json({
      success: true,
      user: null,
    });
  }

  res.json({
    success: true,
    user: sanitizeUser(req.user),
  });
}

// PUT /api/auth/profile
export async function updateProfile(req, res, next) {
  try {
    const { name, bio, phone, nationality, emergencyContact, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (name) user.name = name.trim();
    if (avatar) user.avatar = avatar;
    user.profile = {
      bio: bio !== undefined ? bio : user.profile.bio,
      phone: phone !== undefined ? phone : user.profile.phone,
      nationality: nationality !== undefined ? nationality : user.profile.nationality,
      emergencyContact: emergencyContact || user.profile.emergencyContact,
    };

    await user.save();

    res.json({
      success: true,
      user: sanitizeUser(user),
      message: "Profile updated successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/auth/change-password
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const user = await User.findById(req.user._id).select("+passwordHash");
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect current password.",
      });
    }

    user.passwordHash = await User.hashPassword(newPassword);
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/forgot-password
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Don't leak if user exists or not
      return res.json({
        success: true,
        message: "If that email exists, a password reset link has been dispatched.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetToken,
      clientUrl: process.env.CLIENT_URL,
    });

    res.json({
      success: true,
      message: "If that email exists, a password reset link has been dispatched.",
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/reset-password/:token
export async function resetPassword(req, res, next) {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset link.",
      });
    }

    user.passwordHash = await User.hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const authToken = signToken(user);
    setTokenCookie(res, authToken);

    res.json({
      success: true,
      user: sanitizeUser(user),
      token: authToken,
      message: "Password reset successful. You are now logged in.",
    });
  } catch (error) {
    next(error);
  }
}
