"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, User, Wrench, Code2, Briefcase, GraduationCap,
  Mail, Github, Folder, FolderOpen, ChevronRight, ChevronDown,
} from "lucide-react";
import { portfolioData } from "@/data/portfolio";

export type FileId =
  | "readme"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "contact"
  | "github";

interface FileNode {
  id: FileId;
  name: string;
  ext: string;
  Icon: React.ElementType;
}

interface FolderNode {
  name: string;
  files: FileNode[];
  defaultOpen?: boolean;
}

const structure: FolderNode[] = [
  { name: `${portfolioData.name.toUpperCase().replace(/ /g, "-")}-DEV`, defaultOpen: true, files: [{ id: "readme", name: "README", ext: ".md", Icon: FileText }] },
  { name: "about", defaultOpen: true, files: [{ id: "about", name: "profile", ext: ".tsx", Icon: User }] },
  { name: "skills", defaultOpen: false, files: [{ id: "skills", name: "stack", ext: ".json", Icon: Wrench }] },
  { name: "projects", defaultOpen: false, files: [{ id: "projects", name: "index", ext: ".tsx", Icon: Code2 }] },
  { name: "experience", defaultOpen: false, files: [{ id: "experience", name: "journey", ext: ".md", Icon: Briefcase }] },
  { name: "education", defaultOpen: false, files: [{ id: "education", name: "degrees", ext: ".md", Icon: GraduationCap }] },
  { name: "contact", defaultOpen: false, files: [{ id: "contact", name: "hire-me", ext: ".ts", Icon: Mail }] },
  { name: "github", defaultOpen: false, files: [{ id: "github", name: "stats", ext: ".ts", Icon: Github }] },
];

const extColors: Record<string, string> = {
  ".tsx": "#3178c6",
  ".ts": "#3178c6",
  ".md": "#519aba",
  ".json": "#cbcb41",
};

interface FileExplorerProps {
  activeFile: FileId;
  openFiles: FileId[];
  onFileOpen: (id: FileId) => void;
}

export default function FileExplorer({ activeFile, openFiles, onFileOpen }: FileExplorerProps) {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(
    Object.fromEntries(structure.map((f) => [f.name, f.defaultOpen ?? false]))
  );

  const toggle = (name: string) =>
    setOpenFolders((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-vscode-sidebar flex flex-col w-full overflow-y-auto h-full"
    >
      <div className="px-4 py-2 text-[11px] font-semibold text-vscode-muted uppercase tracking-widest select-none">
        Explorer
      </div>

      {structure.map((folder) => {
        const isOpen = openFolders[folder.name];
        return (
          <div key={folder.name}>
            <button
              onClick={() => toggle(folder.name)}
              className="w-full flex items-center gap-1 px-2 py-1 hover:bg-vscode-hover text-vscode-text text-xs select-none"
            >
              {isOpen
                ? <ChevronDown size={12} className="text-vscode-muted shrink-0" />
                : <ChevronRight size={12} className="text-vscode-muted shrink-0" />
              }
              {isOpen
                ? <FolderOpen size={14} className="shrink-0" style={{ color: "#dcb67a" }} />
                : <Folder size={14} className="shrink-0" style={{ color: "#dcb67a" }} />
              }
              <span className="font-medium ml-1">{folder.name}</span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  {folder.files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => onFileOpen(file.id)}
                      className={`w-full flex items-center gap-2 pl-8 pr-3 py-1 text-xs transition-colors ${activeFile === file.id
                          ? "text-white"
                          : "hover:bg-vscode-hover text-vscode-muted hover:text-vscode-text"
                        }`}
                      style={{ 
                        backgroundColor: activeFile === file.id ? 'rgba(var(--theme-accent), 0.3)' : '' 
                      }}
                    >
                      <file.Icon size={13} className="shrink-0" />
                      <span className="flex-1 text-left truncate">{file.name}</span>
                      <span style={{ color: extColors[file.ext] ?? "#d4d4d4" }} className="text-[10px]">
                        {file.ext}
                      </span>
                      {openFiles.includes(file.id) && (
                        <span 
                          className="w-1.5 h-1.5 rounded-full opacity-80" 
                          style={{ backgroundColor: 'rgb(var(--theme-accent))' }}
                        />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
}
