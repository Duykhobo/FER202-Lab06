import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchOrchids,
  addOrchid,
  editOrchid,
  removeOrchid
} from "../redux/orchidsSlice";
import { getOrchidImage, handleImageError } from "../utils/imageHelper";
import { useToast } from "../components/ToastContext";

// Yup Validation Schema cho Orchid Form (Lab 6 Requirement)
// optionalUrl: trường URL tuỳ chọn - cho phép để trống, chỉ kiểm tra khi có giá trị
const optionalUrl = (message) =>
  Yup.string()
    .nullable()
    .transform((value) => (typeof value === "string" && value.trim() === "" ? null : value))
    .url(message);

const orchidValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Tên hoa lan phải có ít nhất 3 ký tự")
    .required("Vui lòng nhập tên loài hoa lan"),
  price: Yup.number()
    .typeError("Giá tiền phải là một con số hợp lệ")
    .positive("Giá tiền phải lớn hơn 0")
    .required("Vui lòng nhập giá bán"),
  category: Yup.string().required("Vui lòng chọn chủng loại"),
  origin: Yup.string().required("Vui lòng nhập xuất xứ"),
  color: Yup.string().required("Vui lòng nhập màu sắc hoa"),
  rating: Yup.number()
    .min(1, "Đánh giá tối thiểu 1 sao")
    .max(5, "Đánh giá tối đa 5 sao")
    .required("Vui lòng nhập số sao đánh giá"),
  numberOfLike: Yup.number().min(0, "Lượt thích không thể âm").nullable(),
  image: optionalUrl("Đường dẫn ảnh phải là URL hợp lệ"),
  clip: optionalUrl("Đường dẫn video clip phải là URL hợp lệ"),
  description: Yup.string().max(500, "Mô tả không quá 500 ký tự").nullable(),
  isNatural: Yup.boolean(),
  isSpecial: Yup.boolean(),
});

// Chuẩn hoá giá trị form trước khi POST/PUT lên MockAPI
function prepareOrchidPayload(values) {
  return {
    ...values,
    price: Number(values.price) || 0,
    rating: Number(values.rating) || 5,
    numberOfLike: Number(values.numberOfLike) || 0,
    image: (values.image || "").trim(),
    clip: (values.clip || "").trim(),
    description: (values.description || "").trim(),
  };
}

