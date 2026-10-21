import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="about-container">
      {/* About Hero */}
      <section className="about-hero">
        <div className="hero-pill">
          <span>🌸</span> Về Chúng Tôi
        </div>
        <h1 className="hero-title">Sứ Mệnh Bảo Tồn & Lan Tỏa Vẻ Đẹp Hoa Lan</h1>
        <p className="hero-subtitle">
          Orchids Haven được xây dựng như một không gian trực tuyến kết nối những người đam mê phong lan, cung cấp dữ liệu chính xác về các loài lan và phương pháp canh tác bền vững.
        </p>
      </section>

      {/* 3 Pillars Grid */}
      <div className="cards-grid-3">
        <div className="feature-card">
          <div className="feature-card-icon">📚</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>Kho Dữ Liệu Chính Xác</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.925rem", lineHeight: 1.6 }}>
            Tổng hợp thông tin nguồn gốc thực vật học, điều kiện sinh trưởng, ánh sáng, nhiệt độ và độ ẩm của hàng trăm giống lan quý.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-card-icon">🌱</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>Bảo Tồn Giống Lan Quý</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.925rem", lineHeight: 1.6 }}>
            Hỗ trợ ghi nhận và lưu trữ thông tin về các dòng lan đột biến, lan rừng quý hiếm nhằm mục đích nghiên cứu và bảo tồn nguồn gen.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-card-icon">🤝</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>Cộng Đồng Đam Mê</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.925rem", lineHeight: 1.6 }}>
            Tạo sân chơi trao đổi kinh nghiệm thực chiến từ cách ghép giá thể, phòng trừ sâu bệnh đến kích hoa nở đúng dịp lễ Tết.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div style={{ marginTop: "50px", textAlign: "center", padding: "40px 24px", background: "#ffffff", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "12px" }}>Khám Phá Bộ Sưu Tập Ngay Hôm Nay</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px", maxWidth: "540px", margin: "0 auto 24px" }}>
          Tìm kiếm chậu lan ưng ý nhất cho góc làm việc hoặc khu vườn của bạn.
        </p>
        <Link to="/" className="btn-primary">
          Xem Toàn Bộ Danh Sách Hoa Lan →
        </Link>
      </div>
    </div>
  );
}