"use client";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, User, Code2, Github, Mail, Terminal as TermIcon, Smartphone, Triangle, Diamond, Flame, Cloud, Database, GitBranch, Package, Tag, CheckCircle, Loader2, Search, Info } from "lucide-react";
import TitleBar from "./TitleBar";
import ActivityBar from "./ActivityBar";
import FileExplorer from "./FileExplorer";
import type { FileId } from "./FileExplorer";
import TabBar from "./TabBar";
import EditorContent from "./EditorContent";
import Terminal from "./Terminal";
import StatusBar from "./StatusBar";
import Breadcrumb from "./Breadcrumb";
import CommandPalette from "./CommandPalette";
import HireMeButton from "./HireMeButton";
import Toast from "./Toast";
import ShortcutsModal from "./ShortcutsModal";
import { portfolioData } from "@/data/portfolio";

const MOBILE_NAV: { id: FileId; Icon: React.ElementType; label: string }[] = [
  { id: "readme",   Icon: FileText, label: "Home"    },
  { id: "about",    Icon: User,     label: "About"   },
  { id: "projects", Icon: Code2,    label: "Work"    },
  { id: "github",   Icon: Github,   label: "GitHub"  },
  { id: "contact",  Icon: Mail,     label: "Contact" },
  { id: "about-site", Icon: Info,   label: "Site"    },
];

