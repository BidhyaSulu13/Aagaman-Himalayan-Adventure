import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, clearAuthToken } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.auth
      .getMe()
      .then((res) => {
        if (mounted && res.success && res.user) {
          setUser(res.user);
        }
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    if (user && user.role !== "traveler") {
      throw new Error("Log out of your admin account before signing in as a traveler.");
    }
    const res = await api.auth.login({ email, password });
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  }, [user]);

  const loginAdmin = useCallback(async (email, password) => {
    if (user && user.role !== "admin") {
      throw new Error("Log out of your traveler account before signing in as an admin.");
    }
    const res = await api.auth.adminLogin({ email, password });
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  }, [user]);

  const loginWithGoogle = useCallback(async (credential) => {
    if (user && user.role !== "traveler") {
      throw new Error("Log out of your admin account before signing in as a traveler.");
    }
    const res = await api.auth.googleLogin({ credential });
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  }, [user]);

  const loginWithEmailLink = useCallback(async (token) => {
    if (user && user.role !== "traveler") {
      throw new Error("Log out of your admin account before signing in as a traveler.");
    }
    const res = await api.auth.verifyLoginLink({ token });
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  }, [user]);

  const register = useCallback(async (name, email, password) => {
    if (user && user.role !== "traveler") {
      throw new Error("Log out of your admin account before creating a traveler session.");
    }
    const res = await api.auth.register({ name, email, password });
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  }, [user]);

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Clear local state even if the server is unreachable.
    } finally {
      clearAuthToken();
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    const res = await api.auth.updateProfile(profileData);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const changePassword = async (passwords) => {
    return await api.auth.changePassword(passwords);
  };

  const value = {
    user,
    loading,
    isAdmin: user?.role === "admin",
    login,
    loginAdmin,
    loginWithGoogle,
    loginWithEmailLink,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
