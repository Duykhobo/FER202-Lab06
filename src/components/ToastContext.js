import { createContext, useContext } from "react";

// Context chung cho hệ thống Toast (độc lập khỏi component để Fast Refresh hoạt động)
export const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // An toàn khi dùng hook ngoài Provider (trả về các hàm rỗng)
    return {
      success: () => {},
      error: () => {},
      info: () => {},
    };
  }
  return ctx;
}
