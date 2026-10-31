import { User } from "../models/User.js";

// GET /api/users (Admin)
export async function getUsers(req, res, next) {
  try {
    const { role, search, status } = req.query;
    const query = {};

    if (role && role !== "All") query.role = role;
    if (status && status !== "All") query.status = status;

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/users/:id/role (Admin)
export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["traveler", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    // Prevent accidental self-lockout
    if (id.toString() === req.user._id.toString() && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You cannot demote your own admin account.",
      });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({
      success: true,
      user,
      message: `User role changed to '${role}'.`,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/users/:id/status (Admin)
export async function updateUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "suspended"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    if (id.toString() === req.user._id.toString() && status === "suspended") {
      return res.status(400).json({
        success: false,
        message: "You cannot suspend your own account.",
      });
    }

    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({
      success: true,
      user,
      message: `User account is now '${status}'.`,
    });
  } catch (error) {
    next(error);
  }
}
