
//sends notifications that a bid has been placed 


"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration (default 5 seconds)
    const duration = toast.duration ?? 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
          text: "text-green-700 dark:text-green-400",
          icon: CheckCircle,
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
          text: "text-red-700 dark:text-red-400",
          icon: AlertCircle,
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
          text: "text-yellow-700 dark:text-yellow-400",
          icon: AlertTriangle,
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
          text: "text-blue-700 dark:text-blue-400",
          icon: Info,
        };
    }
  };

  const { bg, text, icon: Icon } = getToastStyles(toast.type);

  return (
    <div
      className={`${bg} border rounded-lg p-4 shadow-lg min-w-80 max-w-md animate-in slide-in-from-right-5`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 ${text} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${text}`}>{toast.title}</p>
          {toast.message && (
            <p className={`text-sm ${text} opacity-90 mt-1`}>{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className={`${text} hover:opacity-75 transition-opacity`}
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function useToastHelpers() {
  const { addToast } = useToast();

  return {
    success: (title: string, message?: string) =>
      addToast({ type: "success", title, message }),

    error: (title: string, message?: string) =>
      addToast({ type: "error", title, message }),

    warning: (title: string, message?: string) =>
      addToast({ type: "warning", title, message }),

    info: (title: string, message?: string) =>
      addToast({ type: "info", title, message }),
  };
}
