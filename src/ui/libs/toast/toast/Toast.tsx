import { useEffect, useState } from "react";
import type { Toast as ToastType } from "@/core/libs/toast";
import "./toast.scss";

const TOAST_DURATION = 4000;

interface ToastProps {
  toast: ToastType;
}

export const Toast = ({ toast }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / TOAST_DURATION) * 100);
      setProgress(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getToastIcon = () => {
    switch (toast.type) {
      case "SUCCESS":
        return "✅";
      case "INFO":
        return "ℹ️";
      case "WARNING":
        return "⚠️";
      case "ERROR":
        return "❌";
      case "SAVE":
        return "💾";
      default:
        return "📄";
    }
  };

  const getToastClass = () => {
    const baseClass = "toast";
    const typeClass = `toast--${toast.type.toLowerCase()}`;
    const visibilityClass = isVisible ? "toast--visible" : "";
    return `${baseClass} ${typeClass} ${visibilityClass}`;
  };

  return (
    <div className={getToastClass()}>
      <div className="toast__content">
        <div className="toast__icon">{getToastIcon()}</div>
        <div className="toast__message">{toast.message}</div>
      </div>
      <div className="toast__progress">
        <div className="toast__progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
