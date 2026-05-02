"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, User, Wrench, Code2, Briefcase, GraduationCap, Mail, Github, X, Info } from "lucide-react";
import type { FileId } from "./FileExplorer";

const tabMeta: Record<FileId, { name: string; ext: string; color: string; Icon: React.ElementType }> = {
  readme:     { name: "README",      ext: ".md",   color: "#519aba", Icon: FileText      },
  about:      { name: "profile",     ext: ".tsx",  color: "#3178c6", Icon: User          },
  skills:     { name: "stack",       ext: ".json", color: "#cbcb41", Icon: Wrench        },
  projects:   { name: "index",       ext: ".tsx",  color: "#3178c6", Icon: Code2         },
  experience: { name: "journey",     ext: ".md",   color: "#519aba", Icon: Briefcase     },
  education:  { name: "degrees",     ext: ".md",   color: "#519aba", Icon: GraduationCap },
  contact:    { name: "hire-me",     ext: ".ts",   color: "#c586c0", Icon: Mail          },
  github:     { name: "stats",       ext: ".ts",   color: "#6e40c9", Icon: Github        },
  "about-site": { name: "architecture", ext: ".md", color: "#4fc1ff", Icon: Info         },
};

interface TabBarProps {
  openFiles: FileId[];
  activeFile: FileId;
  onSelect: (id: FileId) => void;
  onClose: (id: FileId) => void;
}

export default function TabBar({ openFiles, activeFile, onSelect, onClose }: TabBarProps) {
  return (
    <div className="flex items-end bg-vscode-tabbar border-b border-vscode-border overflow-x-auto shrink-0 h-9">
      <AnimatePresence initial={false}>
        {openFiles.map((id) => {
          const meta = tabMeta[id];
          const isActive = id === activeFile;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: -10, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: -10, width: 0 }}
              transition={{ duration: 0.15 }}
              className={`flex items-center gap-1.5 px-3 h-9 text-xs cursor-pointer group shrink-0 border-r border-vscode-border whitespace-nowrap relative transition-colors ${
                isActive
                  ? "bg-vscode-activetab text-vscode-text border-t-2"
                  : "bg-vscode-tabbar text-vscode-muted hover:bg-vscode-hover hover:text-vscode-text border-t-2 border-t-transparent"
              }`}
              style={isActive ? { borderTopColor: meta.color } : {}}
              onClick={() => onSelect(id)}
            >
              <meta.Icon size={13} className="shrink-0" style={{ color: meta.color }} />
              <span>{meta.name}</span>
              <span style={{ color: meta.color }} className="text-[10px]">{meta.ext}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onClose(id); }}
                className={`ml-0.5 w-4 h-4 flex items-center justify-center rounded hover:bg-vscode-border transition-opacity text-vscode-muted hover:text-vscode-text ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <X size={10} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
