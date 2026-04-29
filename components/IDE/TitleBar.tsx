"use client";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

interface TitleBarProps {
  onCommandPalette: () => void;
  onCloseTab: () => void;
  onToggleSidebar: () => void;
  onToggleTerminal: () => void;
  onMobileMenu: () => void;
  onOpenShortcuts: () => void;
}

export default function TitleBar({
  onCommandPalette,
  onCloseTab,
  onToggleSidebar,
  onToggleTerminal,
  onMobileMenu,
  onOpenShortcuts,
}: TitleBarProps) {
  const downloadResume = () => {
    const a = document.createElement("a");
    a.href = "/resume.pdf";
    a.download = `${portfolioData.name.replace(/ /g, "_")}_Resume.pdf`;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="h-9 bg-[#323233] grid grid-cols-[1fr_auto_1fr] items-center px-3 select-none border-b border-vscode-border shrink-0"
    >
      {/* Left: traffic lights (desktop) + hamburger (mobile) */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onMobileMenu}
          title="Open file explorer"
          className="md:hidden flex flex-col justify-center gap-[4px] w-7 h-7 text-vscode-muted hover:text-vscode-text transition-colors"
        >
          <span className="block h-[2px] w-5 bg-current rounded" />
          <span className="block h-[2px] w-4 bg-current rounded" />
          <span className="block h-[2px] w-5 bg-current rounded" />
        </button>

        <div className="flex gap-1.5 group">
          <button onClick={() => {
              document.documentElement.style.setProperty('--theme-accent', '79, 193, 255');
              document.documentElement.style.setProperty('--theme-accent-dark', '0, 122, 204');
            }} title="Theme: Blue (Default)"
            className="w-3 h-3 rounded-full bg-[#4fc1ff] hover:brightness-125 transition relative">
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[8px] font-bold text-[#004f8b]">↺</span>
          </button>
          <button onClick={() => {
              document.documentElement.style.setProperty('--theme-accent', '244, 71, 71');
              document.documentElement.style.setProperty('--theme-accent-dark', '178, 34, 34');
            }} title="Theme: Red"
            className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-125 transition relative">
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[8px] font-bold text-[#8b0000]">✕</span>
          </button>
          <button onClick={() => {
              document.documentElement.style.setProperty('--theme-accent', '220, 220, 170');
              document.documentElement.style.setProperty('--theme-accent-dark', '170, 170, 100');
            }} title="Theme: Yellow"
            className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-125 transition relative">
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[8px] font-bold text-[#7a5c00]">–</span>
          </button>
          <button onClick={() => {
              document.documentElement.style.setProperty('--theme-accent', '106, 153, 85');
              document.documentElement.style.setProperty('--theme-accent-dark', '74, 117, 56');
            }} title="Theme: Green"
            className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-125 transition relative">
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[8px] font-bold text-[#005c10]">+</span>
          </button>
        </div>
      </div>

      {/* Center: command palette — always truly centered */}
      <button
        onClick={onCommandPalette}
        className="flex items-center gap-20 px-3 py-1 rounded bg-vscode-border/50 hover:bg-vscode-border text-vscode-muted hover:text-vscode-text text-xs transition-all border border-vscode-border/50 whitespace-nowrap"
        title="Open Command Palette (Ctrl+K)"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <span className="hidden sm:inline">
          <span style={{ color: 'rgb(var(--theme-accent))' }}>{portfolioData.name.toLowerCase().split(" ")[0]}</span>
          <span>.</span>
          <span className="text-vscode-yellow">dev</span>
        </span>
        
        <kbd className="hidden md:inline text-[10px] border border-vscode-border px-1 rounded opacity-70">Ctrl+K</kbd>
      </button>

      {/* Right: shortcuts + resume + badge */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onOpenShortcuts}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium text-vscode-muted transition-all hover:brightness-110 active:scale-95 "
          title="Keyboard Shortcuts"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
            <line x1="6" y1="8" x2="6.01" y2="8" />
            <line x1="10" y1="8" x2="10.01" y2="8" />
            <line x1="14" y1="8" x2="14.01" y2="8" />
            <line x1="18" y1="8" x2="18.01" y2="8" />
            <line x1="8" y1="12" x2="8.01" y2="12" />
            <line x1="12" y1="12" x2="12.01" y2="12" />
            <line x1="16" y1="12" x2="16.01" y2="12" />
            <line x1="7" y1="16" x2="17" y2="16" />
          </svg>
          Shortcuts
        </button>

        <button
          onClick={downloadResume}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium text-white transition-all hover:brightness-110 active:scale-95 bg-vscode-statusbar"
          title="Download Resume PDF"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Resume
        </button>

        <button
          onClick={downloadResume}
          className="sm:hidden flex items-center justify-center w-8 h-8 rounded text-vscode-blue hover:bg-vscode-blue/10 transition-all active:scale-90"
          title="Download Resume"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>


      </div>
    </motion.div>
  );
}
