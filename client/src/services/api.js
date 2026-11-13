const API_BASE = "/api";

async function request(endpoint, options = {}, { quietStatuses = [] } = {}) {
  const url = `${API_BASE}${endpoint}`;
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = {
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: "include", // Send & receive HttpOnly cookies
  };

  if (config.body && typeof config.body === "object" && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    if (!quietStatuses.includes(error.status)) {
      console.error(`API Error on [${options.method || "GET"} ${endpoint}]:`, error.message);
    }
    throw error;
  }
}

export const api = {
  // ── AUTH ──
  auth: {
    register: (body) => request("/auth/register", { method: "POST", body }),
    login: (body) => request("/auth/login", { method: "POST", body }),
    adminLogin: (body) => request("/auth/admin/login", { method: "POST", body }),
    googleLogin: (body) => request("/auth/google", { method: "POST", body }),
    requestLoginLink: (body) => request("/auth/request-login-link", { method: "POST", body }),
    verifyLoginLink: (body) => request("/auth/verify-login-link", { method: "POST", body }),
    logout: () => request("/auth/logout", { method: "POST" }),
    getMe: () => request("/auth/me"),
    updateProfile: (body) => request("/auth/profile", { method: "PUT", body }),
    changePassword: (body) => request("/auth/change-password", { method: "PUT", body }),
    forgotPassword: (email) => request("/auth/forgot-password", { method: "POST", body: { email } }),
    resetPassword: (token, password) =>
      request(`/auth/reset-password/${token}`, { method: "POST", body: { password } }),
  },

  // ── TREKS ──
  treks: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/treks${q ? `?${q}` : ""}`);
    },
    getBySlug: (slug) => request(`/treks/${slug}`),
    create: (body) => request("/treks", { method: "POST", body }),
    update: (id, body) => request(`/treks/${id}`, { method: "PUT", body }),
    delete: (id) => request(`/treks/${id}`, { method: "DELETE" }),
    togglePublish: (id) => request(`/treks/${id}/publish`, { method: "PATCH" }),
    toggleFeatured: (id, body = {}) => request(`/treks/${id}/featured`, { method: "PATCH", body }),
    toggleArchive: (id) => request(`/treks/${id}/archive`, { method: "PATCH" }),
  },

  // ── RANKINGS & DISCOVERY ──
  rankings: {
    getPopular: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/rankings/popular${q ? `?${q}` : ""}`);
    },
    getTopRated: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/rankings/top-rated${q ? `?${q}` : ""}`);
    },
    getFeatured: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/rankings/featured${q ? `?${q}` : ""}`);
    },
    trackView: (trekId) => request(`/rankings/view/${trekId}`, { method: "POST" }),
    setFeatured: (trekId, body) =>
      request(`/rankings/featured/${trekId}`, { method: "PATCH", body }),
    updateFeaturedOrder: (items) =>
      request(`/rankings/featured-order`, { method: "PUT", body: { items } }),
  },

  // ── DESTINATIONS ──
  destinations: {
    getAll: () => request("/destinations"),
    getBySlug: (slug) => request(`/destinations/${slug}`),
    create: (body) => request("/destinations", { method: "POST", body }),
    update: (id, body) => request(`/destinations/${id}`, { method: "PUT", body }),
    delete: (id) => request(`/destinations/${id}`, { method: "DELETE" }),
  },

  // ── REGIONS ──
  regions: {
    getAll: () => request("/regions"),
    getBySlug: (slug) => request(`/regions/${slug}`),
    create: (body) => request("/regions", { method: "POST", body }),
    update: (id, body) => request(`/regions/${id}`, { method: "PUT", body }),
    delete: (id) => request(`/regions/${id}`, { method: "DELETE" }),
  },

  // ── DEPARTURES ──
  departures: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/departures${q ? `?${q}` : ""}`);
    },
    getById: (id) => request(`/departures/${encodeURIComponent(id)}`),
    getAdminAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/departures/admin${q ? `?${q}` : ""}`, {}, { quietStatuses: [404] }).catch((error) => {
        if (error.status !== 404) throw error;
        return request(`/departures${q ? `?${q}` : ""}`).then((response) => ({
          ...response,
          adminFallback: true,
        }));
      });
    },
    getSummary: () => request("/departures/admin/summary"),
    create: (body) => request("/departures", { method: "POST", body }),
    update: (id, body) => request(`/departures/${id}`, { method: "PUT", body }),
    delete: (id) => request(`/departures/${id}`, { method: "DELETE" }),
  },

  // ── BOOKINGS ──
  bookings: {
    create: (body) => request("/bookings", { method: "POST", body }),
    getMy: () => request("/bookings/my"),
    getById: (id) => request(`/bookings/${id}`),
    cancel: (id, reason) => request(`/bookings/${id}/cancel`, { method: "POST", body: { reason } }),
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/bookings${q ? `?${q}` : ""}`);
    },
    updateStatus: (id, body) => request(`/bookings/${id}/status`, { method: "PATCH", body }),
    update: (id, body) => request(`/bookings/${id}`, { method: "PUT", body }),
    delete: (id) => request(`/bookings/${id}`, { method: "DELETE" }),
  },

  // ── REVIEWS ──
  reviews: {
    getApproved: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/reviews/approved${q ? `?${q}` : ""}`);
    },
    getForTrek: (trekId) => request(`/reviews/trek/${trekId}`),
    create: (body) => request("/reviews", { method: "POST", body }),
    verifyBooking: (body) => request("/reviews/verify-booking", { method: "POST", body }),
    requestVerification: (body) =>
      request("/reviews/request-verification", { method: "POST", body }),
    getVerification: (token) => request(`/reviews/verify/${encodeURIComponent(token)}`),
    createVerified: (body) => request("/reviews/verified", { method: "POST", body }),
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/reviews${q ? `?${q}` : ""}`);
    },
    moderate: (id, moderationStatus) =>
      request(`/reviews/${id}/moderate`, { method: "PATCH", body: { moderationStatus } }),
    delete: (id) => request(`/reviews/${id}`, { method: "DELETE" }),
  },

  // ── FAVORITES ──
  favorites: {
    get: () => request("/favorites"),
    toggle: (trekId) => request("/favorites/toggle", { method: "POST", body: { trekId } }),
    getAdminAll: () => request("/favorites/admin"),
  },

  // ── ARTICLES ──
  articles: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/articles${q ? `?${q}` : ""}`);
    },
    getAdminAll: () => request("/articles/admin"),
    getMine: () => request("/articles/mine"),
    getBySlug: (slug) => request(`/articles/${slug}`),
    create: (body) => request("/articles", { method: "POST", body }),
    submitStory: (body) => request("/articles/stories", { method: "POST", body }),
      updateStory: (id, body) => request(`/articles/stories/${id}`, { method: "PATCH", body }),
    moderateStory: (id, body) => request(`/articles/${id}/moderate-story`, { method: "PATCH", body }),
    update: (id, body) => request(`/articles/${id}`, { method: "PUT", body }),
    delete: (id) => request(`/articles/${id}`, { method: "DELETE" }),
  },

  guides: {
    getAll: () => request("/guides"),
    getAdminAll: () => request("/guides/admin"),
    create: (body) => request("/guides", { method: "POST", body }),
    update: (id, body) => request(`/guides/${id}`, { method: "PUT", body }),
    delete: (id) => request(`/guides/${id}`, { method: "DELETE" }),
  },

  // ── TRIP REQUESTS ──
  tripRequests: {
    create: (body) => request("/trip-requests", { method: "POST", body }),
    getMy: () => request("/trip-requests/my"),
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/trip-requests${q ? `?${q}` : ""}`);
    },
    updateStatus: (id, requestStatus) =>
      request(`/trip-requests/${id}/status`, { method: "PATCH", body: { requestStatus } }),
  },

  // ── CONTACT MESSAGES ──
  contactMessages: {
    create: (body) => request("/contact-messages", { method: "POST", body }),
    getAll: () => request("/contact-messages"),
    updateStatus: (id, status) =>
      request(`/contact-messages/${id}/status`, { method: "PATCH", body: { status } }),
  },

  inquiries: {
    create: (body) => request("/inquiries", { method: "POST", body }),
    getAdminAll: () => request("/inquiries/admin"),
    updateStatus: (id, status) => request(`/inquiries/${id}/status`, { method: "PATCH", body: { status } }),
    reply: (id, reply) => request(`/inquiries/${id}/reply`, { method: "POST", body: { reply } }),
  },

  uploads: {
    trekImages: (files) => {
      const body = new FormData();
      Array.from(files).forEach((file) => body.append("images", file));
      return request("/uploads/treks", { method: "POST", body });
    },
  },

  // ── ADMIN ──
  admin: {
    getStats: () => request("/admin/stats"),
    getSettings: () => request("/admin/settings"),
    updateSettings: (body) => request("/admin/settings", { method: "PUT", body }),
    getUsers: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/users${q ? `?${q}` : ""}`);
    },
    updateUserRole: (id, role) => request(`/users/${id}/role`, { method: "PATCH", body: { role } }),
    updateUserStatus: (id, status) =>
      request(`/users/${id}/status`, { method: "PATCH", body: { status } }),
    deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),
  },
};

export default api;
