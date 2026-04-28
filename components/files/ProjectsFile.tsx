"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function ProjectsFile() {
  const [selected, setSelected] = useState<string | null>("trueseal");
  const projects = portfolioData.projects;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-5">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show" className="font-mono text-xs space-y-1">
        <div className="code-comment">{`// projects/index.tsx — click a project to expand`}</div>
        <div>
          <span className="code-keyword">export default function </span>
          <span className="code-function">Projects</span>
          <span>() {"{"}</span>
        </div>
      </motion.div>

      <div className="space-y-3">
        {projects.map((project, i) => {
          const isOpen = selected === project.id;
          return (
            <motion.div
              key={project.id}
              variants={fadeUp}
              custom={i + 1}
              initial="hidden"
              animate="show"
            >
              <button
                onClick={() => setSelected(isOpen ? null : project.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden ${isOpen
                  ? "border-vscode-blue bg-vscode-highlight/10"
                  : project.highlight
                    ? "border-vscode-blue/40 bg-vscode-sidebar hover:bg-vscode-hover"
                    : "border-vscode-border bg-vscode-sidebar hover:border-vscode-blue/30 hover:bg-vscode-hover"
                  }`}
              >
                {project.highlight && (
                  <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 30% 50%, ${project.color}, transparent 70%)` }}
                  />
                )}
                {project.highlight && !isOpen && (
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{ boxShadow: [`0 0 0 1px ${project.color}20`, `0 0 20px 2px ${project.color}15`, `0 0 0 1px ${project.color}20`] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                )}

                <div className="flex items-start justify-between gap-4 relative">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{project.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm" style={{ color: project.color }}>
                          {project.name}
                        </span>

                      </div>
                      <div className="text-vscode-muted text-xs mt-0.5">{project.subtitle}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden sm:flex flex-wrap gap-1 justify-end">
                      {project.tech.slice(0, 3).map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-vscode-border text-vscode-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-vscode-muted text-xs"
                    >
                      ▸
                    </motion.span>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-2 mb-2 p-5 rounded-b-xl bg-[#0d1117] border border-t-0 border-vscode-blue/30 space-y-4">
                      <p className="text-vscode-text text-xs leading-relaxed opacity-90">
                        {project.description}
                      </p>
                      <div className="space-y-2">
                        <div className="text-[11px] text-vscode-muted font-semibold uppercase tracking-wider">Tech Stack</div>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((t) => (
                            <span
                              key={t}
                              className="px-2.5 py-1 rounded-full text-xs border transition-colors hover:opacity-80"
                              style={{ borderColor: project.color + "60", color: project.color }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3 pt-1 flex-wrap">
                        {(project as typeof project & { link?: string }).link && (
                          <a
                            href={(project as typeof project & { link?: string }).link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-colors hover:opacity-80 font-medium"
                            style={{ borderColor: project.color, color: project.color, background: project.color + "15" }}
                          >
                            <ExternalLink size={12} /> Live Site
                          </a>
                        )}
                        <a
                          href={`mailto:${portfolioData.email}?subject=Regarding ${project.name} project`}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-colors hover:opacity-80"
                          style={{ borderColor: project.color + "60", color: project.color }}
                        >
                          <span>✉</span> Ask about this project
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={fadeUp} custom={projects.length + 1} initial="hidden" animate="show" className="font-mono text-xs">
        <div>{"}"}</div>
      </motion.div>
    </div>
  );
}
