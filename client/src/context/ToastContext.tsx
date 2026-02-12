import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              background: "rgba(0, 0, 0, 0.9)",
              border: `1px solid ${getErrorColor(toast.type)}`,
              color: getErrorColor(toast.type),
              padding: "15px 20px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              minWidth: "250px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              animation: "slideIn 0.3s ease-out"
            }}
          >
            {getIcon(toast.type)}
            <span style={{ flex: 1, fontFamily: "'Courier Prime', monospace" }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const getErrorColor = (type: ToastType) => {
  switch (type) {
    case "success": return "#00ff00";
    case "error": return "#ff0000";
    case "warning": return "#ffff00";
    default: return "#00ccff";
  }
};

const getIcon = (type: ToastType) => {
    switch (type) {
      case "success": return <CheckCircle size={18} />;
      case "error": return <X size={18} />; // Or generic error icon
      case "warning": return <AlertTriangle size={18} />;
      default: return <Info size={18} />;
    }
  };
