"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Terminal, Sidebar, Command, Search, ArrowRight, Keyboard } from "lucide-react";

const SHORTCUTS = [
  { label: "Command Palette", keys: ["Ctrl", "K"], Icon: Search },
  { label: "Toggle Terminal", keys: ["Ctrl", "`"], Icon: Terminal },
  { label: "Toggle Sidebar", keys: ["Ctrl", "B"], Icon: Sidebar },
];

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15;
        if (next >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(onComplete, 500);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-[#0c0c0c] flex flex-col items-center justify-center z-[10000] overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-vscode-blue/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="w-full max-w-lg px-8 flex flex-col items-center text-center space-y-12 relative z-10">
            {/* Branding */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <div className="flex justify-center mb-6">
                 <div className="w-16 h-16 rounded-2xl bg-vscode-blue flex items-center justify-center shadow-2xl shadow-blue-500/20">
                    <Command size={32} className="text-white" />
                 </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {portfolioData.name}
              </h1>
              <p className="text-vscode-blue font-mono text-sm tracking-wider uppercase opacity-80">
                Full Stack Developer
              </p>
            </motion.div>

            {/* Shortcuts Preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="w-full space-y-4"
            >
              <div className="flex items-center gap-2 text-vscode-muted text-[10px] uppercase tracking-[0.2em] justify-center mb-2">
                <Keyboard size={12} />
                <span>Quick Shortcuts</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {SHORTCUTS.map((sc, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 text-vscode-text/80 text-xs">
                      <sc.Icon size={14} className="text-vscode-blue/60" />
                      <span>{sc.label}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {sc.keys.map((k, j) => (
                        <kbd key={j} className="text-[10px] font-mono text-vscode-muted px-2 py-0.5 rounded-md border border-white/10 bg-white/5 shadow-inner">
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Loading & Action */}
            <div className="w-full pt-4 h-24 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {!isLoaded ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-4"
                  >
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-vscode-blue rounded-full"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <div className="text-[10px] font-mono text-vscode-muted uppercase tracking-[0.3em]">
                      INITIALIZING... {Math.round(progress)}%
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleStart}
                    className="px-6 py-2 bg-vscode-blue hover:bg-vscode-blue/90 text-white text-xs font-medium rounded-sm transition-colors uppercase tracking-widest border border-white/10"
                  >
                    Open Project
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="absolute bottom-8 text-center space-y-1 opacity-40">
            <p className="text-[10px] text-vscode-muted font-mono tracking-widest uppercase">
              Next.js + Express.js + Tailwind CSS
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
