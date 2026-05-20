import React, { useState, useEffect, JSX } from 'react';
import { CheckCircle, X, AlertTriangle, Info, MessageCircle } from 'lucide-react';
import { ToastType } from './Toaster';
import { useNavigate } from 'react-router-dom';

interface ToastModalProps {
  isOpen: boolean;
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
  path?: string;
}

const FloatingElements = ({ type }: { type: ToastType }) => {
  const isError = type === 'error';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Geometric shapes */}
      <div className={`absolute top-4 left-6 w-3 h-3 ${isError ? 'bg-red-400' : 'bg-blue-400'} rounded-full opacity-60`} />
      <div className={`absolute top-8 right-8 w-2 h-2 ${isError ? 'bg-red-300' : 'bg-blue-300'} rotate-45 opacity-40`} />
      <div className={`absolute bottom-12 left-4 w-4 h-0.5 ${isError ? 'bg-red-400' : 'bg-blue-400'} rotate-12 opacity-50`} />
      <div className={`absolute bottom-6 right-6 w-0.5 h-4 ${isError ? 'bg-red-300' : 'bg-blue-300'} rotate-45 opacity-40`} />

      {/* Triangular outlines */}
      <div className={`absolute top-12 right-4 w-6 h-6 border ${isError ? 'border-red-300' : 'border-blue-300'} transform rotate-45 opacity-30`}
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      <div className={`absolute bottom-16 left-8 w-4 h-4 border ${isError ? 'border-red-400' : 'border-blue-400'} transform rotate-12 opacity-40`}
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />

      {/* Plus signs */}
      <div className={`absolute top-16 left-12 text-xs ${isError ? 'text-red-300' : 'text-blue-300'} opacity-50 font-light`}>+</div>
      <div className={`absolute bottom-20 right-12 text-xs ${isError ? 'text-red-400' : 'text-blue-400'} opacity-40 font-light`}>+</div>

      {/* X marks */}
      <div className={`absolute top-20 right-16 text-xs ${isError ? 'text-red-300' : 'text-blue-300'} opacity-40 font-light`}>×</div>
      <div className={`absolute bottom-8 left-16 text-xs ${isError ? 'text-red-400' : 'text-blue-400'} opacity-30 font-light`}>×</div>

      {/* Dots */}
      <div className={`absolute top-6 right-12 w-1 h-1 ${isError ? 'bg-red-400' : 'bg-blue-400'} rounded-full opacity-50`} />
      <div className={`absolute bottom-4 left-20 w-1 h-1 ${isError ? 'bg-red-300' : 'bg-blue-300'} rounded-full opacity-40`} />
      <div className={`absolute top-24 left-6 w-1.5 h-1.5 ${isError ? 'bg-red-400' : 'bg-blue-400'} rounded-full opacity-60`} />

      {/* Grid pattern */}
      <div className={`absolute top-3 right-20 w-8 h-8 opacity-20`}>
        <div className={`grid grid-cols-3 gap-0.5 w-full h-full`}>
          {[...Array(9)].map((_, i) => (
            <div key={i} className={`w-1 h-1 ${isError ? 'bg-red-300' : 'bg-blue-300'} rounded-sm opacity-60`} />
          ))}
        </div>
      </div>
    </div>
  );
};

const iconMap: Record<ToastType, JSX.Element> = {
  success: <CheckCircle className="w-12 h-12 text-white" />,
  error: <AlertTriangle className="w-12 h-12 text-white" />,
  warning: <AlertTriangle className="w-12 h-12 text-white" />,
  info: <Info className="w-12 h-12 text-white" />,
  default: <Info className="w-12 h-12 text-white" />,
  message: <MessageCircle className="w-12 h-12 text-white" />,
};

const backgroundMap: Record<ToastType, string> = {
  success: 'bg-emerald-500 bg-gradient-to-br from-emerald-600 to-emerald-600',
  error: 'bg-gradient-to-br from-red-500 to-red-600',
  warning: 'bg-gradient-to-br from-amber-500 to-amber-600',
  info: 'bg-gradient-to-br from-blue-500 to-blue-600',
  default: 'bg-gradient-to-br from-gray-500 to-gray-600',
  message: 'bg-gradient-to-br from-gray-500 to-gray-600',
};

const titleMap: Record<ToastType, string> = {
  success: 'Success',
  error: 'Failed',
  warning: 'Warning',
  info: 'Information',
  default: 'Notification',
  message: 'Message',
};

const buttonTextMap: Record<ToastType, string> = {
  success: 'Continue',
  error: 'Try Again',
  warning: 'Acknowledge',
  info: 'Got It',
  default: 'Okay',
  message: 'Check',
};

export const ToastModal: React.FC<ToastModalProps> = ({
  isOpen,
  message,
  type = 'success',
  onClose,
  duration = 0,
  path,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (duration > 0 && type !== "message") {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      if (path) {
        navigate(path);
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-transparent backdrop-blur-lg to-purple-700 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={handleClose}
      >
      </div>

      {/* Toast Modal */}
      <div
        className={`relative bg-white rounded-3xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 ease-out ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative p-8 text-center">
          <FloatingElements type={type} />

          {/* Icon container */}
          <div className="relative z-10 mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${backgroundMap[type]} shadow-lg`}>
              {iconMap[type]}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {titleMap[type]}
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
              {message}
            </p>

            <button
              onClick={handleClose}
              className={`inline-flex items-center justify-center px-8 py-3 mt-6 text-sm font-medium text-white ${backgroundMap[type]} rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-blue-500/20`}
            >
              {buttonTextMap[type]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};