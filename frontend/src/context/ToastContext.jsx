import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 5000,
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        maxWidth: "320px",
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const isError = toast.type === "error" || toast.type === "danger";
  const isSuccess = toast.type === "success";
  
  const borderColor = isError ? "var(--red)" : isSuccess ? "var(--green)" : "var(--accent)";
  const labelPrefix = isError ? "[! ERROR]" : isSuccess ? "[+ SUCCESS]" : "[* INFO]";

  return (
    <div
      onClick={onRemove}
      style={{
        background: "#000",
        color: "#fff",
        padding: "10px 16px",
        borderLeft: `5px solid ${borderColor}`,
        border: `1px solid var(--border)`,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        boxShadow: "4px 4px 0 var(--border)",
      }}
    >
      <div style={{ flex: 1, fontWeight: "800" }}>
        <span style={{ color: borderColor, marginRight: "8px" }}>{labelPrefix}</span>
        {toast.message?.toUpperCase()}
      </div>
      <button style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontWeight: "900", fontSize: "12px" }}>
        [X]
      </button>
    </div>
  );
}
