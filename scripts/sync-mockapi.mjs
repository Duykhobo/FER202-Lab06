// Đồng bộ bộ 16 giống lan chuẩn (src/ListOfOrchids.js) lên MockAPI.
// - PUT ghi đè 16 item (id 1-16) bằng dữ liệu thật đầy đủ trường.
// - DELETE mọi item còn lại ngoài 16 giống chuẩn.
// Chạy: npm run sync:mockapi
import { ListOfOrchids } from "../src/ListOfOrchids.js";
import { API_URL } from "../src/config.js";

const expectedIds = new Set(ListOfOrchids.map((o) => String(o.id)));

// 1) PUT 16 item chuẩn lên MockAPI
for (const orchid of ListOfOrchids) {
  const res = await fetch(`${API_URL}/${orchid.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orchid),
  });
  if (!res.ok) {
    console.error(`PUT #${orchid.id} thất bại (HTTP ${res.status})`);
    process.exit(1);
  }
  console.log(`PUT #${orchid.id} -> ${orchid.name}`);
}

// 2) DELETE toàn bộ item rác ngoài 16 giống chuẩn
const all = await (await fetch(API_URL)).json();
const extra = all.filter((item) => !expectedIds.has(String(item.id)));
for (const item of extra) {
  const res = await fetch(`${API_URL}/${item.id}`, { method: "DELETE" });
  if (!res.ok) console.warn(`DELETE #${item.id} thất bại (HTTP ${res.status})`);
}
console.log(`Đã xóa ${extra.length} item placeholder.`);

// 3) Xác nhận MockAPI đúng 16 item và đủ trường
const check = await (await fetch(API_URL)).json();
const sample = check[0] || {};
const requiredFields = ["name", "image", "price", "rating", "color", "isSpecial", "isNatural", "category", "origin", "numberOfLike", "clip", "description"];
const missing = requiredFields.filter((f) => !(f in sample));
console.log(`MockAPI hiện có ${check.length} item.`);
console.log(`Trường của item mẫu: ${Object.keys(sample).join(", ")}`);

if (check.length !== 16 || missing.length > 0) {
  console.error(`Xác nhận thất bại: kỳ vọng 16 item, thiếu trường: ${missing.join(", ") || "không"}`);
  process.exit(1);
}
console.log("Đồng bộ thành công — MockAPI đang chứa đúng 16 giống lan chuẩn.");
