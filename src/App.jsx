import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./Pages/Home";
import Admin from "./Pages/Admin";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Detail from "./Pages/Detail";
import Navbar from "./Pages/Navbar";
import Login from "./Pages/login";

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
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
        </Routes>
      </main>

      <footer className="footer-wrapper">
        <div className="footer-container">
          <div>
            <span style={{ fontWeight: 700, color: "#ffffff", fontSize: "1.05rem" }}>🌸 Orchids Haven</span>
            <p style={{ marginTop: "4px", fontSize: "0.85rem" }}>
              Hệ thống quản lý và chia sẻ kiến thức về các loài hoa lan quý hiếm.
            </p>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Trang Chủ</Link>
            <Link to="/about" style={{ color: "#94a3b8", textDecoration: "none" }}>Giới Thiệu</Link>
            <Link to="/contact" style={{ color: "#94a3b8", textDecoration: "none" }}>Liên Hệ</Link>
            <Link to="/admin" style={{ color: "#94a3b8", textDecoration: "none" }}>Quản Trị</Link>
          </div>
          <div style={{ fontSize: "0.825rem", color: "#64748b" }}>
            © 2026 FER202 - Lab 06. Developed by Duykhobo.
          </div>
        </div>
      </footer>
    </BrowserRouter>
  );
}

export default App;