// components/Toaster.tsx

import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, MessageCircle } from "lucide-react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
 // Use next/router for Pages Router

export type ToastType = "success" | "error" | "warning" | "info" | "default" | "message";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
  path?: string;
}

const iconMap = {
  success: <CheckCircle className="text-green-500" />,
  error: <XCircle className="text-red-500" />,
  warning: <AlertTriangle className="text-yellow-500" />,
  info: <Info className="text-blue-500" />,
  default: <Info className="text-gray-500" />,
  message: <MessageCircle className="text-gray-500" />,
};

const bgMap = {
  success: "bg-green-100 border-green-400",
  error: "bg-red-100 border-red-400",
  warning: "bg-yellow-100 border-yellow-400",
  info: "bg-blue-100 border-blue-400",
  default: "bg-gray-100 border-gray-300",
  message: "bg-gray-100 border-gray-300",
};

const Toaster: React.FC<ToastProps> = ({
  message,
  type = "default",
  onClose,
  duration = 3000,
  path,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
      if (path) {
        navigate(path); 
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, path, navigate]);

  return (
    <div
      className={clsx(
        "fixed top-6 left-1/2 -translate-x-1/2 z-[999999] flex items-center gap-4 p-4 rounded-xl shadow-lg transition-all animate-fade-in-up",
        bgMap[type]
      )}
    >
      <div>{iconMap[type]}</div>
      <div className="text-sm font-medium text-gray-900">{message}</div>
      <button onClick={onClose} className="ml-auto text-gray-500 hover:text-black">
        ×
      </button>
    </div>
  );
};

export default Toaster;