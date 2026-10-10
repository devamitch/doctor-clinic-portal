"use client";

import { useState, useCallback } from "react";
import type { ToastType } from "@/components/ui/feedback/GlassToast.tsx";

interface ToastConfig {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastState extends ToastConfig {
  id: string;
  isVisible: boolean;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((config: ToastConfig) => {
    const id = Date.now().toString();
    const toast: ToastState = {
      ...config,
      id,
      isVisible: true,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto-hide after duration
    if (config.duration !== 0) {
      setTimeout(() => {
        hideToast(id);
      }, config.duration || 4000);
    }

    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (title: string, message?: string, duration?: number) => {
      return showToast({ type: "success", title, message, duration });
    },
    [showToast]
  );

  const showError = useCallback(
    (title: string, message?: string, duration?: number) => {
      return showToast({ type: "error", title, message, duration });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (title: string, message?: string, duration?: number) => {
      return showToast({ type: "warning", title, message, duration });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (title: string, message?: string, duration?: number) => {
      return showToast({ type: "info", title, message, duration });
    },
    [showToast]
  );

  return {
    toasts,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
