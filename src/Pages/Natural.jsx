import OrchidsContainer from "../components/OrchidsContainer";

export default function Natural() {
  return (
    <div className="home-container">
      {/* Header Banner for Natural Orchids (Lab 4 Requirement - Anti-slop: No eyebrow) */}
      <section className="hero-section" style={{ paddingBottom: "20px" }}>
        <h1 className="hero-title">Bộ Sưu Tập Giống Lan Rừng Tự Nhiên</h1>
        <p className="hero-subtitle">
          Các giống phong lan bản địa có nguồn gốc từ rừng nhiệt đới và khu bảo tồn sinh quyển tự nhiên.
        </p>
      </section>

      {/* Container filtered for Natural & Special Orchids */}
      <OrchidsContainer filterNaturalOnly={true} />
    </div>
  );
}