export default function Admin() {
  const dispatch = useDispatch();
  const { items: orchids, loading, error } = useSelector((state) => state.orchids);

  const [editingId, setEditingId] = useState(null);
  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const itemsPerPage = 8;
  const toast = useToast();

  useEffect(() => {
    if (!orchids || orchids.length === 0) {
      dispatch(fetchOrchids());
    }
  }, [dispatch, orchids]);

  // Formik Hook (Lab 6 Requirement)
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      category: "Cattleya",
      origin: "Vietnam",
      color: "pink",
      rating: 5,
      numberOfLike: 100,
      image: "",
      clip: "https://www.youtube.com/embed/41N69X1zZfg",
      description: "",
      isNatural: true,
      isSpecial: false,
    },
    validationSchema: orchidValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = prepareOrchidPayload(values);
      try {
        if (editingId) {
          await dispatch(editOrchid({ id: editingId, orchidData: payload })).unwrap();
          toast.success("Cập nhật bản ghi hoa lan thành công!");
          setEditingId(null);
        } else {
          await dispatch(addOrchid(payload)).unwrap();
          toast.success("Thêm hoa lan mới vào hệ thống thành công!");
        }
        resetForm();
      } catch (err) {
        toast.error("Lỗi thao tác: " + err);
      }
    },
  });

  const handleEdit = (orchid) => {
    setEditingId(orchid.id);
    formik.setValues({
      name: orchid.name || "",
      price: orchid.price || "",
      category: orchid.category || "Cattleya",
      origin: orchid.origin || "Vietnam",
      color: orchid.color || "pink",
      rating: orchid.rating !== undefined ? orchid.rating : 5,
      numberOfLike: orchid.numberOfLike !== undefined ? orchid.numberOfLike : 100,
      image: orchid.image || "",
      clip: orchid.clip || "https://www.youtube.com/embed/41N69X1zZfg",
      description: orchid.description || "",
      isNatural: Boolean(orchid.isNatural),
      isSpecial: Boolean(orchid.isSpecial),
    });
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    formik.resetForm();
  };

  const handleDelete = async (orchid) => {
    // Bước 1: bấm nút Xóa lần đầu -> hiện xác nhận inline; bước 2: xác nhận -> gọi API
    if (!confirmDelete || String(confirmDelete.id) !== String(orchid.id)) {
      setConfirmDelete(orchid);
      return;
    }

    setConfirmDelete(null);
    try {
      await dispatch(removeOrchid(orchid.id)).unwrap();
      toast.success(`Đã xóa hoa lan "${orchid.name || orchid.id}" thành công!`);
    } catch (err) {
      toast.error("Xoa that bai: " + err);
    }
  };

  const filteredOrchids = useMemo(() => {
    return orchids.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(tableSearch.toLowerCase()) ||
        (item.category || "").toLowerCase().includes(tableSearch.toLowerCase()) ||
        (item.origin || "").toLowerCase().includes(tableSearch.toLowerCase()) ||
        String(item.id).includes(tableSearch)
    );
  }, [orchids, tableSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tableSearch]);

  const totalPages = Math.ceil(filteredOrchids.length / itemsPerPage) || 1;
  const paginatedOrchids = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrchids.slice(start, start + itemsPerPage);
  }, [filteredOrchids, currentPage, itemsPerPage]);

  const stats = useMemo(() => {
    if (!orchids.length) return { total: 0, naturalCount: 0, specialCount: 0, avgPrice: 0 };
    const prices = orchids.map((o) => Number(o.price) || 0);
    const sum = prices.reduce((acc, p) => acc + p, 0);
    return {
      total: orchids.length,
      naturalCount: orchids.filter((o) => o.isNatural).length,
      specialCount: orchids.filter((o) => o.isSpecial).length,
      avgPrice: (sum / orchids.length).toFixed(1),
    };
  }, [orchids]);

  return (
    <div className="admin-container">
      {/* Admin Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">Quản Trị Hệ Thống Hoa Lan</h1>
          <p className="admin-header-subtitle">
            Quản lý dữ liệu RESTful MockAPI, Redux Toolkit & kiểm thử dữ liệu bằng Formik + Yup (Lab 6)
          </p>
        </div>
      </div>

      {/* Stats Summary Row */}
      <div className="admin-stats-row">
        <div className="stat-card">
          <div className="stat-label">Tổng Số Giống Lan</div>
          <div className="stat-value">{stats.total}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Lan Rừng Tự Nhiên</div>
          <div className="stat-value">{stats.naturalCount}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Giống Lan Đặc Biệt</div>
          <div className="stat-value">{stats.specialCount}</div>
        </div>
      </div>

      {/* Fetch Error Banner (MockAPI failure) */}
      {error && (
        <div style={{ padding: "12px 16px", background: "var(--danger-light)", color: "var(--danger)", borderRadius: "var(--radius-sm)", marginBottom: "24px", fontSize: "0.875rem", fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span>Lỗi tải dữ liệu từ MockAPI: {error}</span>
          <button type="button" className="btn-outline" onClick={() => dispatch(fetchOrchids())} style={{ padding: "6px 14px", fontSize: "0.8rem" }}>
            Thử Lại
          </button>
        </div>
      )}

      {/* Add / Edit Form Card with Formik & Yup */}
      <div className="admin-form-card">
        <h2 className="admin-form-title">
          <span>{editingId ? "Chỉnh Sửa Thông Tin Hoa Lan" : "Thêm Hoa Lan Mới Vào Hệ Thống"}</span>
          {editingId && (
            <span style={{ fontSize: "0.825rem", color: "var(--text-muted)", fontWeight: 400 }}>
              (Mã: #{editingId})
            </span>
          )}
        </h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="admin-form-grid">
            <div className="form-group span-2">
              <label className="form-label" htmlFor="name">Tên hoa lan *</label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input ${formik.touched.name && formik.errors.name ? "error" : ""}`}
                placeholder="Lan Hồ Điệp Hoàng Gia"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="form-error-msg">{formik.errors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="price">Giá bán ($) *</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                className={`form-input ${formik.touched.price && formik.errors.price ? "error" : ""}`}
                placeholder="55.00"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.price && formik.errors.price && (
                <div className="form-error-msg">{formik.errors.price}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Chủng loại *</label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="Cattleya">Cattleya</option>
                <option value="Phalaenopsis">Hồ Điệp (Phalaenopsis)</option>
                <option value="Dendrobium">Hoàng Thảo (Dendrobium)</option>
                <option value="Vanda">Vanda</option>
                <option value="Cymbidium">Địa Lan (Cymbidium)</option>
                <option value="Paphiopedilum">Lan Hài (Paphiopedilum)</option>
                <option value="Oncidium">Vũ Nữ (Oncidium)</option>
                <option value="Aerides">Giang Hương (Aerides)</option>
                <option value="Rhynchostylis">Ngọc Điểm (Rhynchostylis)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="origin">Xuất xứ *</label>
              <input
                id="origin"
                name="origin"
                type="text"
                className={`form-input ${formik.touched.origin && formik.errors.origin ? "error" : ""}`}
                placeholder="Vietnam, Taiwan, Thailand..."
                value={formik.values.origin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.origin && formik.errors.origin && (
                <div className="form-error-msg">{formik.errors.origin}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="color">Màu hoa *</label>
              <input
                id="color"
                name="color"
                type="text"
                className={`form-input ${formik.touched.color && formik.errors.color ? "error" : ""}`}
                placeholder="purple, white, pink..."
                value={formik.values.color}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.color && formik.errors.color && (
                <div className="form-error-msg">{formik.errors.color}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rating">Đánh giá sao (1 - 5) *</label>
              <input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="1"
                max="5"
                className="form-input"
                value={formik.values.rating}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="numberOfLike">Lượt thích</label>
              <input
                id="numberOfLike"
                name="numberOfLike"
                type="number"
                className="form-input"
                value={formik.values.numberOfLike}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="form-group span-2">
              <label className="form-label" htmlFor="image">Đường dẫn hình ảnh (URL)</label>
              <input
                id="image"
                name="image"
                type="text"
                className={`form-input ${formik.touched.image && formik.errors.image ? "error" : ""}`}
                placeholder="https://images.unsplash.com/..."
                value={formik.values.image}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.image && formik.errors.image && (
                <div className="form-error-msg">{formik.errors.image}</div>
              )}
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="clip">Đường dẫn Video Clip (YouTube Embed URL)</label>
              <input
                id="clip"
                name="clip"
                type="text"
                className={`form-input ${formik.touched.clip && formik.errors.clip ? "error" : ""}`}
                placeholder="https://www.youtube.com/embed/..."
                value={formik.values.clip}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="description">Mô tả đặc điểm</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                className="form-textarea"
                placeholder="Nhập thông tin về hoa, lá và tập tính sinh trưởng..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className="form-checkbox-row">
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="isNatural"
                checked={formik.values.isNatural}
                onChange={formik.handleChange}
              />
              <span>Giống lan rừng tự nhiên (isNatural)</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                name="isSpecial"
                checked={formik.values.isSpecial}
                onChange={formik.handleChange}
              />
              <span>Hoa lan đặc biệt (isSpecial)</span>
            </label>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "16px" }}>
            <button type="submit" className="btn-primary" disabled={formik.isSubmitting}>
              {editingId ? "Lưu Cập Nhật" : "Thêm Vào Danh Mục"}
            </button>

            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="btn-outline">
                Huy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Orchids Data Table */}
      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Danh Mục Cơ Sở Dữ Liệu</h3>
            <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
              Hiển thị {filteredOrchids.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredOrchids.length)} / {filteredOrchids.length} cây
            </span>
          </div>

          <input
            type="text"
            className="table-search-input"
            placeholder="Tìm kiếm theo tên, chủng loại, mã..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Mã</th>
                <th style={{ width: "70px" }}>Ảnh</th>
                <th>Tên Hoa Lan</th>
                <th>Dòng</th>
                <th>Giá Bán</th>
                <th>Xuất Xứ</th>
                <th>Đặc Tính</th>
                <th style={{ width: "140px", textAlign: "right" }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && orchids.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)" }}>
                    Đang tải dữ liệu từ MockAPI...
                  </td>
                </tr>
              ) : paginatedOrchids.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)" }}>
                    Không có bản ghi nào phù hợp với từ khóa "{tableSearch}"
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
                      <span style={{ padding: "2px 6px", background: "var(--bg-body)", borderRadius: "var(--radius-xs)", fontSize: "0.8rem" }}>
                        {orchid.category}
                      </span>
                    </td>
                    <td>
                      <span className="badge-price">${Number(orchid.price || 0).toFixed(2)}</span>
                    </td>
                    <td>{orchid.origin}</td>
                    <td>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {orchid.isNatural && <span className="badge-natural">Tự nhiên</span>}
                        {orchid.isSpecial && <span className="badge-special">Đặc biệt</span>}
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="action-buttons">
                        <button
                          type="button"
                          onClick={() => handleEdit(orchid)}
                          className="btn-icon btn-edit"
                          title="Chỉnh sửa thông tin"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(orchid)}
                          className={`btn-icon ${confirmDelete && String(confirmDelete.id) === String(orchid.id) ? "btn-delete confirm" : "btn-delete"}`}
                          title={confirmDelete && String(confirmDelete.id) === String(orchid.id) ? "Bấm đây để XÁC NHẬN xóa" : "Xóa khỏi hệ thống"}
                        >
                          {confirmDelete && String(confirmDelete.id) === String(orchid.id) ? "Xác nhận?" : "Xóa"}
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
          <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
              Trang {currentPage} / {totalPages}
            </span>

            <div className="pagination-container" style={{ margin: 0 }}>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={`ap-${p}`}
                  className={`pagination-btn ${currentPage === p ? "active" : ""}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}