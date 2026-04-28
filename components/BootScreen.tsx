"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

const BOOT_LINES = [
  "Initializing runtime environment...",
  "Loading kernel modules...",
  "Mounting filesystem: /projects  [OK]",
  "Mounting filesystem: /skills    [OK]",
  "Mounting filesystem: /experience [OK]",
  "Starting language services...",
  "Compiling TypeScript definitions...",
  "Connecting to GitHub remote...",
  "Loading portfolio assets...",
  "Boot sequence complete. Welcome.",
];



export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [showAscii, setShowAscii] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowAscii(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showAscii) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[i]]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setDone(true), 400);
        setTimeout(() => onComplete(), 900);
      }
    }, 180);
    return () => clearInterval(interval);
  }, [showAscii, onComplete]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="boot"
          className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="scanline" />

          <div className="w-full max-w-2xl px-8 space-y-6">
            <AnimatePresence>
              {showAscii && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center select-none"
                >
                  <div className="text-4xl md:text-5xl font-bold text-vscode-blue glow-blue tracking-tight">
                    {portfolioData.name}
                  </div>
                  <div className="text-lg md:text-xl text-vscode-muted mt-2 font-mono">Portfolio</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center space-y-1">
              <p className="text-vscode-muted text-xs">{portfolioData.title} OS · v1.0.0</p>
              <p className="text-vscode-green text-xs">{portfolioData.tagline || portfolioData.skills.frameworks.slice(0, 4).join(" · ")}</p>
            </div>

            <div className="space-y-1 font-mono text-xs h-48 overflow-hidden">
              {lines.filter((l): l is string => typeof l === "string").map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-vscode-green opacity-60">{">"}</span>
                  <span
                    className={
                      line?.includes("[OK]")
                        ? "text-vscode-green"
                        : line?.includes("complete")
                        ? "text-vscode-blue glow-blue"
                        : "text-vscode-muted"
                    }
                  >
                    {line}
                  </span>
                </motion.div>
              ))}
              {lines.length > 0 && lines.length < BOOT_LINES.length && (
                <div className="flex items-center gap-2">
                  <span className="text-vscode-green opacity-60">{">"}</span>
                  <span className="text-vscode-muted cursor-blink">&nbsp;</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-vscode-muted">
                <span>Loading...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 bg-vscode-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-vscode-blue to-vscode-pink rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
