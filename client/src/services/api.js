const API_BASE = "/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: "include", // Send & receive HttpOnly cookies
  };

  if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || "GET"} ${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // ── AUTH ──
  auth: {
    register: (body) => request("/auth/register", { method: "POST", body }),
    login: (body) => request("/auth/login", { method: "POST", body }),
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
    toggleFeatured: (id) => request(`/treks/${id}/featured`, { method: "PATCH" }),
  },

  // ── DESTINATIONS ──
  destinations: {
    getAll: () => request("/destinations"),
    getBySlug: (slug) => request(`/destinations/${slug}`),
    create: (body) => request("/destinations", { method: "POST", body }),
    update: (id, body) => request(`/destinations/${id}`, { method: "PUT", body }),
    delete: (id) => request(`/destinations/${id}`, { method: "DELETE" }),
  },

  // ── DEPARTURES ──
  departures: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/departures${q ? `?${q}` : ""}`);
    },
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
  },

  // ── REVIEWS ──
  reviews: {
    getForTrek: (trekId) => request(`/reviews/trek/${trekId}`),
    create: (body) => request("/reviews", { method: "POST", body }),
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
  },

  // ── ARTICLES ──
  articles: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/articles${q ? `?${q}` : ""}`);
    },
    getBySlug: (slug) => request(`/articles/${slug}`),
    create: (body) => request("/articles", { method: "POST", body }),
    update: (id, body) => request(`/articles/${id}`, { method: "PUT", body }),
    delete: (id) => request(`/articles/${id}`, { method: "DELETE" }),
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
  },
};

export default api;
