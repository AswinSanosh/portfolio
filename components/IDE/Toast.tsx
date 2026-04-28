"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-10 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#252526] border border-vscode-border shadow-xl text-sm text-vscode-text"
        >
          <CheckCircle size={16} className="text-vscode-green shrink-0" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
