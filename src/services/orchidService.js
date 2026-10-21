import { API_URL } from "../config";

const INITIAL_ORCHIDS = [
  {
    id: "1",
    name: "Lan Hồ Điệp Tím (Phalaenopsis)",
    image: "https://images.unsplash.com/photo-1566993269603-7e1270446468?w=600&auto=format&fit=crop&q=80",
    price: 35,
    description: "Hoa lan Hồ Điệp tím quý phái, biểu tượng của sự thanh lịch và tài lộc, giữ hoa tươi lâu đến 2 tháng."
  },
  {
    id: "2",
    name: "Lan Cattleya Nữ Hoàng",
    image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&auto=format&fit=crop&q=80",
    price: 55,
    description: "Được mệnh danh là Nữ hoàng của các loài hoa lan với hương thơm quyến rũ và cánh hoa xòe rộng rực rỡ."
  },
  {
    id: "3",
    name: "Lan Hoàng Thảo (Dendrobium)",
    image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?w=600&auto=format&fit=crop&q=80",
    price: 28,
    description: "Dòng lan Dendrobium sinh trưởng mạnh mẽ, chùm hoa sum sê, nhiều màu sắc tươi tắn và rất dễ chăm sóc."
  },
  {
    id: "4",
    name: "Lan Vanda Xanh Lam Quý Hiếm",
    image: "https://images.unsplash.com/photo-1534885320675-b08ab1314263?w=600&auto=format&fit=crop&q=80",
    price: 60,
    description: "Giống lan Vanda cao cấp với sắc xanh lam độc đáo, hệ rễ gió phát triển mạnh và thích khí hậu thoáng mát."
  },
  {
    id: "5",
    name: "Địa Lan Cymbidium Hoàng Hậu",
    image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&auto=format&fit=crop&q=80",
    price: 70,
    description: "Địa lan thanh tao, lá thuôn dài mượt mà, chuỗi hoa rủ cong duyên dáng rất được ưa chuộng chưng Tết."
  }
];

const LOCAL_STORAGE_KEY = "orchids_data_backup";

function getLocalOrchids() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_ORCHIDS));
    return INITIAL_ORCHIDS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_ORCHIDS;
  }
}

function saveLocalOrchids(data) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

// Kiểm tra xem API URL có phải là link chết mặc định không
function isDefaultDeadUrl(url) {
  return !url || url.includes("an1904") || url.trim() === "";
}

export async function getOrchids() {
  if (!isDefaultDeadUrl(API_URL)) {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn("API error, falling back to local mock data:", err);
    }
  }
  return getLocalOrchids();
}

export async function getOrchidById(id) {
  if (!isDefaultDeadUrl(API_URL)) {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("API error, falling back to local mock data:", err);
    }
  }
  const list = getLocalOrchids();
  const found = list.find((item) => String(item.id) === String(id));
  if (!found) throw new Error("Không tìm thấy thông tin hoa lan");
  return found;
}

export async function createOrchid(orchidData) {
  if (!isDefaultDeadUrl(API_URL)) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orchidData),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("API error, saving to local mock data:", err);
    }
  }
  const list = getLocalOrchids();
  const newItem = {
    ...orchidData,
    id: String(Date.now()),
    price: Number(orchidData.price) || 0,
  };
  const updated = [newItem, ...list];
  saveLocalOrchids(updated);
  return newItem;
}

export async function updateOrchid(id, orchidData) {
  if (!isDefaultDeadUrl(API_URL)) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orchidData),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("API error, updating local mock data:", err);
    }
  }
  const list = getLocalOrchids();
  const updated = list.map((item) =>
    String(item.id) === String(id) ? { ...item, ...orchidData, id: String(id), price: Number(orchidData.price) || 0 } : item
  );
  saveLocalOrchids(updated);
  return { ...orchidData, id: String(id) };
}

export async function deleteOrchid(id) {
  if (!isDefaultDeadUrl(API_URL)) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.warn("API error, deleting from local mock data:", err);
    }
  }
  const list = getLocalOrchids();
  const filtered = list.filter((item) => String(item.id) !== String(id));
  saveLocalOrchids(filtered);
  return true;
}
