import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Component tự động cuộn trang lên đầu mỗi khi chuyển route (đặc biệt là xem chi tiết /detail/:id)
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

