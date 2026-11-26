import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not configured.");
  }
  return secret;
}

function getCookieOptions(includeMaxAge = true) {
  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };
  if (includeMaxAge) {
    options.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  }
  return options;
}

function extractToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
}

export function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    getJwtSecret(),
    { expiresIn: "7d" }
  );
}

export function setTokenCookie(res, token) {
  res.cookie("token", token, getCookieOptions(true));
}

export function clearTokenCookie(res) {
  res.clearCookie("token", getCookieOptions(false));
}

export async function protect(req, res, next) {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in to continue.",
      });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User session is no longer valid.",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Account has been suspended. Please contact support.",
      });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token.",
    });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access forbidden. Admin privileges required.",
    });
  }
  next();
}

export async function optionalAuth(req, _res, next) {
  try {
    const token = extractToken(req);
    if (token) {
      const decoded = jwt.verify(token, getJwtSecret());
      const user = await User.findById(decoded.id);
      if (user && user.status !== "suspended") {
        req.user = user;
      }
    }
  } catch (_err) {
    // silently continue without attaching req.user
  }
  next();
}
