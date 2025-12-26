"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none p-4">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};


const ToastItem = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <AlertCircle size={20} className="text-red-500" />,
    info: <Info size={20} className="text-blue-500" />,
    warning: <AlertTriangle size={20} className="text-yellow-500" />,
  };

  const bgColors = {
    success: "bg-white border-l-4 border-green-500",
    error: "bg-white border-l-4 border-red-500",
    info: "bg-white border-l-4 border-blue-500",
    warning: "bg-white border-l-4 border-yellow-500",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-center gap-3 min-w-[300px] max-w-md p-4 rounded-lg shadow-2xl border border-gray-100 ${bgColors[toast.type] || bgColors.info}`}
    >
      <div className="shrink-0">{icons[toast.type] || icons.info}</div>
      <p className="flex-1 text-sm font-medium text-gray-700 leading-snug">
        {toast.message}
      </p>
      <button 
        onClick={onClose} 
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const useToast = () => useContext(ToastContext);