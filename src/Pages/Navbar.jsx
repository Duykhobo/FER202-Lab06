import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    alert("Đã đăng xuất khỏi tài khoản Quản trị!");
    navigate("/");
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-brand-icon">🌸</span>
          <span className="navbar-brand-text">Orchids Haven</span>
        </NavLink>

        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Trang Chủ
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Giới Thiệu
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Liên Hệ
          </NavLink>

          {isAdmin ? (
            <>
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Quản Trị <span className="nav-admin-badge">Admin</span>
              </NavLink>
              <button onClick={handleLogout} className="nav-logout-btn" title="Đăng xuất quyền Admin">
                Đăng Xuất
              </button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Đăng Nhập
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}