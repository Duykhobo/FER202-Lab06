import { API_URL } from "../config";
import { ListOfOrchids } from "../ListOfOrchids";

// Chuẩn hóa một item hoa lan: đồng nhất định dạng các trường
// (đảm bảo app luôn nhận dữ liệu đúng shape kể cả khi chạy offline).
function normalizeOrchid(item, index = 0) {
  const fallback = ListOfOrchids[index] || {};
  return {
    ...item,
    id: String(item.id ?? fallback.id),
    name: item.name || fallback.name || "Hoa Lan Quý",
    image: item.image || fallback.image || "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800",
    price: Number(item.price) || fallback.price || 0,
    description: item.description || fallback.description || "Giống hoa lan quý phái, thanh khiết và mang nhiều ý nghĩa phong thủy tốt lành.",
    rating: item.rating !== undefined ? Number(item.rating) : fallback.rating ?? 5,
    isSpecial: Boolean(item.isSpecial ?? fallback.isSpecial ?? false),
    isNatural: Boolean(item.isNatural ?? fallback.isNatural ?? true),
    color: item.color || fallback.color || "pink",
    numberOfLike: item.numberOfLike !== undefined ? Number(item.numberOfLike) : fallback.numberOfLike ?? 150,
    origin: item.origin || fallback.origin || "Vietnam",
    category: item.category || fallback.category || "Cattleya",
    clip: item.clip || fallback.clip || "https://www.youtube.com/embed/41N69X1zZfg",
  };
}

// Lấy danh sách hoa lan: ưu tiên Fetch từ MockAPI,
// fallback offline về ListOfOrchids.js (khi không có mạng).
export async function getOrchids() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`MockAPI trả về HTTP ${res.status} khi tải danh sách hoa lan`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Dữ liệu MockAPI không đúng định dạng danh sách");
    return data.map((item, idx) => normalizeOrchid(item, idx));
  } catch (err) {
    if (err instanceof TypeError) {
      // Lỗi mạng (không reach được MockAPI) -> dùng bộ dữ liệu chuẩn offline
      return ListOfOrchids.map((item, idx) => normalizeOrchid(item, idx));
    }
    throw err;
  }
}

export async function getOrchidById(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (res.status === 404) {
      const notFound = await res.json().catch(() => ({}));
      if (notFound.error === "Not found") {
        throw new Error(`Không tìm thấy thông tin hoa lan với mã #${id} trên MockAPI`);
      }
    }
    if (!res.ok) throw new Error(`MockAPI trả về HTTP ${res.status} khi tải hoa lan #${id}`);
    return normalizeOrchid(await res.json(), 0);
  } catch (err) {
    if (err instanceof TypeError) {
      // Offline: tra cứu từ bộ dữ liệu chuẩn
      const local = ListOfOrchids.find((item) => String(item.id) === String(id));
      if (!local) throw new Error(`Không tìm thấy hoa lan #${id} khi hệ thống ngoại tuyến`);
      return normalizeOrchid(local, 0);
    }
    throw err;
  }
}

export async function createOrchid(orchidData) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orchidData),
  });
  if (!res.ok) throw new Error(`MockAPI trả về HTTP ${res.status} khi thêm hoa lan`);
  return normalizeOrchid(await res.json(), 0);
}

export async function updateOrchid(id, orchidData) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orchidData),
  });
  if (!res.ok) throw new Error(`MockAPI trả về HTTP ${res.status} khi cập nhật hoa lan #${id}`);
  return normalizeOrchid(await res.json(), 0);
}

export async function deleteOrchid(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`MockAPI trả về HTTP ${res.status} khi xóa hoa lan #${id}`);
  return true;
}
