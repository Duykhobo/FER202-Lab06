import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "123456") {
      localStorage.setItem("isAdmin", "true");
      alert("🎉 Đăng nhập quyền Quản trị thành công!");
      navigate("/admin");
    } else {
      alert("❌ Sai tài khoản hoặc mật khẩu! Vui lòng thử lại.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-icon">🌸</div>
        <h1 className="login-title">Đăng Nhập Quản Trị</h1>
        <p className="login-subtitle">Truy cập vào hệ thống điều hành và quản lý danh mục hoa lan</p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Nhập tài khoản (admin)"
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
              placeholder="Nhập mật khẩu (123456)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: "8px", width: "100%", padding: "12px" }}>
            🔐 Đăng Nhập Hệ Thống
          </button>
        </form>

        <div className="login-hint">
          <p><strong>💡 Tài khoản quản trị mặc định:</strong></p>
          <p>• Username: <code style={{ color: "var(--primary-dark)", fontWeight: 700 }}>admin</code></p>
          <p>• Password: <code style={{ color: "var(--primary-dark)", fontWeight: 700 }}>123456</code></p>
        </div>

        <div style={{ marginTop: "20px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          <Link to="/" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            ← Quay lại Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}