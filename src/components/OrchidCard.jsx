import { Link } from "react-router-dom";
import { getOrchidImage, handleImageError } from "../utils/imageHelper";

export default function OrchidCard({ orchid, onOpenModal }) {
  const priceNumber = Number(orchid.price) || 0;

  return (
    <div className="orchid-card">
      {/* Image Container with click to trigger Modal (Lab 2 requirement) */}
      <div
        className="orchid-image-container"
        onClick={() => onOpenModal && onOpenModal(orchid)}
        title="Nhấp để xem chi tiết và video clip"
      >
        <img
          src={getOrchidImage(orchid.image, orchid.id)}
          alt={orchid.name}
          className="orchid-image"
          onError={(e) => handleImageError(e, orchid.id)}
          loading="lazy"
        />

        {/* Badges on Top-Left */}
        <div className="orchid-badges-left">
          {orchid.isSpecial && <span className="badge-special">Đặc biệt</span>}
          {orchid.isNatural && <span className="badge-natural">Tự nhiên</span>}
        </div>

        {/* Price Badge on Bottom-Right */}
        <span className="orchid-price-badge">${priceNumber.toFixed(2)}</span>
      </div>

      {/* Orchid Info */}
      <div className="orchid-info">
        <div className="orchid-category-origin">
          <span>{orchid.category || "Cattleya"}</span>
          <span>{orchid.origin || "Vietnam"}</span>
        </div>

        <h3 className="orchid-title" title={orchid.name}>
          {orchid.name}
        </h3>

        <p className="orchid-desc" title={orchid.description}>
          {orchid.description || "Giống hoa lan quý hiếm với vẻ đẹp thanh khiết và hương thơm ngát."}
        </p>

        {/* Meta Stats: Rating, Likes & Color */}
        <div className="orchid-meta-row">
          <div className="meta-rating">
            <span>Đánh giá: {orchid.rating || 5}/5</span>
          </div>

          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Màu: <span style={{ textTransform: "capitalize" }}>{orchid.color || "Tự nhiên"}</span>
          </div>

          <div className="meta-likes">
            <span>{orchid.numberOfLike || 120} thích</span>
          </div>
        </div>

        <div className="orchid-footer">
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Mã: #{orchid.id}
          </span>
          <Link to={`/detail/${orchid.id}`} className="orchid-view-link">
            Xem hồ sơ thực vật
          </Link>
        </div>
      </div>
    </div>
  );
}
