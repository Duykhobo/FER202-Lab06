import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getOrchidById } from "../services/orchidService";
import { getOrchidImage, handleImageError } from "../utils/imageHelper";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reduxOrchids = useSelector((state) => state.orchids.items);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchProduct = async () => {
      const foundInStore = reduxOrchids.find((item) => String(item.id) === String(id));
      if (foundInStore) {
        setProduct(foundInStore);
        setLoading(false);
        return;
      }

      try {
        const data = await getOrchidById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, reduxOrchids]);

  if (loading) {
    return (
      <div className="state-container">
        <div className="spinner"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>
          Đang tải thông tin chi tiết hoa lan #{id}...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="state-container">
        <h3 style={{ color: "var(--danger)", marginBottom: "8px" }}>Không tìm thấy sản phẩm</h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
          {error || `Mã hoa lan #${id} không tồn tại trên hệ thống.`}
        </p>
        <Link to="/" className="btn-primary">Quay lại Trang Chủ</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      {/* Breadcrumb Navigation (Lab 3) */}
      <nav className="breadcrumb-nav">
        <Link to="/">Trang Chủ</Link>
        <span>/</span>
        {product.isNatural && (
          <>
            <Link to="/natural">Lan Tự Nhiên</Link>
            <span>/</span>
          </>
        )}
        <span style={{ color: "var(--text-main)", fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* Main Detail Showcase Card */}
      <div className="detail-card">
        {/* Left Image / Video column */}
        <div className="detail-image-wrapper">
          <img
            src={getOrchidImage(product.image, product.id)}
            alt={product.name}
            className="detail-image"
            onError={(e) => handleImageError(e, product.id)}
          />
        </div>

        {/* Right Info Column */}
        <div className="detail-content">
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ padding: "3px 8px", background: "var(--primary-light)", color: "var(--primary)", borderRadius: "var(--radius-xs)", fontSize: "0.8rem", fontWeight: 600 }}>
              Chi {product.category || "Cattleya"} • #{product.id}
            </span>
            {product.isNatural && <span className="badge-natural">Tự Nhiên</span>}
            {product.isSpecial && <span className="badge-special">Đặc Biệt</span>}
          </div>

          <h1 className="detail-title">{product.name}</h1>

          <div className="detail-price-box">
            <span className="detail-price">${Number(product.price || 0).toFixed(2)}</span>
            <span className="detail-price-label">(Giá đã bao gồm chậu & giá thể)</span>
          </div>

          {/* Tab Navigation (Lab 4 Requirement) */}
          <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px", margin: "14px 0" }}>
            <button
              type="button"
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
              style={{ padding: "6px 14px", fontSize: "0.825rem" }}
            >
              Tổng Quan
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "care" ? "active" : ""}`}
              onClick={() => setActiveTab("care")}
              style={{ padding: "6px 14px", fontSize: "0.825rem" }}
            >
              Cách Chăm Sóc
            </button>
            {product.clip && (
              <button
                type="button"
                className={`tab-btn ${activeTab === "video" ? "active" : ""}`}
                onClick={() => setActiveTab("video")}
                style={{ padding: "6px 14px", fontSize: "0.825rem" }}
              >
                Video Clip
              </button>
            )}
          </div>

          {/* Tab Contents */}
          {activeTab === "overview" && (
            <>
              <p className="detail-description">
                {product.description || "Loại phong lan này sở hữu vẻ đẹp thanh cao, cánh hoa dày dặn và hương thơm tự nhiên quyến rũ. Cây sinh trưởng tốt trong khí hậu nhiệt đới, rễ bám khỏe."}
              </p>

              <div className="detail-features">
                <div className="feature-item">
                  <span>Xuất xứ: <strong>{product.origin || "Vietnam"}</strong></span>
                </div>
                <div className="feature-item">
                  <span>Màu hoa: <strong>{product.color || "Tự nhiên"}</strong></span>
                </div>
                <div className="feature-item">
                  <span>Đánh giá: <strong>{product.rating || 5} / 5</strong></span>
                </div>
                <div className="feature-item">
                  <span>Lượt thích: <strong>{product.numberOfLike || 120}</strong></span>
                </div>
              </div>
            </>
          )}

          {activeTab === "care" && (
            <div style={{ padding: "10px 0", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
              <p><strong>Tưới nước:</strong> 1-2 lần/ngày vào sáng sớm hoặc chiều mát, tưới dạng phun sương quanh rễ.</p>
              <p style={{ marginTop: "6px" }}><strong>Ánh sáng:</strong> Thích hợp ánh sáng tán xạ 60%-70%, tránh nắng gắt trực tiếp.</p>
              <p style={{ marginTop: "6px" }}><strong>Nhiệt độ & Độ ẩm:</strong> Nhiệt độ lý tưởng 22C - 30C, độ ẩm không khí 65% - 75%.</p>
              <p style={{ marginTop: "6px" }}><strong>Bón phân:</strong> Định kỳ bón phân hữu cơ vi lượng hoặc NPK loãng 1 lần/tuần.</p>
            </div>
          )}

          {activeTab === "video" && product.clip && (
            <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: "var(--radius-xs)", overflow: "hidden", margin: "10px 0" }}>
              <iframe
                src={product.clip}
                title={`Video ${product.name}`}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                allowFullScreen
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="detail-actions">
            <Link to="/contact" className="btn-primary">
              Liên Hệ Đặt Mua
            </Link>
            <button type="button" onClick={() => navigate(-1)} className="btn-outline">
              Quay Lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}