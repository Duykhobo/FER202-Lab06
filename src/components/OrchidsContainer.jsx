import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrchids } from "../redux/orchidsSlice";
import OrchidsPresentation from "./OrchidsPresentation";
import OrchidModal from "./OrchidModal";
import { useModal } from "../hooks/useModal";

export default function OrchidsContainer({ filterNaturalOnly = false }) {
  const dispatch = useDispatch();
  const { items: orchids, loading, error } = useSelector((state) => state.orchids);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("default");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  // Custom hook useModal (Lab 2 Requirement)
  const { isOpen, data: modalOrchid, openModal, closeModal } = useModal();

  useEffect(() => {
    if (!orchids || orchids.length === 0) {
      dispatch(fetchOrchids());
    }
  }, [dispatch, orchids]);

  // Danh mục chủng loại hoa lan sạch (Lab 4 Tab Component)
  const categories = useMemo(() => [
    { id: "all", label: "Tất Cả" },
    { id: "Cattleya", label: "Cattleya" },
    { id: "Phalaenopsis", label: "Hồ Điệp" },
    { id: "Dendrobium", label: "Hoàng Thảo" },
    { id: "Vanda", label: "Vanda" },
    { id: "Paphiopedilum", label: "Lan Hài" },
    { id: "special", label: "Đặc Biệt" },
    { id: "natural", label: "Tự Nhiên" }
  ], []);

  // Filter & Search & Sort logic
  const filteredOrchids = useMemo(() => {
    let result = [...orchids];

    if (filterNaturalOnly) {
      result = result.filter((item) => item.isNatural === true || item.isSpecial === true);
    }

    if (selectedCategory === "special") {
      result = result.filter((item) => item.isSpecial === true);
    } else if (selectedCategory === "natural") {
      result = result.filter((item) => item.isNatural === true);
    } else if (selectedCategory !== "all") {
      result = result.filter((item) =>
        (item.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          (item.name || "").toLowerCase().includes(term) ||
          (item.description || "").toLowerCase().includes(term) ||
          (item.origin || "").toLowerCase().includes(term) ||
          (item.color || "").toLowerCase().includes(term)
      );
    }

    if (selectedSort === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (selectedSort === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (selectedSort === "rating-desc") {
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else if (selectedSort === "likes-desc") {
      result.sort((a, b) => Number(b.numberOfLike || 0) - Number(a.numberOfLike || 0));
    } else if (selectedSort === "name-asc") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return result;
  }, [orchids, filterNaturalOnly, selectedCategory, searchTerm, selectedSort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, selectedSort, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrchids.length / itemsPerPage) || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 380, behavior: "smooth" });
    }
  };

  if (loading && orchids.length === 0) {
    return (
      <div className="state-container">
        <div className="spinner"></div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>
          Đang nạp bộ sưu tập hoa lan...
        </p>
      </div>
    );
  }

  if (error && orchids.length === 0) {
    return (
      <div className="state-container">
        <h3 style={{ color: "var(--danger)", marginBottom: "8px" }}>Không thể nạp dữ liệu</h3>
        <p style={{ color: "var(--text-muted)" }}>{error}</p>
        <button
          onClick={() => dispatch(fetchOrchids())}
          className="btn-primary"
          style={{ marginTop: "16px" }}
        >
          Thử Lại
        </button>
      </div>
    );
  }

  return (
    <>
      <OrchidsPresentation
        orchids={filteredOrchids}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedSort={selectedSort}
        onChangeSort={setSelectedSort}
        searchTerm={searchTerm}
        onChangeSearch={setSearchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onChangeItemsPerPage={setItemsPerPage}
        onOpenModal={openModal}
      />

      <OrchidModal
        isOpen={isOpen}
        orchid={modalOrchid}
        onClose={closeModal}
      />
    </>
  );
}
