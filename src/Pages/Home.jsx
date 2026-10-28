import OrchidsContainer from "../components/OrchidsContainer";

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section (Anti-slop: No eyebrow, Two-line headline) */}
      <section className="hero-section">
        <h1 className="hero-title">Bộ Sưu Tập 16 Giống Hoa Lan Quý Hiếm</h1>
        <p className="hero-subtitle">
          Danh mục thực vật học chọn lọc từ các chi Cattleya, Phalaenopsis, Dendrobium và Paphiopedilum phục vụ bảo tồn và trưng bày.
        </p>
      </section>

      {/* Orchids Container & Presentational View (Lab 1) */}
      <OrchidsContainer filterNaturalOnly={false} />
    </div>
  );
}
