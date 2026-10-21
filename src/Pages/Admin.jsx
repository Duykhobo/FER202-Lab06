import { useState, useEffect, useMemo } from "react";
import { getOrchids, createOrchid, updateOrchid, deleteOrchid } from "../services/orchidService";
import { getOrchidImage, handleImageError } from "../utils/imageHelper";

export default function Admin() {
  const [orchids, setOrchids] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableSearch, setTableSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pagination for Admin Table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formState, setFormState] = useState({
    name: "",
    image: "",
    price: "",
    description: ""
  });

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

  // Filtered orchids for table
  const filteredOrchids = useMemo(() => {
    return orchids.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(tableSearch.toLowerCase()) ||
        String(item.id).includes(tableSearch)
    );
  }, [orchids, tableSearch]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tableSearch]);

  // Table pagination calculation
  const totalPages = Math.ceil(filteredOrchids.length / itemsPerPage) || 1;
  const paginatedOrchids = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrchids.slice(start, start + itemsPerPage);
  }, [filteredOrchids, currentPage, itemsPerPage]);

  // Stats
  const stats = useMemo(() => {
    if (!orchids.length) return { total: 0, avgPrice: 0, maxPrice: 0 };
    const prices = orchids.map((o) => Number(o.price) || 0);
    const sum = prices.reduce((acc, p) => acc + p, 0);
    return {
      total: orchids.length,
      avgPrice: (sum / orchids.length).toFixed(1),
      maxPrice: Math.max(...prices).toFixed(1)
    };
  }, [orchids]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formState.name || !formState.price) {
      alert("Vui lòng điền đầy đủ Tên hoa lan và Giá tiền!");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const updated = await updateOrchid(editingId, formState);
        setOrchids((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...updated } : item)));
        setEditingId(null);
        alert("🎉 Đã cập nhật thông tin hoa lan thành công!");
      } else {
        const created = await createOrchid(formState);
        setOrchids((prev) => [created, ...prev]);
        alert("✨ Đã thêm hoa lan mới vào hệ thống thành công!");
      }

      setFormState({ name: "", image: "", price: "", description: "" });
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (orchid) => {
    setEditingId(orchid.id);
    setFormState({
      name: orchid.name || "",
      image: orchid.image || "",
      price: orchid.price || "",
      description: orchid.description || ""
    });
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormState({ name: "", image: "", price: "", description: "" });
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa hoa lan "${name || id}" khỏi hệ thống?`)) {
      try {
        await deleteOrchid(id);
        setOrchids((prev) => prev.filter((item) => String(item.id) !== String(id)));
        alert("Đã xóa hoa lan thành công!");
      } catch (err) {
        alert("Xóa thất bại: " + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="state-container">
        <div className="spinner"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Đang tải bảng quản trị...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container">
        <h3 style={{ color: "var(--danger)" }}>Lỗi tải trang quản trị</h3>
        <p style={{ color: "var(--text-muted)" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Admin Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Quản Trị Hệ Thống Hoa Lan</h1>
          <p className="admin-header-subtitle">
            Thêm mới, cập nhật, xóa và quản lý dữ liệu hoa lan trên MockAPI & Hệ thống lưu trữ.
          </p>
        </div>
      </div>

      {/* Stats Summary Row */}
      <div className="admin-stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrapper">🌸</div>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Tổng Số Giống Lan</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: "var(--secondary-light)", color: "var(--secondary)" }}>
            💵
          </div>
          <div>
            <div className="stat-value">${stats.avgPrice}</div>
            <div className="stat-label">Giá Trung Bình</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
            💎
          </div>
          <div>
            <div className="stat-value">${stats.maxPrice}</div>
            <div className="stat-label">Giá Cao Nhất</div>
          </div>
        </div>
      </div>

      {/* Add / Edit Form Card */}
      <div className="admin-form-card">
        <h2 className="admin-form-title">
          <span>{editingId ? "✏️ Chỉnh Sửa Hoa Lan" : "➕ Thêm Hoa Lan Mới"}</span>
          {editingId && (
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 400 }}>
              (Đang chỉnh sửa mã: #{editingId})
            </span>
          )}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="orchidName">Tên Hoa Lan *</label>
              <input
                id="orchidName"
                type="text"
                className="form-input"
                placeholder="VD: Lan Hồ Điệp Hoàng Gia..."
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="orchidPrice">Giá Bán ($) *</label>
              <input
                id="orchidPrice"
                type="number"
                step="0.01"
                className="form-input"
                placeholder="VD: 45.00"
                value={formState.price}
                onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="form-label" htmlFor="orchidImage">Đường dẫn Hình Ảnh (URL)</label>
              <input
                id="orchidImage"
                type="text"
                className="form-input"
                placeholder="https://images.unsplash.com/... (để trống sẽ dùng ảnh mặc định)"
                value={formState.image}
                onChange={(e) => setFormState({ ...formState, image: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="form-label" htmlFor="orchidDesc">Mô Tả Chi Tiết</label>
              <textarea
                id="orchidDesc"
                rows="3"
                className="form-textarea"
                placeholder="Nhập thông tin xuất xứ, cách chăm sóc hoặc đặc điểm hoa..."
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Đang xử lý..." : editingId ? "💾 Cập Nhật Thay Đổi" : "➕ Thêm Vào Danh Sách"}
            </button>

            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="btn-outline">
                Hủy Chỉnh Sửa
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Orchids Data Table Card */}
      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Danh Sách Trong Hệ Thống</h3>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Hiển thị {filteredOrchids.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredOrchids.length)} / {filteredOrchids.length} cây
            </span>
          </div>

          <input
            type="text"
            className="table-search-input"
            placeholder="🔍 Tìm theo tên hoặc mã..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "70px" }}>Mã</th>
                <th style={{ width: "80px" }}>Hình Ảnh</th>
                <th>Tên Hoa Lan</th>
                <th>Giá Bán</th>
                <th>Mô Tả Ngắn</th>
                <th style={{ width: "160px", textAlign: "right" }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrchids.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                    Không tìm thấy dữ liệu nào phù hợp với từ khóa "{tableSearch}"
                  </td>
                </tr>
              ) : (
                paginatedOrchids.map((orchid) => (
                  <tr key={orchid.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-muted)" }}>#{orchid.id}</td>
                    <td>
                      <img
                        src={getOrchidImage(orchid.image, orchid.id)}
                        alt={orchid.name}
                        className="admin-orchid-thumb"
                        onError={(e) => handleImageError(e, orchid.id)}
                      />
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--text-main)" }}>{orchid.name}</td>
                    <td>
                      <span className="badge-price">${Number(orchid.price).toFixed(2)}</span>
                    </td>
                    <td style={{ maxWidth: "280px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {orchid.description || "Chưa có mô tả"}
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="action-buttons" style={{ justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleEdit(orchid)}
                          className="btn-icon btn-edit"
                          title="Sửa thông tin"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(orchid.id, orchid.name)}
                          className="btn-icon btn-delete"
                          title="Xóa cây này"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              Trang {currentPage} trên tổng số {totalPages}
            </span>

            <div className="pagination-container" style={{ margin: 0 }}>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={`admin-page-${page}`}
                  className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Sau →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}