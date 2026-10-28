import { useCallback, useRef, useState } from "react";
import { ToastContext } from "./ToastContext";

// Hệ thống thông báo (toast) thay thế alert() - Lab 6 "UI attractive"
const TOAST_DURATION = 3200;

const ICONS = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <line x1="12" y1="7.5" x2="12.01" y2="7.5" />
    </svg>
  ),
  confirm: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
      setTimeout(() => dismiss(id), TOAST_DURATION);
    },
    [dismiss]
  );

  const showConfirm = useCallback(
    (messageOrOptions, onConfirm, options = {}) => {
      let message = messageOrOptions;
      let confirmCb = onConfirm;
      let opt = options;

      if (typeof messageOrOptions === "object" && messageOrOptions !== null) {
        message = messageOrOptions.message || "";
        confirmCb = messageOrOptions.onConfirm;
        opt = messageOrOptions;
      }

      const id = ++idRef.current;
      const toastItem = {
        id,
        message,
        type: "confirm",
        onConfirm: confirmCb,
        onCancel: opt.onCancel,
        confirmText: opt.confirmText || "Xác nhận",
        cancelText: opt.cancelText || "Hủy",
      };

      // Toast xác nhận giữ hiển thị trong 15s nếu người dùng chưa bấm để tránh biến mất quá nhanh
      const duration = opt.duration ?? 15000;
      setToasts((prev) => [...prev.slice(-3), toastItem]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  const notify = {
    success: (msg) => showToast(msg, "success"),
    error: (msg) => showToast(msg, "error"),
    info: (msg) => showToast(msg, "info"),
    confirm: (msg, onConfirm, options) => showConfirm(msg, onConfirm, options),
  };

  return (
    <ToastContext.Provider value={notify}>
      {children}
      {/* Toast viewport - fixed, không cản trở thao tác */}
      <div className="toast-viewport" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">{ICONS[toast.type] || ICONS.info}</span>
            <div className="toast-body">
              <span className="toast-message">{toast.message}</span>
              {toast.type === "confirm" && (
                <div className="toast-actions">
                  <button
                    type="button"
                    className="toast-btn toast-btn-confirm"
                    onClick={() => {
                      dismiss(toast.id);
                      if (typeof toast.onConfirm === "function") {
                        toast.onConfirm();
                      }
                    }}
                  >
                    {toast.confirmText}
                  </button>
                  <button
                    type="button"
                    className="toast-btn toast-btn-cancel"
                    onClick={() => {
                      dismiss(toast.id);
                      if (typeof toast.onCancel === "function") {
                        toast.onCancel();
                      }
                    }}
                  >
                    {toast.cancelText}
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              className="toast-close"
              onClick={() => {
                dismiss(toast.id);
                if (toast.type === "confirm" && typeof toast.onCancel === "function") {
                  toast.onCancel();
                }
              }}
              aria-label="Đóng thông báo"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
