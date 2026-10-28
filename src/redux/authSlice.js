import { createSlice } from "@reduxjs/toolkit";

// Thời hạn phiên đăng nhập hợp lệ: 2 giờ (Lab 6 Session Management)
export const SESSION_DURATION = 2 * 60 * 60 * 1000;

/**
 * Hàm kiểm tra tính hợp lệ của phiên đăng nhập (Session)
 * Xác minh:
 * 1. Cờ isAdmin trong localStorage === "true"
 * 2. orchid_user tồn tại và là admin
 * 3. Phiên chưa quá hạn thời gian (orchid_session_expires)
 */
export const validateAuthSession = () => {
  try {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const userStr = localStorage.getItem("orchid_user");
    if (!isAdmin || !userStr) {
      return false;
    }

    const user = JSON.parse(userStr);
    if (!user || !user.isAdmin) {
      return false;
    }

    const expiresAt = localStorage.getItem("orchid_session_expires");
    if (expiresAt && Number(expiresAt) < Date.now()) {
      // Phiên đã hết hạn thời gian -> Tự động dọn dẹp storage
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("orchid_user");
      localStorage.removeItem("orchid_session_expires");
      localStorage.removeItem("orchid_session_token");
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

const getSavedUser = () => {
  try {
    if (!validateAuthSession()) {
      return null;
    }
    const saved = localStorage.getItem("orchid_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const initialUser = getSavedUser();
const initialIsAdmin = validateAuthSession();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    isAuthenticated: initialIsAdmin && !!initialUser,
    isAdmin: initialIsAdmin,
    sessionToken: localStorage.getItem("orchid_session_token") || null,
    expiresAt: Number(localStorage.getItem("orchid_session_expires")) || null,
    loading: false,
    error: null,
  },
  reducers: {
    loginAdmin: (state) => {
      const expiresAt = Date.now() + SESSION_DURATION;
      const sessionToken = "session-admin-" + Date.now();
      const adminUser = {
        id: "admin-01",
        name: "Quản Trị Viên (Admin)",
        email: "admin@orchidshaven.vn",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "admin",
        isAdmin: true,
        loginType: "credentials",
        loginAt: new Date().toISOString(),
      };

      state.user = adminUser;
      state.isAdmin = true;
      state.isAuthenticated = true;
      state.sessionToken = sessionToken;
      state.expiresAt = expiresAt;
      state.error = null;

      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("orchid_user", JSON.stringify(adminUser));
      localStorage.setItem("orchid_session_token", sessionToken);
      localStorage.setItem("orchid_session_expires", String(expiresAt));
    },
    loginGoogle: (state, action) => {
      const expiresAt = Date.now() + SESSION_DURATION;
      const sessionToken = "session-google-" + Date.now();
      const googleUser = {
        id: action.payload.id || "google-" + Date.now(),
        name: action.payload.name || "Google User",
        email: action.payload.email || "user@gmail.com",
        avatar:
          action.payload.avatar ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        role: "admin", // Cho phép thực hiện CRUD theo yêu cầu Lab 6
        isAdmin: true,
        loginType: "google",
        loginAt: new Date().toISOString(),
      };

      state.user = googleUser;
      state.isAdmin = true;
      state.isAuthenticated = true;
      state.sessionToken = sessionToken;
      state.expiresAt = expiresAt;
      state.error = null;

      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("orchid_user", JSON.stringify(googleUser));
      localStorage.setItem("orchid_session_token", sessionToken);
      localStorage.setItem("orchid_session_expires", String(expiresAt));
    },
    logout: (state) => {
      state.user = null;
      state.isAdmin = false;
      state.isAuthenticated = false;
      state.sessionToken = null;
      state.expiresAt = null;
      state.error = null;

      localStorage.removeItem("isAdmin");
      localStorage.removeItem("orchid_user");
      localStorage.removeItem("orchid_session_token");
      localStorage.removeItem("orchid_session_expires");
    },
    checkSession: (state) => {
      const isValid = validateAuthSession();
      if (!isValid) {
        state.user = null;
        state.isAdmin = false;
        state.isAuthenticated = false;
        state.sessionToken = null;
        state.expiresAt = null;
      }
    },
    extendSession: (state) => {
      if (state.isAuthenticated && state.isAdmin) {
        const newExpires = Date.now() + SESSION_DURATION;
        state.expiresAt = newExpires;
        localStorage.setItem("orchid_session_expires", String(newExpires));
      }
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  loginAdmin,
  loginGoogle,
  logout,
  checkSession,
  extendSession,
  setAuthError,
} = authSlice.actions;

export default authSlice.reducer;
