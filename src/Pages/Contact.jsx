import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Accordion from "../components/Accordion";
import { useToast } from "../components/ToastContext";

const contactValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Họ và tên phải có ít nhất 3 ký tự")
    .max(50, "Họ và tên không quá 50 ký tự")
    .required("Vui lòng nhập họ và tên"),
  email: Yup.string()
    .email("Địa chỉ email không hợp lệ")
    .required("Vui lòng nhập email liên hệ"),
  phone: Yup.string()
    .matches(/^[0-9+ ()-]{9,15}$/, "Số điện thoại không đúng định dạng (9 - 15 số)")
    .required("Vui lòng nhập số điện thoại liên hệ"),
  message: Yup.string()
    .min(10, "Nội dung tin nhắn tối thiểu 10 ký tự")
    .required("Vui lòng nhập nội dung tin nhắn"),
});

export default function Contact() {
  const [submittedMessage, setSubmittedMessage] = useState(null);
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    validationSchema: contactValidationSchema,
    onSubmit: (values, { resetForm }) => {
      setSubmittedMessage(`Cảm ơn bạn ${values.name}. Thông tin đã được tiếp nhận và chúng tôi sẽ phản hồi qua email ${values.email} trong vòng 24 giờ.`);
      toast.success(`Gửi tin nhắn thành công! Cảm ơn ${values.name} đã liên hệ với Orchids Haven.`);
      resetForm();
    },
  });

  const faqs = [
    {
      title: "Cách chọn giống lan phù hợp cho người mới bắt đầu",
      content: "Với người mới tập chăm lan, các dòng Lan Hồ Điệp (Phalaenopsis) hoặc Hoàng Thảo (Dendrobium) là lựa chọn phù hợp nhờ sức sống bền bỉ, dễ thích nghi với khí hậu và chu kỳ nở hoa lâu tàn."
    },
    {
      title: "Chính sách đóng gói và vận chuyển",
      content: "Orchids Haven áp dụng quy trình đóng thùng chuyên dụng có nếp cố định gốc rễ, bảo vệ thân và cành hoa an toàn trong suốt quá trình vận chuyển."
    },
    {
      title: "Chế độ tưới nước và ánh sáng tiêu chuẩn",
      content: "Nên tưới vào buổi sáng sớm khi giá thể đã khô ráo, tránh đọng nước vào ban đêm. Đa số các loài phong lan thích hợp với ánh sáng tán xạ 60-70%."
    }
  ];

  return (
    <div className="contact-container">
      <div style={{ marginBottom: "36px" }}>
        <h1 className="hero-title">Liên Hệ & Tư Vấn Thực Vật Học</h1>
        <p className="hero-subtitle">
          Tiếp nhận thông tin trao đổi học thuật, tư vấn kỹ thuật canh tác và hỗ trợ thông tin bộ sưu tập.
        </p>
      </div>

      <div className="contact-layout">
        {/* Left Information Card */}
        <div className="contact-info-card">
          <h2>Thông Tin Liên Hệ</h2>
          <p style={{ opacity: 0.85, fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "28px" }}>
            Mọi ý kiến đóng góp và câu hỏi về giống lan xin vui lòng gửi qua các kênh thông tin bên dưới.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <strong style={{ display: "block", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.7 }}>
                Địa chỉ vườn thực nghiệm
              </strong>
              <span style={{ fontSize: "0.9rem" }}>Khu Công Nghệ Cao, TP. Thủ Đức, TP. Hồ Chí Minh</span>
            </div>

            <div>
              <strong style={{ display: "block", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.7 }}>
                Hòm thư điện tử
              </strong>
              <span style={{ fontSize: "0.9rem" }}>contact@orchidshaven.vn</span>
            </div>

            <div>
              <strong style={{ display: "block", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.7 }}>
                Điện thoại hỗ trợ
              </strong>
              <span style={{ fontSize: "0.9rem" }}>+84 (0) 909 123 456 (8:00 - 18:00)</span>
            </div>

            <div>
              <strong style={{ display: "block", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.7 }}>
                Thời gian làm việc
              </strong>
              <span style={{ fontSize: "0.9rem" }}>Thứ Hai - Thứ Bảy: 8:00 - 18:00</span>
            </div>
          </div>
        </div>

        {/* Right Contact Form Card (Formik + Yup Validation - Lab 6 Requirement) */}
        <div className="contact-form-card">
          <h2>Gửi Tin Nhắn Liên Hệ</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px" }}>
            Xác thực dữ liệu bằng Formik & Yup (Lab 6)
          </p>

          {submittedMessage && (
            <div style={{ padding: "10px 14px", background: "var(--primary-light)", color: "var(--primary)", borderRadius: "var(--radius-xs)", marginBottom: "16px", fontSize: "0.85rem", fontWeight: 600 }}>
              {submittedMessage}
            </div>
          )}

          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="contactName">Họ và tên *</label>
              <input
                id="contactName"
                name="name"
                type="text"
                className={`form-input ${formik.touched.name && formik.errors.name ? "error" : ""}`}
                placeholder="Nguyễn Văn An"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="form-error-msg">{formik.errors.name}</div>
              ) : null}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="contactEmail">Email liên hệ *</label>
                <input
                  id="contactEmail"
                  name="email"
                  type="email"
                  className={`form-input ${formik.touched.email && formik.errors.email ? "error" : ""}`}
                  placeholder="name@gmail.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="form-error-msg">{formik.errors.email}</div>
                ) : null}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contactPhone">Số điện thoại *</label>
                <input
                  id="contactPhone"
                  name="phone"
                  type="tel"
                  className={`form-input ${formik.touched.phone && formik.errors.phone ? "error" : ""}`}
                  placeholder="0909123456"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <div className="form-error-msg">{formik.errors.phone}</div>
                ) : null}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactMsg">Nội dung *</label>
              <textarea
                id="contactMsg"
                name="message"
                rows="4"
                className={`form-textarea ${formik.touched.message && formik.errors.message ? "error" : ""}`}
                placeholder="Nhập nội dung cần trao đổi hoặc tư vấn..."
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.message && formik.errors.message ? (
                <div className="form-error-msg">{formik.errors.message}</div>
              ) : null}
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", padding: "12px" }}>
              Gửi Tin Nhắn
            </button>
          </form>
        </div>
      </div>

      {/* Accordion FAQs (Lab 4) */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px" }}>
          Câu Hỏi Thường Gặp
        </h2>
        <Accordion items={faqs} />
      </div>
    </div>
  );
}