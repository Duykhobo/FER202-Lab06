import { Link } from "react-router-dom";
import { getOrchidImage, handleImageError } from "../utils/imageHelper";

export default function OrchidModal({ isOpen, orchid, onClose }) {
  if (!isOpen || !orchid) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">{orchid.name}</h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Mã định danh: #{orchid.id} • Dòng {orchid.category}
            </span>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Đóng">
            X
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Video Clip of Orchid (Lab 4 requirement) */}
          {orchid.clip ? (
            <div className="modal-video-container">
              <iframe
                src={orchid.clip}
                title={`Video clip ${orchid.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}

          {/* Orchid Details */}
          <div className="modal-orchid-content">
            <div>
              <img
                src={getOrchidImage(orchid.image, orchid.id)}
                alt={orchid.name}
                className="modal-image"
                onError={(e) => handleImageError(e, orchid.id)}
              />
            </div>

            <div className="modal-details">
              <div className="badge-row">
                {orchid.isSpecial && <span className="badge-special">Đặc biệt</span>}
                {orchid.isNatural && <span className="badge-natural">Rừng tự nhiên</span>}
                <span style={{ padding: "3px 8px", background: "var(--bg-alt)", borderRadius: "var(--radius-xs)", fontSize: "0.78rem", fontWeight: 600 }}>
                  Xuất xứ: {orchid.origin}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", margin: "6px 0" }}>
                <span style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--primary)", fontFamily: "var(--font-serif)" }}>
                  ${Number(orchid.price || 0).toFixed(2)}
                </span>
                <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
                  (Giá bán lẻ đã gồm chậu)
                </span>
              </div>

              <p className="modal-desc">
                {orchid.description || "Giống hoa lan quý hiếm với vẻ đẹp rực rỡ, thích nghi tốt với điều kiện khí hậu và giữ hoa lâu tàn."}
              </p>

              {/* Technical Specifications Grid */}
              <div className="modal-specs-grid">
                <div className="spec-item">
                  <strong>Đánh giá:</strong> {orchid.rating || 5} / 5
                </div>
                <div className="spec-item">
                  <strong>Yêu thích:</strong> {orchid.numberOfLike || 120} lượt
                </div>
                <div className="spec-item">
                  <strong>Sắc hoa:</strong> {orchid.color || "Tự nhiên"}
                </div>
                <div className="spec-item">
                  <strong>Chủng loại:</strong> {orchid.category || "Orchidaceae"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn-outline">
            Đóng
          </button>
          <Link
            to={`/detail/${orchid.id}`}
            onClick={onClose}
            className="btn-primary"
          >
            Trang chi tiết đầy đủ
          </Link>
        </div>
      </div>
    </div>
  );
}
