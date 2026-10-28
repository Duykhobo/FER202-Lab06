import OrchidCard from "./OrchidCard";

export default function OrchidsPresentation({
  orchids,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onChangeSort,
  searchTerm,
  onChangeSearch,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onChangeItemsPerPage,
  onOpenModal,
}) {
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

  return (
    <div>
      {/* Category Tabs (Lab 4 - Tab component) */}
      <div className="tabs-container">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`tab-btn ${selectedCategory === cat.id ? "active" : ""}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid Controls Toolbar */}
      <div className="section-header" style={{ flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 className="section-title">Danh Sách Tiêu Bản Hoa Lan</h2>
          <span className="section-count">
            Hiển thị {orchids.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
            {Math.min(currentPage * itemsPerPage, orchids.length)} trong tổng số {orchids.length} giống lan
          </span>
        </div>

        <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Search Box (Filtering by name, origin, color) */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onChangeSearch(e.target.value)}
              className="form-input"
              placeholder="Tìm theo tên, xuất xứ, màu..."
              style={{ padding: "6px 12px", fontSize: "0.85rem", width: "220px" }}
              aria-label="Tìm kiếm hoa lan"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onChangeSearch("")}
                className="btn-outline"
                style={{ padding: "6px 10px", fontSize: "0.8rem" }}
              >
                Xóa
              </button>
            )}
          </div>

          {/* Items Per Page */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label htmlFor="perPageSelect" style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Hiển thị:
            </label>
            <select
              id="perPageSelect"
              value={itemsPerPage}
              onChange={(e) => onChangeItemsPerPage(Number(e.target.value))}
              className="form-select"
              style={{ padding: "6px 12px", fontSize: "0.85rem" }}
            >
              <option value={8}>8 cây</option>
              <option value={12}>12 cây (Chuẩn trang)</option>
              <option value={16}>16 cây (Đầy đủ danh mục)</option>
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
              value={selectedSort}
              onChange={(e) => onChangeSort(e.target.value)}
              className="form-select"
              style={{ padding: "6px 12px", fontSize: "0.85rem" }}
            >
              <option value="default">Mặc định</option>
              <option value="rating-desc">Đánh giá cao nhất</option>
              <option value="likes-desc">Yêu thích nhiều nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="name-asc">Tên: A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* 16 Orchids Cards Grid via map() (Lab 1 Requirement) */}
      {orchids.length === 0 ? (
        <div className="state-container" style={{ background: "var(--bg-card)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
          <h3>Không tìm thấy giống lan phù hợp</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
            Vui lòng chọn danh mục khác hoặc thử từ khóa tìm kiếm mới.
          </p>
        </div>
      ) : (
        <>
          <div className="orchids-grid">
            {orchids.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((orchid) => (
              <OrchidCard
                key={orchid.id}
                orchid={orchid}
                onOpenModal={onOpenModal}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  title="Trang đầu"
                >
                  Đầu
                </button>
                <button
                  className="pagination-btn"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  title="Trang trước"
                >
                  Trước
                </button>

                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span key={`el-${idx}`} style={{ padding: "0 6px", color: "var(--text-muted)", fontWeight: 700 }}>
                      ...
                    </span>
                  ) : (
                    <button
                      key={`p-${page}`}
                      className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="pagination-btn"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  title="Trang sau"
                >
                  Sau
                </button>
                <button
                  className="pagination-btn"
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  title="Trang cuối"
                >
                  Cuối
                </button>
              </div>

              <span className="pagination-info">
                Trang {currentPage} / {totalPages}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
