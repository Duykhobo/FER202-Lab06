import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrchidById } from "../services/orchidService";
import { getOrchidImage, handleImageError } from "../utils/imageHelper";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
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
  }, [id]);

  if (loading) {
    return (
      <div className="state-container">
        <div className="spinner"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Đang tải thông tin hoa lan...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="state-container">
        <div style={{ fontSize: "3rem", marginBottom: "12px" }}>⚠️</div>
        <h3 style={{ color: "var(--danger)", marginBottom: "8px" }}>Không tìm thấy sản phẩm</h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>{error || "Mã hoa lan không tồn tại."}</p>
        <Link to="/" className="btn-primary">Quay lại Trang Chủ</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb-nav">
        <Link to="/">Trang Chủ</Link>
        <span>/</span>
        <span style={{ color: "var(--text-main)", fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* Main Showcase Card */}
      <div className="detail-card">
        <div className="detail-image-wrapper">
          <img
            src={getOrchidImage(product.image, product.id)}
            alt={product.name}
            className="detail-image"
            onError={(e) => handleImageError(e, product.id)}
          />
        </div>

        <div className="detail-content">
          <div className="detail-category-badge">
            <span>🌸</span> Giống Hoa Tuyển Chọn • Mã #{product.id}
          </div>

          <h1 className="detail-title">{product.name}</h1>

          <div className="detail-price-box">
            <span className="detail-price">${Number(product.price).toFixed(2)}</span>
            <span className="detail-price-label">(Giá đã bao gồm chậu & giá thể chăm sóc)</span>
          </div>

          <p className="detail-description">
            {product.description || "Loài hoa lan này sở hữu vẻ đẹp kiêu sa, cánh hoa dày dặn và hương thơm tự nhiên. Cây được thuần hóa tốt, rễ khỏe mạnh, phù hợp để trang trí bàn làm việc, phòng khách hoặc làm quà tặng ý nghĩa."}
          </p>

          <div className="detail-features">
            <div className="feature-item">
              <span>💧</span> <span>Độ ẩm: 60% - 75%</span>
            </div>
            <div className="feature-item">
              <span>☀️</span> <span>Ánh sáng: Tán xạ 60%</span>
            </div>
            <div className="feature-item">
              <span>🌿</span> <span>Độ bền hoa: 6 - 8 tuần</span>
            </div>
            <div className="feature-item">
              <span>🚚</span> <span>Giao hàng: Toàn quốc</span>
            </div>
          </div>

          <div className="detail-actions">
            <Link to="/contact" className="btn-primary">
              💬 Liên Hệ Đặt Mua
            </Link>
            <button onClick={() => navigate(-1)} className="btn-outline">
              ← Quay Lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}