export default function IDELayout() {
  const [activePanel, setActivePanel]       = useState("explorer");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openFiles, setOpenFiles]           = useState<FileId[]>(["readme"]);
  const [activeFile, setActiveFile]         = useState<FileId>("readme");
  const [terminalOpen, setTerminalOpen]     = useState(false);
  const [paletteOpen, setPaletteOpen]       = useState(false);
  const [shortcutsOpen, setShortcutsOpen]   = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");
  const [toast, setToast]                   = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen]         = useState(false);
  const [gitInfo, setGitInfo]               = useState<{ branch: string; commits: number | null; tag: string | null; repo: string | null; status: string } | null>(null);
  const [sidebarWidth, setSidebarWidth]     = useState(260);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingTerminal, setIsResizingTerminal] = useState(false);

  useEffect(() => {
    fetch("/api/git").then(r => r.json()).then(setGitInfo).catch(() => {});
  }, []);

  const openFile = useCallback((id: FileId) => {
    setOpenFiles((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiveFile(id);
    setDrawerOpen(false);
    setSidebarVisible(true);
  }, []);

  const closeFile = (id: FileId) => {
    const next = openFiles.filter((f) => f !== id);
    setOpenFiles(next.length ? next : []);
    if (activeFile === id) setActiveFile(next[next.length - 1] ?? "readme");
  };

  const closeActiveTab = () => {
    if (openFiles.length > 0) closeFile(activeFile);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "k" || e.key === "K") {
          e.preventDefault();
          setPaletteOpen((p) => !p);
        } else if (e.key === "`") {
          e.preventDefault();
          setTerminalOpen((p) => !p);
        } else if (e.key === "b" || e.key === "B") {
          e.preventDefault();
          setSidebarVisible((p) => {
            if (!p) setActivePanel("explorer");
            return !p;
          });
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setToast("Welcome! Type 'help' in terminal or press Ctrl+K"), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isResizingSidebar) return;
    const handleMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const newWidth = Math.max(160, Math.min(600, clientX - 48));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizingSidebar(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingSidebar]);

  useEffect(() => {
    if (!isResizingTerminal) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (e instanceof TouchEvent && e.cancelable) e.preventDefault();
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const newHeight = Math.max(40, Math.min(window.innerHeight - 150, window.innerHeight - clientY - 60)); // Adjusted for mobile bottom nav
      setTerminalHeight(newHeight);
    };
    const handleEnd = () => setIsResizingTerminal(false);
    
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isResizingTerminal]);

  const FILE_CONTENT: Record<FileId, string> = {
    readme: portfolioData.summary + portfolioData.tagline,
    about: portfolioData.summary + portfolioData.tagline + portfolioData.softSkills.join(" ") + portfolioData.languages.join(" "),
    skills: Object.values(portfolioData.skills).flat().join(" "),
    projects: portfolioData.projects.map(p => `${p.name} ${p.subtitle} ${p.description} ${p.tech.join(" ")}`).join(" "),
    experience: portfolioData.experience.map(e => `${e.role} ${e.company} ${e.description} ${e.tech.join(" ")}`).join(" "),
    education: portfolioData.education.map(e => `${e.degree} ${e.institution}`).join(" "),
    contact: `${portfolioData.email} ${portfolioData.phone} ${portfolioData.linkedin} ${portfolioData.location}`,
    github: "github stats repositories commits contributions " + portfolioData.github,
    "about-site": "Next.js Tailwind Framer Motion Nodemailer GitHub API interactive terminal IDE layout",
  };

  const searchResults = (["readme","about","skills","projects","experience","education","contact","github", "about-site"] as FileId[]).filter(id => {
    if (!searchQuery) return true;
    const content = FILE_CONTENT[id] || "";
    return (
      id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sidebarPanelContent = (
    <>
      {activePanel === "explorer" && (
        <FileExplorer activeFile={activeFile} openFiles={openFiles} onFileOpen={openFile} />
      )}
      {activePanel === "search" && (
        <div className="flex-1 bg-vscode-sidebar flex flex-col min-h-0 overflow-hidden">
          <div className="p-4 border-b border-vscode-border/50">
            <div className="text-[11px] text-vscode-muted uppercase tracking-widest mb-3">Search</div>
            <div className="relative group">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across files..."
                className="w-full bg-[#1e1e1e] border border-vscode-border/50 rounded-sm py-1.5 pl-8 pr-2 text-[11px] text-vscode-text focus:outline-none focus:border-vscode-blue transition-colors placeholder:text-vscode-muted/40"
              />
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-vscode-muted group-focus-within:text-vscode-blue transition-colors" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-vscode-muted hover:text-vscode-text px-1">
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 pt-3">
             <div className="text-[10px] text-vscode-muted uppercase tracking-widest mb-3 flex justify-between items-center px-1">
                <span>{searchQuery ? `${searchResults.length} ${searchResults.length === 1 ? 'match' : 'matches'}` : 'Files'}</span>
             </div>
             <div className="space-y-1">
               {searchResults.length === 0 ? (
                 <div className="text-[11px] text-vscode-muted italic text-center py-8">No results found</div>
               ) : (
                 searchResults.map((id) => (
                   <button key={id} onClick={() => { openFile(id); }}
                     className="w-full flex items-center gap-3 text-left text-xs text-vscode-muted hover:text-vscode-text hover:bg-vscode-hover px-2 py-2 rounded transition-all group">
                     <div className="shrink-0 w-1 h-1 rounded-full bg-vscode-blue/30 group-hover:bg-vscode-blue transition-colors" />
                     <div className="flex flex-col min-w-0">
                       <span className="capitalize text-vscode-text/90 group-hover:text-vscode-blue transition-colors">{id}</span>
                       {searchQuery && FILE_CONTENT[id]?.toLowerCase().includes(searchQuery.toLowerCase()) && (
                         <span className="text-[10px] text-vscode-muted/60 truncate mt-0.5">
                           Match found in content
                         </span>
                       )}
                     </div>
                   </button>
                 ))
               )}
             </div>
          </div>
        </div>
      )}
      {activePanel === "git" && (
        <div className="flex-1 bg-vscode-sidebar flex flex-col overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <div className="text-[11px] text-vscode-muted uppercase tracking-widest mb-3">Source Control</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs">
                <GitBranch size={12} className="text-vscode-blue shrink-0" />
                <span className="text-vscode-text font-medium">{gitInfo?.branch ?? "main"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={11} className="text-vscode-green" />
                <span className="text-[10px] text-vscode-green">clean</span>
              </div>
            </div>
            {gitInfo?.tag && (
              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-vscode-yellow">
                <Tag size={10} className="shrink-0" />
                <span>{gitInfo.tag}</span>
              </div>
            )}
            {gitInfo?.commits && (
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-vscode-muted">
                <Package size={10} className="shrink-0" />
                <span>{gitInfo.commits} total commits</span>
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-vscode-border/50">
            <div className="text-[10px] text-vscode-muted uppercase tracking-widest mb-2">Recent Commits</div>
            <div className="space-y-3">
              {[
                { hash: "f4a8b2", msg: "feat: CANSAT Flight Software", sub: "telemetry dashboards + ESP32", color: "#4fc1ff", file: "projects" as FileId },
                { hash: "c9d3e7", msg: "feat: Bus Tracking Website", sub: "GPS-based tracking + ticketing", color: "#dcdcaa", file: "projects" as FileId },
                { hash: "a1b2c3", msg: "feat: Redwills Interactive", sub: "Next.js + Three.js 3D portfolio", color: "#ce9178", file: "projects" as FileId },
                { hash: "e8f7g6", msg: "work: intern @ NCCU Taiwan", sub: "Physics-Informed Neural Networks", color: "#6a9955", file: "experience" as FileId },
                { hash: "d4c5b6", msg: "edu: MCA @ Saintgits", sub: "Integrated Masters, Kerala (2021-2026)", color: "#c586c0", file: "education" as FileId },
              ].map((c) => (
                <button
                  key={c.hash}
                  onClick={() => openFile(c.file)}
                  className="w-full text-left group"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-[9px] font-mono text-vscode-muted mt-0.5 shrink-0 group-hover:text-vscode-text">{c.hash}</span>
                    <div className="min-w-0">
                      <div className="text-[11px] text-vscode-text group-hover:text-vscode-cyan truncate leading-tight">{c.msg}</div>
                      <div className="text-[10px] text-vscode-muted truncate">{c.sub}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 py-2 border-t border-vscode-border/50 mt-auto">
            <div className="text-[10px] text-vscode-muted uppercase tracking-widest mb-2">Tracked Files</div>
            <div className="space-y-1">
              {(["readme","about","skills","projects","experience","education","contact","github"] as FileId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => openFile(id)}
                  className="w-full flex items-center gap-2 text-[10px] text-vscode-muted hover:text-vscode-text transition-colors"
                >
                  <span className="text-vscode-green">●</span>
                  <span className="font-mono">{id}.tsx</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {activePanel === "extensions" && (
        <div className="flex-1 bg-vscode-sidebar p-4 overflow-y-auto">
          <div className="text-[11px] text-vscode-muted uppercase tracking-widest mb-3">Tech Stack</div>
          <div className="space-y-2 text-xs">
            {[
              { name: "React.js",      version: "v18",   Icon: Code2,      color: "#61dafb" },
              { name: "Next.js",       version: "v14",   Icon: Triangle,   color: "#ffffff" },
              { name: "Python",        version: "v3.x",  Icon: TermIcon,   color: "#3572A5" },
              { name: "Django",        version: "v4.x",  Icon: Code2,      color: "#092e20" },
              { name: "TypeScript",    version: "v5",    Icon: Diamond,    color: "#3178c6" },
              { name: "Tailwind CSS",  version: "v3",    Icon: Code2,      color: "#38bdf8" },
              { name: "Three.js",      version: "webgl", Icon: Triangle,   color: "#ffffff" },
              { name: "OpenCV",        version: "vision",Icon: Smartphone, color: "#5c3ee8" },
            ].map((ext) => (
              <div key={ext.name} className="flex items-center gap-2 p-2 rounded hover:bg-vscode-hover transition-colors">
                <ext.Icon size={16} style={{ color: ext.color }} className="shrink-0" />
                <div className="flex-1">
                  <div className="text-vscode-text">{ext.name}</div>
                  <div className="text-vscode-muted text-[10px]">{ext.version}</div>
                </div>
                <span className="text-[10px] text-vscode-green">●</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed inset-0 flex flex-col overflow-hidden bg-vscode-bg ${
        isResizingSidebar || isResizingTerminal ? "select-none" : ""
      } ${isResizingSidebar ? "cursor-col-resize" : ""} ${
        isResizingTerminal ? "cursor-row-resize" : ""
      }`}
    >
      <TitleBar
        onCommandPalette={() => setPaletteOpen(true)}
        onCloseTab={closeActiveTab}
        onToggleSidebar={() => setSidebarVisible((p) => {
          if (!p) setActivePanel("explorer");
          return !p;
        })}
        onToggleTerminal={() => setTerminalOpen((p) => !p)}
        onMobileMenu={() => setDrawerOpen((p) => !p)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden min-h-0 relative">
        {/* Activity bar — desktop only */}
        <div className="hidden md:block shrink-0">
          <ActivityBar
            activePanel={activePanel}
            onPanelChange={(p) => {
              setActivePanel(p);
              setSidebarVisible(!!p);
            }}
            onContactOpen={(id) => openFile(id)}
            activeFile={activeFile}
          />
        </div>

        {/* Desktop sidebar panels */}
        {sidebarVisible && (
          <div className="hidden md:flex shrink-0" style={{ width: sidebarWidth }}>
            {sidebarPanelContent}
          </div>
        )}

        {/* Sidebar resizer */}
        {sidebarVisible && (
          <div
            onMouseDown={() => setIsResizingSidebar(true)}
            className={`hidden md:block w-[2px] hover:w-[4px] bg-vscode-border hover:bg-vscode-blue cursor-col-resize z-50 transition-all ${isResizingSidebar ? "bg-vscode-blue w-[4px]" : ""}`}
          />
        )}

        {/* Mobile drawer overlay */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 z-[60] md:hidden"
                onClick={() => setDrawerOpen(false)}
              />
              <motion.div
                key="drawer"
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="fixed top-0 left-0 bottom-0 w-72 z-[70] md:hidden flex flex-col overflow-hidden bg-vscode-sidebar border-r border-vscode-border"
              >
                <div className="flex items-center justify-between px-4 h-11 border-b border-vscode-border shrink-0">
                  <span className="text-[11px] uppercase tracking-widest text-vscode-muted font-semibold">Explorer</span>
                  <button onClick={() => setDrawerOpen(false)} className="text-vscode-muted hover:text-vscode-text text-xl leading-none">×</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <FileExplorer activeFile={activeFile} openFiles={openFiles} onFileOpen={openFile} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main editor column */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {openFiles.length > 0 && (
            <>
              <TabBar openFiles={openFiles} activeFile={activeFile} onSelect={setActiveFile} onClose={closeFile} />
              <Breadcrumb activeFile={activeFile} />
            </>
          )}
          <EditorContent activeFile={activeFile} openFiles={openFiles} onNavigate={openFile} />
          
          <div className="relative shrink-0 z-40">
            <HireMeButton onOpenContact={() => openFile("contact")} terminalOpen={terminalOpen} />
          </div>
          
          {/* Terminal resizer */}
          {terminalOpen && (
            <div
              onMouseDown={() => setIsResizingTerminal(true)}
              onTouchStart={() => setIsResizingTerminal(true)}
              className={`h-[4px] md:h-[2px] md:hover:h-[4px] bg-vscode-border hover:bg-vscode-blue cursor-row-resize z-30 transition-all shrink-0 ${isResizingTerminal ? "bg-vscode-blue h-[4px]" : ""}`}
            />
          )}
          
          <Terminal isOpen={terminalOpen} onToggle={() => setTerminalOpen((p) => !p)} height={terminalHeight} />
        </div>
      </div>

      {/* Mobile bottom navigation bar */}
      <div className="lg:hidden shrink-0 flex items-center justify-around h-14 bg-vscode-sidebar border-t border-vscode-border z-20 pb-safe">
        {MOBILE_NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => openFile(item.id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded transition-colors ${
              activeFile === item.id ? "text-vscode-blue" : "text-vscode-muted hover:text-vscode-text"
            }`}
          >
            <item.Icon size={16} />
            <span className="text-[9px]">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => setTerminalOpen((p) => !p)}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded transition-colors ${
            terminalOpen ? "text-vscode-green" : "text-vscode-muted hover:text-vscode-text"
          }`}
        >
          <TermIcon size={16} />
          <span className="text-[9px]">Term</span>
        </button>
      </div>

      <StatusBar activeFile={activeFile} onCommandPalette={() => setPaletteOpen(true)} />

      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} onOpen={openFile} />
      <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      {/* Screen-centered Toast positioned above terminal */}
      <Toast 
        message={toast} 
        onClose={() => setToast(null)} 
        bottomOffset={24 + (typeof window !== 'undefined' && window.innerWidth < 1024 ? 56 : 0) + (terminalOpen ? terminalHeight : 32) + 16}
      />
    </motion.div>
  );
}
