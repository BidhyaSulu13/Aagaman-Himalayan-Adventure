import { Booking } from "../models/Booking.js";
import { Departure } from "../models/Departure.js";
import { Destination } from "../models/Destination.js";
import { Setting } from "../models/Setting.js";
import { Trek } from "../models/Trek.js";
import { User } from "../models/User.js";

// GET /api/admin/stats
export async function getAdminStats(_req, res, next) {
  try {
    const [
      totalUsers,
      totalTreks,
      totalDestinations,
      totalDepartures,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      paidBookings,
      recentBookings,
    ] = await Promise.all([
      User.countDocuments(),
      Trek.countDocuments(),
      Destination.countDocuments(),
      Departure.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: { $in: ["Requested", "Pending confirmation"] } }),
      Booking.countDocuments({ bookingStatus: "Confirmed" }),
      // Verified paid bookings aggregate
      Booking.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
      ]),
      Booking.find()
        .populate("trek", "title slug region")
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    const totalRevenue = paidBookings[0]?.totalRevenue || 0;

    // Monthly booking trends (last 6 months)
    const trends = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$totalAmount", 0],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTreks,
        totalDestinations,
        totalDepartures,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalRevenue,
      },
      trends,
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/admin/settings
export async function getSettings(_req, res, next) {
  try {
    let settings = await Setting.findOne({ key: "general" });
    if (!settings) {
      settings = await Setting.create({ key: "general" });
    }
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
}

// PUT /api/admin/settings
export async function updateSettings(req, res, next) {
  try {
    const settings = await Setting.findOneAndUpdate(
      { key: "general" },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({
      success: true,
      settings,
      message: "Site settings saved successfully.",
    });
  } catch (error) {
    next(error);
  }
}
