import { TripRequest } from "../models/TripRequest.js";

// POST /api/trip-requests (Public or authenticated)
export async function createTripRequest(req, res, next) {
  try {
    const {
      name,
      email,
      phone,
      preferredRegion,
      travelDates,
      budget,
      groupSize,
      experienceLevel,
      specialRequirements,
    } = req.body;

    if (!name || !email || !preferredRegion) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and preferred region are required.",
      });
    }

    const tripRequest = await TripRequest.create({
      user: req.user ? req.user._id : null,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || "",
      preferredRegion,
      travelDates,
      budget: budget ? Number(budget) : null,
      groupSize: Number(groupSize) || 1,
      experienceLevel: experienceLevel || "Intermediate",
      specialRequirements: specialRequirements || "",
      requestStatus: "Received",
    });

    res.status(201).json({
      success: true,
      tripRequest,
      message: "Custom itinerary request received! A senior Sherpa will craft your plan within 24 hours.",
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/trip-requests/my (Traveler's requests)
export async function getMyTripRequests(req, res, next) {
  try {
    const requests = await TripRequest.find({
      $or: [
        { user: req.user._id },
        { email: req.user.email.toLowerCase() },
      ],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      tripRequests: requests,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/trip-requests (Admin)
export async function getAllTripRequests(req, res, next) {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== "All") query.requestStatus = status;

    const tripRequests = await TripRequest.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tripRequests.length,
      tripRequests,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/trip-requests/:id/status (Admin)
export async function updateTripRequestStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { requestStatus } = req.body;

    const request = await TripRequest.findByIdAndUpdate(
      id,
      { requestStatus },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: "Trip request not found." });
    }

    res.json({
      success: true,
      tripRequest: request,
      message: `Status updated to ${requestStatus}.`,
    });
  } catch (error) {
    next(error);
  }
}
