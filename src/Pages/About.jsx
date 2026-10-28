import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";

export default function About() {
  const labRoadmap = [
    {
      title: "Lab 1 - React Components & List of 16 Orchids",
      content: "Xây dựng cấu trúc danh mục 16 loài hoa lan tuyển chọn, lưu trữ trong ListOfOrchids.js, sử dụng hàm map() duyệt dữ liệu và phân tách mô hình Container & Presentational Components."
    },
    {
      title: "Lab 2 - React Hooks & Custom Hooks",
      content: "Triển khai Custom Hook useTheme quản lý chuyển đổi Dark/Light mode toàn hệ thống; khởi tạo useModal điều khiển hiển thị thông tin hoa lan và video trailer clip khi nhấp vào hình ảnh."
    },
    {
      title: "Lab 3 - React Router SPA",
      content: "Tích hợp BrowserRouter, Routes, Route, Link và NavLink; hỗ trợ dynamic routing /detail/:id nhận tham số ID qua useParams và trang liên hệ /contact."
    },
    {
      title: "Lab 4 - React UI Library & Natural Route",
      content: "Thiết kế hệ thống giao diện chuẩn UI Library với Modal, Tabs phân loại, Accordion Collapsible, trang /natural hiển thị các giống lan rừng tự nhiên (isNatural = true) và nhúng video YouTube."
    },
    {
      title: "Lab 5 - CSS Preprocessor (SCSS)",
      content: "Tổ chức kiến trúc SCSS chuyên nghiệp trong thư mục src/SCSS với @use, variables, mixins, responsive breakpoints và trang giới thiệu bản thân sinh viên FPT."
    },
    {
      title: "Lab 6 - Fetch API, Redux Toolkit & Formik/Yup",
      content: "Kết nối MockAPI RESTful server CRUD (GET, POST, PUT, DELETE), quản lý trạng thái tập trung với Redux Toolkit (@reduxjs/toolkit), xác thực dữ liệu chặt chẽ bằng Formik + Yup và đăng nhập Google Account."
    }
  ];

  return (
    <div className="about-container">
      {/* Student Self-Introduction Card (Lab 5 Requirement - Anti-slop: No emoji, No gradients) */}
      <section className="student-profile-card">
        <div className="student-avatar-wrapper">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
            alt="Nguyễn Thanh Duy"
            className="student-avatar"
          />
          <span className="fpt-badge">FPT UNIVERSITY</span>
        </div>

        <div className="student-info">
          <span className="student-tag">Tác giả đồ án môn học</span>
          <h1 className="student-name">Nguyễn Thanh Duy</h1>
          <p className="student-role">
            Kỹ sư Công nghệ Thông tin (Software Engineering) - Đại học FPT
          </p>

          <div className="student-details-grid">
            <div className="detail-entry">
              <span>Môn học</span>
              <strong>FER202 - Front-End Web Development with React</strong>
            </div>
            <div className="detail-entry">
              <span>Học kỳ</span>
              <strong>Semester 5 - Fall 2026</strong>
            </div>
            <div className="detail-entry">
              <span>Chuyên ngành</span>
              <strong>Kỹ thuật Phần mềm (SE)</strong>
            </div>
            <div className="detail-entry">
              <span>Mục tiêu</span>
              <strong>Chuyên gia phát triển Front-End SPA & UI/UX</strong>
            </div>
          </div>

          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Đồ án được thực hiện theo đúng tiêu chuẩn kỹ thuật môn FER202, kết hợp kiến trúc Component hóa, Hooks, Redux Toolkit, Formik, Yup và hệ thống SCSS tiền tiến.
          </p>

          <div className="skills-pills">
            <span className="skill-pill">React 19</span>
            <span className="skill-pill">Redux Toolkit</span>
            <span className="skill-pill">SCSS Preprocessor</span>
            <span className="skill-pill">Formik & Yup</span>
            <span className="skill-pill">Fetch RESTful API</span>
            <span className="skill-pill">Google OAuth</span>
          </div>
        </div>
      </section>

      {/* 3 Pillars Grid */}
      <div style={{ margin: "40px 0 20px" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-main)" }}>
          Sứ Mệnh Bảo Tồn & Chia Sẻ Dữ Liệu Phong Lan
        </h2>
        <p style={{ color: "var(--text-muted)", marginTop: "6px" }}>
          Hệ sinh thái dữ liệu phong lan tiêu chuẩn cho học tập và nghiên cứu
        </p>
      </div>

      <div className="cards-grid-3">
        <div className="feature-card">
          <h3 className="feature-card-title">Kho Dữ Liệu Thực Vật Học</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            Tổng hợp thông tin nguồn gốc, điều kiện ánh sáng, nhiệt độ và độ ẩm của hàng chục giống lan quý như Cattleya, Phalaenopsis, Dendrobium.
          </p>
        </div>

        <div className="feature-card">
          <h3 className="feature-card-title">Bảo Tồn Nguồn Gen Quý</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            Ghi nhận và lưu trữ thông tin về các dòng lan đột biến, lan rừng tự nhiên bản địa nhằm mục đích nhân giống và nghiên cứu sinh học.
          </p>
        </div>

        <div className="feature-card">
          <h3 className="feature-card-title">Kiến Thức Canh Tác Bền Vững</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            Trao đổi kinh nghiệm từ cách ghép lụa, chọn giá thể, phòng ngừa sâu bệnh đến chế độ chăm sóc kích hoa nở đúng mùa.
          </p>
        </div>
      </div>

      {/* Lab Roadmap Accordion (Lab 4 Collapsible component) */}
      <div style={{ margin: "48px 0" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "16px", color: "var(--text-main)" }}>
          Lộ Trình 6 Bài Lab FER202
        </h2>
        <Accordion items={labRoadmap} />
      </div>

      {/* Call to action */}
      <div style={{ padding: "36px 24px", background: "var(--bg-card)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "8px" }}>Tra Cứu Bộ Sưu Tập Phong Lan</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "20px", maxWidth: "540px" }}>
          Khám phá danh mục 16 loại hoa lan tuyển chọn kèm thông số thực vật chi tiết.
        </p>
        <Link to="/" className="btn-primary">
          Xem Danh Sách Hoa Lan
        </Link>
      </div>
    </div>
  );
}