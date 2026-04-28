"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, User, Wrench, Code2, Briefcase, GraduationCap, Mail, Github, Download } from "lucide-react";
import type { FileId } from "./FileExplorer";
import { portfolioData } from "@/data/portfolio";

const items: { id: FileId | "download"; label: string; desc: string; Icon: React.ElementType; type: string }[] = [
  { id: "readme", label: "README.md", desc: "Welcome & overview", Icon: FileText, type: "file" },
  { id: "about", label: "profile.tsx", desc: "About me", Icon: User, type: "file" },
  { id: "skills", label: "stack.json", desc: "Technical skills", Icon: Wrench, type: "file" },
  { id: "projects", label: "index.tsx", desc: "Projects showcase", Icon: Code2, type: "file" },
  { id: "experience", label: "journey.md", desc: "Work experience", Icon: Briefcase, type: "file" },
  { id: "education", label: "degrees.md", desc: "Education & certifications", Icon: GraduationCap, type: "file" },
  { id: "contact", label: "hire-me.ts", desc: "Contact & hire me", Icon: Mail, type: "file" },
  { id: "github", label: "stats.ts", desc: "Live GitHub stats & repos", Icon: Github, type: "file" },
  { id: "download", label: "Download Resume", desc: `Get ${portfolioData.name.split(" ")[0]}'s CV as PDF`, Icon: Download, type: "action" },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: (id: FileId) => void;
}

export default function CommandPalette({ isOpen, onClose, onOpen }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => setIdx(0), [query]);

  const select = (item: (typeof items)[0]) => {
    if (item.id === "download") {
      const a = document.createElement("a");
      a.href = "/resume.pdf";
      a.download = `${portfolioData.name.replace(/ /g, "_")}_Resume.pdf`;
      a.click();
    } else {
      onOpen(item.id as FileId);
    }
    onClose();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((p) => Math.min(p + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIdx((p) => Math.max(p - 1, 0)); }
    if (e.key === "Enter" && filtered[idx]) select(filtered[idx]);
  };

  if (typeof window === "undefined") return null;

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
              className="w-full sm:w-[500px] max-w-full rounded-lg shadow-2xl overflow-hidden border border-vscode-border"
              style={{ background: "#252526" }}
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 border-b border-vscode-border">
              <Search size={14} className="text-vscode-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search files and actions..."
                className="flex-1 bg-transparent outline-none text-vscode-text text-xs sm:text-sm placeholder:text-vscode-muted min-w-0"
              />
              <kbd className="hidden sm:inline-block text-[10px] text-vscode-muted px-1.5 py-0.5 rounded border border-vscode-border shrink-0">esc</kbd>
            </div>

            <div className="max-h-[60vh] sm:max-h-72 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-vscode-muted text-sm">No results</div>
              ) : (
                filtered.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => select(item)}
                    onMouseEnter={() => setIdx(i)}
                    className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 text-sm text-left transition-colors ${i === idx ? "bg-vscode-highlight text-white" : "text-vscode-text hover:bg-vscode-hover"
                      }`}
                  >
                    <item.Icon size={15} className={`shrink-0 ${i === idx ? "text-white" : "text-vscode-muted"}`} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${i === idx ? "text-white" : "text-vscode-cyan"}`}>
                        {item.label}
                      </div>
                      <div className={`text-[11px] truncate ${i === idx ? "text-white/70" : "text-vscode-muted"}`}>
                        {item.desc}
                      </div>
                    </div>
                    {item.type === "action" && (
                      <span className={`hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${i === idx ? "border-white/30 text-white/70" : "border-vscode-border text-vscode-muted"
                        }`}>action</span>
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="px-3 sm:px-4 py-2 border-t border-vscode-border flex flex-wrap gap-2 sm:gap-3 text-[10px] text-vscode-muted">
              <span><kbd className="border border-vscode-border px-1 rounded">↑↓</kbd> navigate</span>
              <span><kbd className="border border-vscode-border px-1 rounded">↵</kbd> open</span>
              <span className="hidden sm:inline"><kbd className="border border-vscode-border px-1 rounded">esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
