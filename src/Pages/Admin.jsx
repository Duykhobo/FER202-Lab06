import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchOrchids,
  addOrchid,
  editOrchid,
  removeOrchid,
} from "../redux/orchidsSlice";
import { logout, validateAuthSession } from "../redux/authSlice";
import { getOrchidImage, handleImageError } from "../utils/imageHelper";
import { useToast } from "../components/ToastContext";

// Yup Validation Schema cho Orchid Form (Lab 6 Requirement)
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
  const navigate = useNavigate();
  const toast = useToast();

  const { items: orchids, loading, error } = useSelector((state) => state.orchids);
  const { isAuthenticated, isAdmin, user } = useSelector((state) => state.auth);

  // States quản lý CRUD & UI
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // States tìm kiếm, lọc & sắp xếp cho Table
  const [tableSearch, setTableSearch] = useState("");
  const [tableCategory, setTableCategory] = useState("all");
  const [tableTrait, setTableTrait] = useState("all");
  const [tableSort, setTableSort] = useState("id-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  /**
   * KIỂM TRA PHIÊN LÀM VIỆC (SESSION CHECK)
   * Hàm cốt lõi: Mỗi khi người dùng bấm Thêm, Sửa, Xóa đều phải kiểm tra phiên làm việc.
   * Nếu đã đăng xuất hoặc phiên hết hạn:
   * 1. Hủy bỏ ngay lập tức thao tác (không gửi request API)
   * 2. Thông báo lỗi bằng Toast
   * 3. Chuyển hướng về trang đăng nhập /login
   */
  const verifySession = useCallback(
    (actionName = "thao tác") => {
      const isSessionValid = validateAuthSession();
      if (!isSessionValid || !isAuthenticated || !isAdmin) {
        dispatch(logout());
        toast.error(
          `Phiên làm việc đã kết thúc hoặc bạn đã đăng xuất! Vui lòng đăng nhập lại để thực hiện ${actionName}.`
        );
        navigate("/login", {
          replace: true,
          state: { reason: "session_expired", from: "/admin" },
        });
        return false;
      }
      return true;
    },
    [isAuthenticated, isAdmin, dispatch, navigate, toast]
  );

  // Giám sát phiên làm việc trên tab hiện tại: nếu mất quyền thì tự động chuyển hướng
  useEffect(() => {
    if (!isAuthenticated || !isAdmin || !validateAuthSession()) {
      dispatch(logout());
      navigate("/login", {
        replace: true,
        state: { reason: "session_expired", from: "/admin" },
      });
    }
  }, [isAuthenticated, isAdmin, dispatch, navigate]);

  // Đồng bộ hóa đăng xuất qua nhiều Tab (Cross-tab session logout sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "isAdmin" || e.key === "orchid_user") {
        if (!validateAuthSession()) {
          dispatch(logout());
          toast.error("Bạn đã đăng xuất ở một phiên làm việc khác. Vui lòng đăng nhập lại!");
          navigate("/login", {
            replace: true,
            state: { reason: "session_expired", from: "/admin" },
          });
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch, navigate, toast]);

  // Fetch danh sách hoa lan nếu Store chưa có
  useEffect(() => {
    if (!orchids || orchids.length === 0) {
      dispatch(fetchOrchids());
    }
  }, [dispatch, orchids]);

  // Xử lý Formik Hook (Lab 6 Requirement)
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
      // 1. Kiểm tra phiên làm việc trước khi thực hiện THÊM hoặc SỬA
      const actionDesc = editingId ? "chỉnh sửa hoa lan" : "thêm hoa lan mới";
      if (!verifySession(actionDesc)) {
        return;
      }

      const payload = prepareOrchidPayload(values);
      try {
        if (editingId) {
          // Thao tác SỬA (PUT)
          await dispatch(editOrchid({ id: editingId, orchidData: payload })).unwrap();
          toast.success(`Cập nhật hoa lan "${payload.name}" thành công!`);
          setEditingId(null);
          setEditingName("");
        } else {
          // Thao tác THÊM (POST)
          await dispatch(addOrchid(payload)).unwrap();
          toast.success(`Thêm hoa lan "${payload.name}" vào hệ thống thành công!`);
        }
        resetForm();
      } catch (err) {
        // Nếu lỗi do phiên hết hạn trả về từ Redux thunk
        if (String(err).includes("Phiên làm việc đã kết thúc")) {
          dispatch(logout());
          navigate("/login", { state: { reason: "session_expired" } });
        }
        toast.error("Lỗi thao tác: " + err);
      }
    },
  });

  // 2. Thao tác bấm nút SỬA trên bảng: Kiểm tra session trước khi load dữ liệu lên form
  const handleEditClick = (orchid) => {
    if (!verifySession("chỉnh sửa hoa lan")) {
      return;
    }

    setEditingId(orchid.id);
    setEditingName(orchid.name || `#${orchid.id}`);
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

    toast.info(`Đang mở chế độ chỉnh sửa hoa lan "${orchid.name}".`);
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    formik.resetForm();
    toast.info("Đã hủy chế độ chỉnh sửa.");
  };

  // 3. Thao tác XÓA: Bấm nút Xóa trên bảng -> Kiểm tra session trước khi mở Modal xác nhận
  const handleDeleteClick = (orchid) => {
    if (!verifySession("xóa hoa lan")) {
      return;
    }
    setDeleteTarget(orchid);
  };

  // Xác nhận XÓA trong Modal: Kiểm tra session một lần nữa trước khi dispatch API DELETE
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (!verifySession("xóa hoa lan")) {
      setDeleteTarget(null);
      return;
    }

    setIsDeleting(true);
    try {
      await dispatch(removeOrchid(deleteTarget.id)).unwrap();
      toast.success(`Đã xóa vĩnh viễn hoa lan "${deleteTarget.name || deleteTarget.id}" thành công!`);
      setDeleteTarget(null);
    } catch (err) {
      if (String(err).includes("Phiên làm việc đã kết thúc")) {
        dispatch(logout());
        navigate("/login", { state: { reason: "session_expired" } });
      }
      toast.error("Lỗi khi xóa hoa lan: " + err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Bộ lọc nâng cao: Tìm kiếm, Chủng loại, Đặc tính & Sắp xếp
  const filteredOrchids = useMemo(() => {
    let result = [...orchids];

    // Lọc theo từ khóa tìm kiếm (Tên, xuất xứ, màu, mã)
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase().trim();
      result = result.filter(
        (item) =>
          (item.name || "").toLowerCase().includes(q) ||
          (item.category || "").toLowerCase().includes(q) ||
          (item.origin || "").toLowerCase().includes(q) ||
          (item.color || "").toLowerCase().includes(q) ||
          String(item.id).includes(q)
      );
    }

    // Lọc theo Chủng loại
    if (tableCategory !== "all") {
      result = result.filter(
        (item) => (item.category || "").toLowerCase() === tableCategory.toLowerCase()
      );
    }

    // Lọc theo Đặc tính (Tự nhiên / Đặc biệt)
    if (tableTrait === "natural") {
      result = result.filter((item) => item.isNatural);
    } else if (tableTrait === "special") {
      result = result.filter((item) => item.isSpecial);
    }

    // Sắp xếp
    if (tableSort === "id-desc") {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    } else if (tableSort === "id-asc") {
      result.sort((a, b) => Number(a.id) - Number(b.id));
    } else if (tableSort === "name-asc") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (tableSort === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (tableSort === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (tableSort === "rating-desc") {
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return result;
  }, [orchids, tableSearch, tableCategory, tableTrait, tableSort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tableSearch, tableCategory, tableTrait, tableSort]);

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
      {/* Admin Header with Live Session Indicator Widget */}
      <div className="admin-header">
        <div>
          <div className="admin-badge-top">FER202 • RESTful MockAPI Dashboard</div>
          <h1 className="admin-header-title">Quản Trị Hệ Thống Hoa Lan</h1>
          <p className="admin-header-subtitle">
            Hệ thống quản lý CRUD, Redux Toolkit, Formik/Yup & Bảo mật phiên làm việc (Lab 6)
          </p>
        </div>

        {/* Live Admin Session Status Card */}
        <div className="admin-session-card">
          <div className="session-user-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name || "Admin"} />
            ) : (
              <div className="avatar-fallback">A</div>
            )}
          </div>
          <div className="session-user-details">
            <div className="session-user-name">
              {user?.name || "Quản Trị Viên"}
              <span className="session-role-badge">ADMIN</span>
            </div>
            <div className="session-status-row">
              <span className="pulse-dot" />
              <span className="session-status-text">Phiên hoạt động hợp lệ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary Row */}
      <div className="admin-stats-row">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Tổng Số Giống Lan</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-icon-wrap">🌿</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Lan Rừng Tự Nhiên</div>
            <div className="stat-value">{stats.naturalCount}</div>
          </div>
          <div className="stat-icon-wrap">🌲</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Giống Lan Đặc Biệt</div>
            <div className="stat-value">{stats.specialCount}</div>
          </div>
          <div className="stat-icon-wrap">⭐</div>
        </div>
      </div>

      {/* Fetch Error Banner (MockAPI failure) */}
      {error && (
        <div className="admin-error-banner">
          <span>⚠️ Lỗi tải dữ liệu từ MockAPI: {error}</span>
          <button
            type="button"
            className="btn-outline"
            onClick={() => dispatch(fetchOrchids())}
          >
            Thử Lại
          </button>
        </div>
      )}

      {/* Add / Edit Form Card with Formik & Yup */}
      <div className={`admin-form-card ${editingId ? "is-editing" : ""}`}>
        {/* Editing Banner Notification */}
        {editingId && (
          <div className="editing-banner">
            <div className="editing-banner-content">
              <span className="editing-icon">✏️</span>
              <div>
                <strong>Chế độ chỉnh sửa đang kích hoạt:</strong>
                <p>
                  Đang chỉnh sửa hoa lan <strong>"{editingName}"</strong> (Mã hệ thống: #{editingId}).
                  Phiên làm việc được kiểm tra nghiêm ngặt khi lưu.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="btn-cancel-edit-banner"
              title="Hủy bỏ chế độ sửa và quay lại thêm mới"
            >
              ✕ Hủy chế độ sửa
            </button>
          </div>
        )}

        <div className="admin-form-title-row">
          <h2 className="admin-form-title">
            <span>{editingId ? "Chỉnh Sửa Thông Tin Hoa Lan" : "Thêm Hoa Lan Mới Vào Hệ Thống"}</span>
            {editingId && (
              <span className="editing-id-tag">Mã bản ghi: #{editingId}</span>
            )}
          </h2>
          <span className="form-required-note">* Các trường đánh dấu sao là bắt buộc</span>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="admin-form-grid">
            <div className="form-group span-2">
              <label className="form-label" htmlFor="name">
                Tên hoa lan *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input ${formik.touched.name && formik.errors.name ? "error" : ""}`}
                placeholder="Ví dụ: Lan Hồ Điệp Hoàng Gia Phú Quý"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="form-error-msg">{formik.errors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="price">
                Giá bán ($ USD) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                className={`form-input ${formik.touched.price && formik.errors.price ? "error" : ""}`}
                placeholder="Ví dụ: 55.00"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.price && formik.errors.price && (
                <div className="form-error-msg">{formik.errors.price}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Chủng loại chi lan *
              </label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="Cattleya">Cattleya (Hoàng Hậu Các Loài Lan)</option>
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
              <label className="form-label" htmlFor="origin">
                Xuất xứ / Vùng phân bố *
              </label>
              <input
                id="origin"
                name="origin"
                type="text"
                className={`form-input ${formik.touched.origin && formik.errors.origin ? "error" : ""}`}
                placeholder="Ví dụ: Vietnam, Taiwan, Thailand..."
                value={formik.values.origin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.origin && formik.errors.origin && (
                <div className="form-error-msg">{formik.errors.origin}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="color">
                Màu sắc hoa chính *
              </label>
              <input
                id="color"
                name="color"
                type="text"
                className={`form-input ${formik.touched.color && formik.errors.color ? "error" : ""}`}
                placeholder="Ví dụ: tím, trắng, vàng, hồng..."
                value={formik.values.color}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.color && formik.errors.color && (
                <div className="form-error-msg">{formik.errors.color}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rating">
                Đánh giá chất lượng (1 - 5 sao) *
              </label>
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
              {formik.touched.rating && formik.errors.rating && (
                <div className="form-error-msg">{formik.errors.rating}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="numberOfLike">
                Lượt yêu thích ban đầu
              </label>
              <input
                id="numberOfLike"
                name="numberOfLike"
                type="number"
                min="0"
                className="form-input"
                value={formik.values.numberOfLike}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="form-group span-2">
              <label className="form-label" htmlFor="image">
                Đường dẫn hình ảnh (URL hình ảnh đại diện)
              </label>
              <input
                id="image"
                name="image"
                type="text"
                className={`form-input ${formik.touched.image && formik.errors.image ? "error" : ""}`}
                placeholder="https://images.unsplash.com/photo-..."
                value={formik.values.image}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.image && formik.errors.image && (
                <div className="form-error-msg">{formik.errors.image}</div>
              )}

              {/* Live Image Preview Feedback */}
              {formik.values.image && (
                <div className="form-image-preview">
                  <img
                    src={formik.values.image}
                    alt="Xem trước ảnh"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextSibling) e.target.nextSibling.style.display = "block";
                    }}
                    onLoad={(e) => {
                      e.target.style.display = "block";
                      if (e.target.nextSibling) e.target.nextSibling.style.display = "none";
                    }}
                  />
                  <div className="preview-error-note" style={{ display: "none" }}>
                    ⚠️ Không thể tải ảnh từ URL này (vui lòng kiểm tra lại đường link)
                  </div>
                  <span className="preview-label">Xem trước hình ảnh hoa lan</span>
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="clip">
                Đường dẫn Video Clip (YouTube Embed URL)
              </label>
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
              {formik.touched.clip && formik.errors.clip && (
                <div className="form-error-msg">{formik.errors.clip}</div>
              )}
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="description">
                Mô tả đặc điểm sinh học & hình thái
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                className="form-textarea"
                placeholder="Nhập thông tin chi tiết về cánh hoa, hương thơm, điều kiện sinh trưởng và mùa nở hoa..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="form-error-msg">{formik.errors.description}</div>
              )}
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
              <span>🌿 Giống lan rừng tự nhiên (isNatural)</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                name="isSpecial"
                checked={formik.values.isSpecial}
                onChange={formik.handleChange}
              />
              <span>⭐ Hoa lan đột biến / đặc biệt (isSpecial)</span>
            </label>
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={formik.isSubmitting}
            >
              {editingId ? "💾 Lưu Cập Nhật Bản Ghi" : "+ Thêm Hoa Lan Mới Vào Hệ Thống"}
            </button>

            {editingId ? (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-outline"
              >
                Hủy Chỉnh Sửa
              </button>
            ) : (
              <button
                type="button"
                onClick={() => formik.resetForm()}
                className="btn-outline"
              >
                Làm Mới Form
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Orchids Data Table Card */}
      <div className="admin-table-card">
        {/* Table Toolbar: Search, Filters & Sorters */}
        <div className="admin-table-toolbar">
          <div className="toolbar-info">
            <h3 className="toolbar-title">Danh Mục Cơ Sở Dữ Liệu</h3>
            <span className="toolbar-count">
              Hiển thị {filteredOrchids.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredOrchids.length)} trong tổng số{" "}
              {filteredOrchids.length} giống lan
            </span>
          </div>

          <div className="toolbar-controls">
            {/* Search Input with Clear Button */}
            <div className="search-box-wrapper">
              <input
                type="text"
                className="table-search-input"
                placeholder="Tìm theo tên, chi, xuất xứ, mã..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
              />
              {tableSearch && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setTableSearch("")}
                  title="Xóa tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              className="table-filter-select"
              value={tableCategory}
              onChange={(e) => setTableCategory(e.target.value)}
              title="Lọc theo chi hoa lan"
            >
              <option value="all">Tất cả chủng loại</option>
              <option value="Cattleya">Cattleya</option>
              <option value="Phalaenopsis">Hồ Điệp</option>
              <option value="Dendrobium">Hoàng Thảo</option>
              <option value="Vanda">Vanda</option>
              <option value="Cymbidium">Địa Lan</option>
              <option value="Paphiopedilum">Lan Hài</option>
              <option value="Oncidium">Vũ Nữ</option>
              <option value="Aerides">Giang Hương</option>
              <option value="Rhynchostylis">Ngọc Điểm</option>
            </select>

            {/* Trait Filter */}
            <select
              className="table-filter-select"
              value={tableTrait}
              onChange={(e) => setTableTrait(e.target.value)}
              title="Lọc theo đặc tính"
            >
              <option value="all">Tất cả đặc tính</option>
              <option value="natural">Chỉ lan tự nhiên</option>
              <option value="special">Chỉ lan đặc biệt</option>
            </select>

            {/* Sorter */}
            <select
              className="table-filter-select"
              value={tableSort}
              onChange={(e) => setTableSort(e.target.value)}
              title="Sắp xếp danh sách"
            >
              <option value="id-desc">Mới nhất (Mã giảm dần)</option>
              <option value="id-asc">Cũ nhất (Mã tăng dần)</option>
              <option value="name-asc">Tên cây (A - Z)</option>
              <option value="price-asc">Giá (Thấp đến Cao)</option>
              <option value="price-desc">Giá (Cao đến Thấp)</option>
              <option value="rating-desc">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "65px" }}>Mã</th>
                <th style={{ width: "70px" }}>Ảnh</th>
                <th>Tên Giống Lan</th>
                <th>Chủng Loại</th>
                <th>Giá Bán</th>
                <th>Xuất Xứ</th>
                <th>Đặc Tính</th>
                <th>Đánh Giá</th>
                <th style={{ width: "160px", textAlign: "right" }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && orchids.length === 0 ? (
                <tr>
                  <td colSpan="9" className="table-empty-row">
                    <div className="table-loading-wrap">
                      <div className="spinner" />
                      <p>Đang tải dữ liệu từ MockAPI server...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedOrchids.length === 0 ? (
                <tr>
                  <td colSpan="9" className="table-empty-row">
                    <div className="table-empty-state">
                      <span className="empty-icon">🔍</span>
                      <p>Không có bản ghi nào khớp với điều kiện tìm kiếm.</p>
                      {(tableSearch || tableCategory !== "all" || tableTrait !== "all") && (
                        <button
                          type="button"
                          className="btn-outline"
                          onClick={() => {
                            setTableSearch("");
                            setTableCategory("all");
                            setTableTrait("all");
                          }}
                        >
                          Xóa Tất Cả Bộ Lọc
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrchids.map((orchid) => {
                  const isCurrentEditing = editingId && String(editingId) === String(orchid.id);
                  return (
                    <tr
                      key={orchid.id}
                      className={isCurrentEditing ? "row-is-editing" : ""}
                    >
                      <td className="cell-id">#{orchid.id}</td>
                      <td>
                        <img
                          src={getOrchidImage(orchid.image, orchid.id)}
                          alt={orchid.name}
                          className="admin-orchid-thumb"
                          onError={(e) => handleImageError(e, orchid.id)}
                        />
                      </td>
                      <td>
                        <div className="cell-orchid-title">
                          <span className="orchid-name-text">{orchid.name}</span>
                          <span className="orchid-color-sub">Màu: {orchid.color || "Tự nhiên"}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge-category">{orchid.category}</span>
                      </td>
                      <td>
                        <span className="badge-price">
                          ${Number(orchid.price || 0).toFixed(2)}
                        </span>
                      </td>
                      <td>{orchid.origin}</td>
                      <td>
                        <div className="traits-badge-wrap">
                          {orchid.isNatural && (
                            <span className="badge-natural">Tự nhiên</span>
                          )}
                          {orchid.isSpecial && (
                            <span className="badge-special">Đặc biệt</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="cell-rating">
                          <span className="star-icon">★</span>
                          <span>{Number(orchid.rating || 5).toFixed(1)}</span>
                          <span className="likes-count">({orchid.numberOfLike || 0} ♥)</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="action-buttons">
                          <button
                            type="button"
                            onClick={() => handleEditClick(orchid)}
                            className={`btn-icon btn-edit ${isCurrentEditing ? "active" : ""}`}
                            title="Kiểm tra phiên & Sửa hoa lan"
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(orchid)}
                            className="btn-icon btn-delete"
                            title="Kiểm tra phiên & Xóa hoa lan"
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        {totalPages > 1 && (
          <div className="table-pagination-footer">
            <span className="pagination-info">
              Trang {currentPage} / {totalPages} (Tổng {filteredOrchids.length} cây)
            </span>

            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Trước
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
                Sau →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal (Professional UI/UX Dialog) */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => !isDeleting && setDeleteTarget(null)}>
          <div className="modal-dialog delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: "var(--danger)" }}>
                Xác Nhận Xóa Hoa Lan
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => !isDeleting && setDeleteTarget(null)}
                disabled={isDeleting}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="delete-target-preview">
                <img
                  src={getOrchidImage(deleteTarget.image, deleteTarget.id)}
                  alt={deleteTarget.name}
                  className="delete-target-img"
                  onError={(e) => handleImageError(e, deleteTarget.id)}
                />
                <div className="delete-target-info">
                  <h4 className="delete-target-name">{deleteTarget.name}</h4>
                  <div className="delete-target-meta">
                    <span>Mã: #{deleteTarget.id}</span>
                    <span>•</span>
                    <span>Chi {deleteTarget.category}</span>
                    <span>•</span>
                    <span className="price-tag">${Number(deleteTarget.price || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="delete-warning-box">
                <span className="warning-icon">⚠️</span>
                <div>
                  <strong>Cảnh báo hành động vĩnh viễn:</strong>
                  <p>
                    Hoa lan này sẽ bị xóa vĩnh viễn khỏi máy chủ MockAPI. Thao tác không thể hoàn tác.
                    Hệ thống sẽ kiểm tra phiên làm việc quản trị của bạn trước khi thực hiện.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Đang Xóa Khỏi MockAPI..." : "Xác Nhận Xóa Vĩnh Viễn"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
