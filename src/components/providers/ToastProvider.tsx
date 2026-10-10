"use client";

import type React from "react";

import { createContext, useContext } from "react";

import { GlassToast } from "@/components/ui/feedback/GlassToast";
import { useToast } from "@/hooks/useToast";

type ToastContextType = {
  showSuccess: (title: string, message?: string, duration?: number) => string;
  showError: (title: string, message?: string, duration?: number) => string;
  showWarning: (title: string, message?: string, duration?: number) => string;
  showInfo: (title: string, message?: string, duration?: number) => string;
  hideToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

type ToastProviderProps = {
  children: React.ReactNode;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts, hideToast, showSuccess, showError, showWarning, showInfo } =
    useToast();

  return (
    <ToastContext.Provider
      value={{ showSuccess, showError, showWarning, showInfo, hideToast }}
    >
      {children}
      {toasts.map((toast) => (
        <GlassToast
          key={toast.id}
          isVisible={toast.isVisible}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={0} // Handled by useToast hook
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};
