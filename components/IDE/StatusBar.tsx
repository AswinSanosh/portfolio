"use client";
import { motion } from "framer-motion";
import { GitBranch, CheckCircle, Circle, Command } from "lucide-react";
import type { FileId } from "./FileExplorer";
import { portfolioData } from "@/data/portfolio";

const fileLang: Record<FileId, string> = {
  readme: "Markdown",
  about: "TypeScript React",
  skills: "JSON",
  projects: "TypeScript React",
  experience: "Markdown",
  education: "Markdown",
  contact: "TypeScript",
  github: "TypeScript",
  "about-site": "Markdown",
};

interface StatusBarProps {
  activeFile: FileId;
  onCommandPalette: () => void;
}

export default function StatusBar({ activeFile, onCommandPalette }: StatusBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="h-6 bg-vscode-statusbar flex items-center justify-between px-3 text-white text-[11px] shrink-0 select-none overflow-hidden"
    >
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className="flex items-center gap-1">
          <GitBranch size={11} />
          <span>main</span>
        </span>
        <span className="hidden sm:inline opacity-50">|</span>
        <span className="hidden sm:flex items-center gap-1">
          <CheckCircle size={11} />
          <span>0 errors, 0 warnings</span>
        </span>
        <span className="opacity-50">|</span>
        <span className="flex items-center gap-1.5 text-green-200">
          <Circle size={8} className="fill-green-300 text-green-300 animate-pulse shrink-0" />
          <span className="whitespace-nowrap">Open to Work</span>
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 opacity-90 min-w-0">
        <button
          onClick={onCommandPalette}
          className="hidden sm:flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded transition-colors"
          title="Command Palette"
        >
          <Command size={10} />
          <span>Ctrl+K</span>
        </button>
        <span className="hidden sm:inline opacity-50">|</span>
        <span className="hidden sm:inline">UTF-8</span>
        <span className="hidden sm:inline opacity-50">|</span>
        <span className="truncate">{fileLang[activeFile]}</span>
        <span className="hidden sm:inline opacity-50">|</span>
        <span className="hidden sm:inline truncate">{portfolioData.name.toLowerCase().split(" ")[0]}.dev</span>
      </div>
    </motion.div>
  );
}
