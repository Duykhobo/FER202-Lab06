import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { loginAdmin, loginGoogle, validateAuthSession } from "../redux/authSlice";
import { useToast } from "../components/ToastContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const toast = useToast();
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  // Lý do chuyển hướng (hết hạn session / đăng xuất / chưa đăng nhập)
  const redirectReason = location.state?.reason;

  // Nếu người dùng đã có phiên hợp lệ, tự động chuyển hướng đến trang Quản trị
  useEffect(() => {
    if (isAuthenticated && isAdmin && validateAuthSession()) {
      const destination = location.state?.from || "/admin";
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location.state]);

  // Đăng nhập bằng Google Account thực tế qua Firebase (Lab 6 Requirement)
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setLoginError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const googleProfile = {
        id: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Google User",
        email: user.email || "",
        avatar:
          user.photoURL ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        role: "admin",
        isAdmin: true,
      };

      dispatch(loginGoogle(googleProfile));
      toast.success(`Đăng nhập Google thành công! Xin chào ${googleProfile.name}.`);
      const destination = location.state?.from || "/admin";
      navigate(destination, { replace: true });
    } catch (err) {
      console.error("Firebase Google Auth Error:", err);
      let errorMsg = "Vui lòng thử lại sau.";

      if (err.code === "auth/popup-closed-by-user") {
        toast.info("Bạn đã đóng cửa sổ đăng nhập Google.");
        return;
      } else if (err.code === "auth/popup-blocked") {
        errorMsg = "Trình duyệt đã chặn popup đăng nhập. Vui lòng cấp quyền cho phép popup trên thanh địa chỉ.";
      } else if (err.code === "auth/unauthorized-domain") {
        errorMsg = "Domain hiện tại chưa được cấp phép trong Firebase Auth (vui lòng thêm localhost vào Authorized Domains trong Firebase Console).";
      } else if (err.code === "auth/cancelled-popup-request") {
        errorMsg = "Yêu cầu đăng nhập đang được xử lý, vui lòng chờ trong giây lát.";
      } else if (err.code === "auth/network-request-failed") {
        errorMsg = "Lỗi kết nối mạng, vui lòng kiểm tra lại kết nối internet.";
      } else if (err.message) {
        errorMsg = err.message;
      }

      setLoginError(`Lỗi đăng nhập Google: ${errorMsg}`);
      toast.error(`Đăng nhập Google thất bại: ${errorMsg}`);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Đăng nhập bằng tài khoản quản trị Admin
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setIsAdminLoading(true);
    setLoginError("");

    const u = username.trim();
    const p = password.trim();

    setTimeout(() => {
      if (u === "admin" && p === "123456") {
        setLoginError("");
        dispatch(loginAdmin());
        toast.success("Đăng nhập tài khoản Quản trị thành công! Phiên hoạt động 2 giờ.");
        const destination = location.state?.from || "/admin";
        navigate(destination, { replace: true });
      } else {
        const msg = "Sai tài khoản hoặc mật khẩu! Vui lòng thử lại với admin / 123456";
        setLoginError(msg);
        toast.error(msg);
      }
      setIsAdminLoading(false);
    }, 250);
  };

  // Nút tiện ích điền nhanh tài khoản Admin demo (Cực tiện lợi cho chấm thi và kiểm thử)
  const handleQuickFillAdmin = () => {
    setUsername("admin");
    setPassword("123456");
    setLoginError("");
    toast.info("Đã điền sẵn tài khoản Admin mẫu: admin / 123456");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Banner cảnh báo phiên đăng nhập khi bị chuyển hướng */}
        {redirectReason === "session_expired" && (
          <div className="login-session-alert">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Phiên làm việc đã kết thúc</strong>
              <p>Bạn đã đăng xuất hoặc phiên đăng nhập đã quá hạn. Vui lòng đăng nhập lại để tiếp tục quản trị.</p>
            </div>
          </div>
        )}

        {redirectReason === "unauthorized" && (
          <div className="login-session-alert warning">
            <span className="alert-icon">🔒</span>
            <div>
              <strong>Yêu cầu quyền Quản trị</strong>
              <p>Bạn cần đăng nhập tài khoản quản trị để truy cập và thao tác dữ liệu hoa lan.</p>
            </div>
          </div>
        )}

        <div className="login-header-group">
          <div className="login-badge-pill">FER202 • Lab 6 Authentication</div>
          <h1 className="login-title">Đăng Nhập Quản Trị</h1>
          <p className="login-subtitle">
            Hệ thống xác thực phiên làm việc & phân quyền CRUD danh mục hoa lan
          </p>
        </div>

        {/* Nút Đăng Nhập Google (Lab 6 Requirement) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="google-btn"
          title="Đăng nhập bằng tài khoản Google"
          disabled={isGoogleLoading || isAdminLoading}
          style={{
            opacity: isGoogleLoading ? 0.75 : 1,
            cursor: isGoogleLoading ? "wait" : "pointer",
          }}
        >
          {isGoogleLoading ? (
            <div className="btn-spinner" />
          ) : (
            <svg viewBox="0 0 24 24" className="google-icon">
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
          )}
          <span>{isGoogleLoading ? "Đang xác thực Google..." : "Đăng nhập với Google"}</span>
        </button>

        <div className="divider-or">
          <span>Hoặc đăng nhập Admin hệ thống</span>
        </div>

        {/* Form đăng nhập quản trị */}
        <form onSubmit={handleAdminLogin} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Tài khoản
            </label>
            <div className="input-with-icon">
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="form-label" htmlFor="password">
                Mật khẩu
              </label>
              <button
                type="button"
                className="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
            <div className="input-with-icon">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="123456"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary login-submit-btn"
            disabled={isAdminLoading || isGoogleLoading}
          >
            {isAdminLoading ? "Đang kiểm tra thông tin..." : "Đăng Nhập Quản Trị"}
          </button>

          {loginError && (
            <div className="form-error-msg login-error-box">
              <span style={{ marginRight: "6px" }}>⚠️</span>
              <span>{loginError}</span>
            </div>
          )}
        </form>

        {/* Nút điền nhanh Demo Account */}
        <div className="quick-fill-container">
          <button
            type="button"
            onClick={handleQuickFillAdmin}
            className="btn-quick-fill"
            title="Điền sẵn tài khoản admin / 123456"
          >
            ⚡ Điền nhanh tài khoản Admin mẫu
          </button>
        </div>

        <div className="login-hint">
          <p className="hint-header">
            <strong>Thông tin tài khoản kiểm thử:</strong>
          </p>
          <div className="hint-item">
            <span className="hint-dot" />
            <span>
              Google Auth: Nhấn nút <strong>Đăng nhập với Google</strong>
            </span>
          </div>
          <div className="hint-item">
            <span className="hint-dot" />
            <span>
              Mặc định: <code>admin</code> / <code>123456</code> (Thời hạn phiên 2 giờ)
            </span>
          </div>
        </div>

        <div className="login-footer-links">
          <Link to="/" className="back-home-link">
            ← Quay lại Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
