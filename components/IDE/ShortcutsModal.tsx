"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, Terminal as TermIcon, Sidebar, Command, Search } from "lucide-react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (typeof window === "undefined") return null;

  const shortcuts = [
    { label: "Command Palette", keys: ["Ctrl", "K"], Icon: Search },
    { label: "Toggle Terminal", keys: ["Ctrl", "`"], Icon: TermIcon },
    { label: "Toggle Sidebar", keys: ["Ctrl", "B"], Icon: Sidebar },
    { label: "Navigate Lists", keys: ["↑", "↓"], Icon: Keyboard },
    { label: "Run / Select", keys: ["Enter"], Icon: Command },
  ];

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="w-full sm:w-[400px] max-w-full rounded-lg shadow-2xl overflow-hidden border border-vscode-border"
            style={{ background: "#252526" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-vscode-border">
              <Keyboard size={16} className="text-vscode-muted shrink-0" />
              <div className="text-vscode-text font-medium text-sm">Keyboard Shortcuts</div>
              <button onClick={onClose} className="ml-auto text-vscode-muted hover:text-vscode-text">
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>

            <div className="p-2">
              {shortcuts.map((sc, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded hover:bg-vscode-hover transition-colors">
                  <div className="flex items-center gap-3 text-vscode-text text-sm">
                    <sc.Icon size={14} className="text-vscode-muted" />
                    <span>{sc.label}</span>
                  </div>
                  <div className="flex gap-1">
                    {sc.keys.map((k, j) => (
                      <kbd key={j} className="text-[11px] font-mono text-vscode-muted px-1.5 py-0.5 rounded border border-vscode-border bg-[#1e1e1e]">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-2 border-t border-vscode-border text-center text-[10px] text-vscode-muted">
              Press <kbd className="border border-vscode-border px-1 rounded mx-0.5">esc</kbd> to close
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
