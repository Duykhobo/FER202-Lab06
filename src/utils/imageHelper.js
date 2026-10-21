// Bộ ảnh hoa lan chất lượng cao từ Unsplash để fallback khi URL ảnh lỗi hoặc dữ liệu mock giả lập
const HIGH_RES_ORCHIDS = [
  "https://images.unsplash.com/photo-1566993269603-7e1270446468?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618331835717-801e976710b2?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534885320675-b08ab1314263?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1546842931-886c185b4c8c?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=700&auto=format&fit=crop&q=80"
];

export function getOrchidImage(url, id = 0) {
  if (url && typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:"))) {
    return url;
  }
  const numericId = Math.abs(parseInt(id, 10)) || 0;
  return HIGH_RES_ORCHIDS[numericId % HIGH_RES_ORCHIDS.length];
}

export function handleImageError(e, id = 0) {
  const numericId = Math.abs(parseInt(id, 10)) || 0;
  e.target.onerror = null; // Ngăn vòng lặp vô hạn
  e.target.src = HIGH_RES_ORCHIDS[numericId % HIGH_RES_ORCHIDS.length];
}
