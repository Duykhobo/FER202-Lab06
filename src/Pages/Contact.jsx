import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Vui lòng điền đầy đủ thông tin vào các trường!");
      return;
    }
    setSent(true);
    alert(`Cảm ơn bạn ${formData.name}! Chúng tôi đã nhận được tin nhắn và sẽ liên hệ lại qua email ${formData.email} trong thời gian sớm nhất.`);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-container">
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div className="hero-pill">
          <span>📬</span> Trợ Giúp & Tư Vấn
        </div>
        <h1 className="hero-title" style={{ fontSize: "2.3rem" }}>Liên Hệ Với Orchids Haven</h1>
        <p className="hero-subtitle">
          Bạn cần tư vấn chọn giống lan, kỹ thuật trồng hay có câu hỏi về hệ thống? Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ.
        </p>
      </div>

      <div className="contact-layout">
        {/* Left Information Card */}
        <div className="contact-info-card">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px" }}>Thông Tin Trực Tiếp</h2>
          <p style={{ opacity: 0.9, fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "32px" }}>
            Chúng tôi luôn lắng nghe mọi ý kiến đóng góp và sẵn sàng tư vấn cách chăm sóc hoa lan cho bạn.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <span style={{ fontSize: "1.4rem" }}>📍</span>
              <div>
                <strong style={{ display: "block", fontSize: "0.95rem" }}>Địa chỉ vườn lan:</strong>
                <span style={{ opacity: 0.85, fontSize: "0.875rem" }}>Khu Công Nghệ Cao, TP. Thủ Đức, TP. Hồ Chí Minh</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <span style={{ fontSize: "1.4rem" }}>📧</span>
              <div>
                <strong style={{ display: "block", fontSize: "0.95rem" }}>Hòm thư điện tử:</strong>
                <span style={{ opacity: 0.85, fontSize: "0.875rem" }}>contact@orchidshaven.vn</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <span style={{ fontSize: "1.4rem" }}>📞</span>
              <div>
                <strong style={{ display: "block", fontSize: "0.95rem" }}>Hotline hỗ trợ:</strong>
                <span style={{ opacity: 0.85, fontSize: "0.875rem" }}>+84 (0) 909 123 456 (8:00 - 18:00)</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <span style={{ fontSize: "1.4rem" }}>⏰</span>
              <div>
                <strong style={{ display: "block", fontSize: "0.95rem" }}>Thời gian làm việc:</strong>
                <span style={{ opacity: 0.85, fontSize: "0.875rem" }}>Thứ Hai - Thứ Bảy: 8:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Contact Form Card */}
        <div className="contact-form-card">
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "20px" }}>Gửi Tin Nhắn Cho Chúng Tôi</h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="contactName">Họ và tên của bạn *</label>
              <input
                id="contactName"
                type="text"
                className="form-input"
                placeholder="VD: Nguyễn Văn A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactEmail">Địa chỉ Email liên hệ *</label>
              <input
                id="contactEmail"
                type="email"
                className="form-input"
                placeholder="VD: nguyenvana@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactMsg">Nội dung tin nhắn *</label>
              <textarea
                id="contactMsg"
                rows="4"
                className="form-textarea"
                placeholder="Hãy chia sẻ câu hỏi hoặc giống lan bạn đang tìm kiếm..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: "14px 24px" }}>
              ✉️ Gửi Tin Nhắn Ngay
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}