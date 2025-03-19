import { useEffect } from "react";

type ToastType = "success" | "error" | "info";

type ToastProps = {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
};

const typeClasses = {
  success: "bg-green-50 text-green-800 border-green-200",
  error: "bg-red-50 text-red-800 border-red-200",
  info: "bg-blue-50 text-blue-800 border-blue-200",
};

export function Toast({
  message,
  type = "info",
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`
        fixed top-0 left-1/2 -translate-x-1/2
        px-4 py-2 rounded-md shadow-lg
        border
        transform transition-all duration-300 ease-in-out
        animate-slide-down
        ${typeClasses[type]}
      `}
    >
      {message}
    </div>
  );
}
