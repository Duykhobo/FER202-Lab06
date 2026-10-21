import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getOrchids } from "../services/orchidService";
import { getOrchidImage, handleImageError } from "../utils/imageHelper";

export default function Home() {
  const [orchids, setOrchids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Pagination State - 12 chia hết cho cả 4 cột, 3 cột và 2 cột giúp các hàng luôn đều đặn tuyệt đối!
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrchids = async () => {
      try {
        const data = await getOrchids();
        setOrchids(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrchids();
  }, []);

  // Filter & Sort
  const filteredOrchids = useMemo(() => {
    let result = orchids.filter((item) =>
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }
    return result;
  }, [orchids, searchTerm, sortBy]);

  // Reset to page 1 when search, sort, or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, itemsPerPage]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrchids.length / itemsPerPage) || 1;
  const paginatedOrchids = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrchids.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrchids, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 380, behavior: "smooth" });
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="state-container">
        <div className="spinner"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Đang tải bộ sưu tập hoa lan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container">
        <div style={{ fontSize: "3rem", marginBottom: "12px" }}>⚠️</div>
        <h3 style={{ color: "var(--danger)", marginBottom: "8px" }}>Không thể tải dữ liệu</h3>
        <p style={{ color: "var(--text-muted)" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-pill">
          <span>✨</span> Bộ Sưu Tập Hoa Lan Tinh Hoa 2026
        </div>
        <h1 className="hero-title">Khám Phá Vẻ Đẹp Quý Phái Của Hoa Lan</h1>
        <p className="hero-subtitle">
          Khám phá danh mục các giống hoa lan tuyển chọn, từ những nhánh Hồ Điệp thanh tao đến các dòng Cattleya kiêu kỳ.
        </p>

        <div className="hero-search-bar">
          <span className="hero-search-icon">🔍</span>
          <input
            type="text"
            className="hero-search-input"
            placeholder="Tìm kiếm theo tên hoa lan hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Grid Controls Toolbar */}
      <div className="section-header" style={{ flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 className="section-title">Danh Sách Hoa Lan</h2>
          <span className="section-count">
            Hiển thị {filteredOrchids.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredOrchids.length)} trong tổng số {filteredOrchids.length} cây
          </span>
        </div>

        <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Items Per Page Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label htmlFor="perPageSelect" style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Hiển thị:
            </label>
            <select
              id="perPageSelect"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-light)",
                background: "#ffffff",
                fontSize: "0.85rem",
                fontWeight: 600,
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value={8}>8 cây (2 hàng)</option>
              <option value={12}>12 cây (3 hàng - Chuẩn đẹp)</option>
              <option value={16}>16 cây (4 hàng)</option>
              <option value={24}>24 cây</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label htmlFor="sortSelect" style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Sắp xếp:
            </label>
            <select
              id="sortSelect"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-light)",
                background: "#ffffff",
                fontSize: "0.85rem",
                fontWeight: 500,
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orchids Cards Grid */}
      {filteredOrchids.length === 0 ? (
        <div className="state-container" style={{ background: "#ffffff", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🌿</div>
          <h3>Không tìm thấy hoa lan phù hợp</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
            Vui lòng thử tìm với từ khóa khác hoặc xóa bộ lọc tìm kiếm.
          </p>
        </div>
      ) : (
        <>
          <div className="orchids-grid">
            {paginatedOrchids.map((orchid) => (
              <Link to={`/detail/${orchid.id}`} key={orchid.id} className="orchid-card">
                <div className="orchid-image-container">
                  <img
                    src={getOrchidImage(orchid.image, orchid.id)}
                    alt={orchid.name}
                    className="orchid-image"
                    onError={(e) => handleImageError(e, orchid.id)}
                    loading="lazy"
                  />
                  <span className="orchid-price-badge">${Number(orchid.price).toFixed(2)}</span>
                </div>

                <div className="orchid-info">
                  <h3 className="orchid-title">{orchid.name}</h3>
                  <p className="orchid-desc">{orchid.description || "Chưa có mô tả chi tiết cho giống lan này."}</p>
                  <div className="orchid-footer">
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
                      Mã: #{orchid.id}
                    </span>
                    <span className="orchid-view-link">
                      Xem chi tiết <span>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Balanced Pagination Component */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  title="Về trang đầu"
                >
                  « Đầu
                </button>

                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Trang trước"
                >
                  ‹ Trước
                </button>

                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span key={`ellipsis-${index}`} style={{ padding: "0 6px", color: "var(--text-muted)", fontWeight: 700 }}>
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${page}`}
                      className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Trang sau"
                >
                  Sau ›
                </button>

                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  title="Đến trang cuối"
                >
                  Cuối »
                </button>
              </div>

              <span className="pagination-info">
                Trang {currentPage} / {totalPages} • Hiển thị {paginatedOrchids.length} cây trên trang này
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
