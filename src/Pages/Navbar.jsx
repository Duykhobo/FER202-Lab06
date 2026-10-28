import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { logout } from "../redux/authSlice";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../components/ToastContext";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, isAdmin } = useSelector((state) => state.auth);
  const toast = useToast();

  // Custom hook Toggle Dark/Light Theme (Lab 2 Requirement)
  const { toggleTheme, isDark } = useTheme();

  // Toast xác nhận trước khi đăng xuất
  const handleLogout = () => {
    toast.confirm(
      "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?",
      async () => {
        try {
          await signOut(auth);
        } catch (err) {
          console.warn("Lỗi khi đăng xuất Firebase Auth:", err);
        }
        dispatch(logout());
        toast.success("Đăng xuất thành công! Hẹn gặp lại bạn.");
        navigate("/");
      },
      {
        confirmText: "Đăng Xuất",
        cancelText: "Hủy",
      }
    );
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Brand Wordmark (Clean Botanical Archive) */}
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-brand-text">Orchids Haven</span>
        </NavLink>

        {/* Navigation Links */}
        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Trang Chủ
          </NavLink>

          {/* Route Natural (Lab 4 Requirement) */}
          <NavLink to="/natural" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Lan Tự Nhiên
          </NavLink>

          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Giới Thiệu
          </NavLink>

          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Liên Hệ
          </NavLink>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Quản Trị <span className="nav-admin-badge">Admin</span>
                </NavLink>
              )}

              {/* User Avatar & Info */}
              {user && (
                <div className="nav-user-info" title={user.email}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="user-avatar" />
                  ) : (
                    <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>U</span>
                  )}
                  <span className="user-name">{user.name?.split(" ")[0] || "User"}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="nav-logout-btn"
                title="Đăng xuất khỏi tài khoản"
              >
                Đăng Xuất
              </button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Đăng Nhập
            </NavLink>
          )}

          {/* Dark / Light Mode Toggle Button with clean text/svg indicator (Lab 2 Requirement) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Chuyển sang giao diện ${isDark ? "Sáng" : "Tối"}`}
            aria-label="Toggle theme mode"
          >
            {isDark ? (
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
