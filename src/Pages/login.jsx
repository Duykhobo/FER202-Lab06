import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAdmin, loginGoogle } from "../redux/authSlice";
import { useToast } from "../components/ToastContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  // Đăng nhập bằng Google Account (Lab 6 Requirement)
  const handleGoogleLogin = () => {
    const mockGoogleProfile = {
      id: "google-10928374",
      name: "Duy Thanh (Google User)",
      email: "duythanh.fpt@gmail.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      role: "admin",
      isAdmin: true,
    };

    dispatch(loginGoogle(mockGoogleProfile));
    toast.success("Đăng nhập thành công bằng tài khoản Google!");
    navigate("/admin");
  };

  // Đăng nhập bằng tài khoản quản trị Admin
  const handleAdminLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "123456") {
      setLoginError("");
      dispatch(loginAdmin());
      toast.success("Đăng nhập tài khoản Quản trị thành công!");
      navigate("/admin");
    } else {
      setLoginError("Sai tài khoản hoặc mật khẩu! Vui lòng thử lại với admin / 123456");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Đăng Nhập Quản Trị</h1>
        <p className="login-subtitle">
          Truy cập quyền quản trị để thực hiện CRUD hoa lan trên MockAPI (Lab 6)
        </p>

        {/* Nút Đăng Nhập Google (Lab 6 Requirement) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="google-btn"
          title="Đăng nhập bằng Google"
        >
          <svg viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Đăng nhập với Google</span>
        </button>

        <div className="divider-or">
          <span>Hoặc đăng nhập Admin</span>
        </div>

        {/* Form đăng nhập quản trị */}
        <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Tài khoản</label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: "4px", width: "100%", padding: "10px" }}>
            Đăng Nhập Hệ Thống
          </button>

          {loginError && <div className="form-error-msg" style={{ textAlign: "left" }}>{loginError}</div>}
        </form>

        <div className="login-hint">
          <p><strong>Tài khoản mẫu kiểm thử:</strong></p>
          <p>- Google: Nhấn nút Google để đăng nhập quyền Quản trị</p>
          <p>- Mặc định: <code>admin</code> / <code>123456</code></p>
        </div>

        <div style={{ marginTop: "20px", fontSize: "0.85rem" }}>
          <Link to="/" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            Quay lại Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}