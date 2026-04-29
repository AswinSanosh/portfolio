"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle } from "lucide-react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
  bottomOffset?: number;
}

export default function Toast({ message, onClose, bottomOffset = 40 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (typeof window === "undefined") return null;

  const toast = (
    <AnimatePresence>
      {message && (
        <div 
          className="fixed inset-x-0 z-[9999] flex justify-center pointer-events-none"
          style={{ bottom: bottomOffset }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg bg-[#252526] border border-vscode-border shadow-2xl text-sm text-vscode-text w-fit max-w-[calc(100vw-32px)] md:max-w-md"
          >
            <CheckCircle size={16} className="text-vscode-green shrink-0" />
            <span className="flex-1 break-words">{message}</span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(toast, document.body);
}
