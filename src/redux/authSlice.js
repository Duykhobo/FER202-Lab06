import { createSlice } from "@reduxjs/toolkit";

const getSavedUser = () => {
  try {
    const saved = localStorage.getItem("orchid_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const initialUser = getSavedUser();
const initialIsAdmin = localStorage.getItem("isAdmin") === "true" || !!initialUser?.isAdmin;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    isAuthenticated: !!initialUser || initialIsAdmin,
    isAdmin: initialIsAdmin,
    loading: false,
    error: null,
  },
  reducers: {
    loginAdmin: (state) => {
      const adminUser = {
        id: "admin-01",
        name: "Quản Trị Viên (Admin)",
        email: "admin@orchidshaven.vn",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "admin",
        isAdmin: true,
      };
      state.user = adminUser;
      state.isAdmin = true;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("orchid_user", JSON.stringify(adminUser));
    },
    loginGoogle: (state, action) => {
      // Nhận payload thông tin tài khoản Google
      const googleUser = {
        id: action.payload.id || "google-" + Date.now(),
        name: action.payload.name || "Google User",
        email: action.payload.email || "user@gmail.com",
        avatar: action.payload.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        role: "admin", // Cho phép thực hiện CRUD theo yêu cầu Lab 6
        isAdmin: true,
      };
      state.user = googleUser;
      state.isAdmin = true;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("orchid_user", JSON.stringify(googleUser));
    },
    logout: (state) => {
      state.user = null;
      state.isAdmin = false;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("orchid_user");
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { loginAdmin, loginGoogle, logout, setAuthError } = authSlice.actions;
export default authSlice.reducer;
