import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Home from "./Pages/Home";
import Natural from "./Pages/Natural";
import Admin from "./Pages/Admin";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Detail from "./Pages/Detail";
import Navbar from "./Pages/Navbar";
import Login from "./Pages/login";
import ScrollToTop from "./components/ScrollToTop";
import { checkSession, validateAuthSession } from "./redux/authSlice";

// ProtectedRoute kiểm tra quyền qua Redux Auth & Session Timestamp (Lab 6)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const location = useLocation();
  const isSessionValid = validateAuthSession();

  if (!isAuthenticated || !isAdmin || !isSessionValid) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          reason: !isSessionValid ? "session_expired" : "unauthorized",
        }}
      />
    );
  }
  return children;
};

function AppContent() {
  const dispatch = useDispatch();

  // Lắng nghe sự kiện storage để đồng bộ hóa trạng thái đăng xuất giữa các Tab trình duyệt
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (
        e.key === "isAdmin" ||
        e.key === "orchid_user" ||
        e.key === "orchid_session_expires"
      ) {
        dispatch(checkSession());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    // Kiểm tra định kỳ tính hợp lệ của session mỗi phút
    const interval = setInterval(() => {
      dispatch(checkSession());
    }, 60000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/natural" element={<Natural />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer-wrapper">
        <div className="footer-container">
          <div>
            <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "1.1rem", fontFamily: "var(--font-serif)" }}>
              Orchids Haven Archive
            </div>
            <p style={{ marginTop: "6px", fontSize: "0.85rem", maxWidth: "420px" }}>
              Hệ sinh thái lưu trữ và quản lý 16 loài phong lan quý hiếm. Đồ án môn FER202 - Đại học FPT.
            </p>
          </div>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Link to="/" style={{ color: "#8c9b91", textDecoration: "none" }}>Trang Chủ</Link>
            <Link to="/natural" style={{ color: "#8c9b91", textDecoration: "none" }}>Lan Tự Nhiên</Link>
            <Link to="/about" style={{ color: "#8c9b91", textDecoration: "none" }}>Giới Thiệu</Link>
            <Link to="/contact" style={{ color: "#8c9b91", textDecoration: "none" }}>Liên Hệ</Link>
            <Link to="/admin" style={{ color: "#8c9b91", textDecoration: "none" }}>Quản Trị</Link>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#6c7a71" }}>
            FER202 - Lab 01 to Lab 06. Sinh viên thực hiện: Nguyễn Thanh Duy.
          </div>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
