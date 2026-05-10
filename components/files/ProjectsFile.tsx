"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Search, LayoutGrid, List, ChevronDown } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function ProjectsFile() {
  const [selected, setSelected] = useState<string | null>("trueseal");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [sortBy, setSortBy] = useState<"default" | "name">("default");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    portfolioData.projects.forEach(p => {
      if ((p as any).category) cats.add((p as any).category);
    });
    return ["All", ...Array.from(cats)];
  }, []);

  const groupedProjects = useMemo(() => {
    let filtered = portfolioData.projects.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(q) || 
                            p.description.toLowerCase().includes(q) || 
                            p.tech.some(t => t.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === "All" || (p as any).category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    const groups: Record<string, typeof portfolioData.projects> = {};
    filtered.forEach(p => {
      const cat = (p as any).category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show" className="font-mono text-xs space-y-1">
        <div className="code-comment">{`// projects/index.tsx — search, filter, and view projects`}</div>
        <div>
          <span className="code-keyword">export default function </span>
          <span className="code-function">Projects</span>
          <span>() {"{"}</span>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show" className="flex flex-col sm:flex-row gap-3 relative z-20">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-vscode-muted" />
          <input 
            type="text" 
            placeholder="Search projects by name, tech, or keyword..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-vscode-border rounded-lg py-2 pl-9 pr-4 text-xs text-vscode-text focus:outline-none focus:border-vscode-blue transition-colors shadow-inner shadow-black/20"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-[#1e1e1e] border border-vscode-border rounded-lg py-2 pl-3 pr-8 text-xs text-vscode-text focus:outline-none focus:border-vscode-blue transition-colors shadow-inner shadow-black/20"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-vscode-muted pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-[#1e1e1e] border border-vscode-border rounded-lg py-2 pl-3 pr-8 text-xs text-vscode-text focus:outline-none focus:border-vscode-blue transition-colors shadow-inner shadow-black/20"
            >
              <option value="default">Default Order</option>
              <option value="name">Name (A-Z)</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-vscode-muted pointer-events-none" />
          </div>

          <div className="flex bg-[#1e1e1e] border border-vscode-border rounded-lg p-0.5 shadow-inner shadow-black/20">
            <button 
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-vscode-blue/20 text-vscode-blue shadow-sm" : "text-vscode-muted hover:text-vscode-text"}`}
              title="List View"
            >
              <List size={14} />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-vscode-blue/20 text-vscode-blue shadow-sm" : "text-vscode-muted hover:text-vscode-text"}`}
              title="Grid View"
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </motion.div>

      {Object.keys(groupedProjects).length === 0 && (
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show" className="py-12 text-center text-vscode-muted text-xs">
          No projects found matching your criteria.
        </motion.div>
      )}

      <div className="space-y-10 relative z-10">
        {Object.entries(groupedProjects).map(([category, projs], groupIndex) => (
          <div key={category} className="space-y-4">
            <motion.div variants={fadeUp} custom={groupIndex + 2} initial="hidden" animate="show" className="flex items-center gap-4">
               <h3 className="text-vscode-muted uppercase tracking-widest text-[10px] font-bold">{category}</h3>
               <div className="h-px bg-vscode-border flex-1" />
            </motion.div>
            
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
              {projs.map((project, i) => {
                const isOpen = selected === project.id;
                
                return (
                  <motion.div
                    key={project.id}
                    variants={fadeUp}
                    custom={groupIndex + 3 + (i * 0.5)}
                    initial="hidden"
                    animate="show"
                    className="h-full"
                  >
                    {viewMode === "grid" ? (
                      <div className="h-full p-5 rounded-xl border border-vscode-border bg-vscode-sidebar hover:border-vscode-blue/40 transition-colors flex flex-col group relative overflow-hidden shadow-sm">
                        {project.highlight && (
                          <div
                            className="absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity group-hover:opacity-[0.08]"
                            style={{ background: `radial-gradient(circle at top right, ${project.color}, transparent 70%)` }}
                          />
                        )}
                        <div className="flex items-start gap-3 mb-4 relative">
                          <span className="text-3xl">{project.icon}</span>
                          <div>
                            <h4 className="font-semibold text-sm" style={{ color: project.color }}>{project.name}</h4>
                            <p className="text-vscode-muted text-[11px] mt-0.5">{project.subtitle}</p>
                          </div>
                        </div>
                        <p className="text-vscode-text text-[11px] leading-relaxed opacity-90 mb-5 flex-1 relative">
                          {project.description}
                        </p>
                        <div className="mt-auto space-y-4 relative">
                          <div className="flex flex-wrap gap-1.5">
                            {project.tech.map((t) => (
                              <span key={t} className="px-2 py-0.5 rounded text-[9px] bg-vscode-border/50 text-vscode-muted">
                                {t}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2 pt-2 border-t border-vscode-border/50">
                            {(project as any).link && (
                              <a
                                href={(project as any).link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded border transition-colors hover:opacity-80 font-medium"
                                style={{ borderColor: project.color, color: project.color, background: project.color + "10" }}
                              >
                                <ExternalLink size={10} /> View Project
                              </a>
                            )}
                            {(project as any).github && (
                              <a
                                href={(project as any).github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded border transition-colors hover:opacity-80"
                                style={{ borderColor: project.color + "40", color: project.color }}
                              >
                                <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                </svg>
                                Source Code
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
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
                                  {(project as any).link && (
                                    <a
                                      href={(project as any).link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-colors hover:opacity-80 font-medium"
                                      style={{ borderColor: project.color, color: project.color, background: project.color + "15" }}
                                    >
                                      <ExternalLink size={12} /> View Project
                                    </a>
                                  )}
                                  {(project as any).github && (
                                    <a
                                      href={(project as any).github}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-colors hover:opacity-80"
                                      style={{ borderColor: project.color + "60", color: project.color }}
                                    >
                                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                      </svg>
                                      Source Code
                                    </a>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <motion.div variants={fadeUp} custom={10} initial="hidden" animate="show" className="font-mono text-xs pt-4">
        <div>{"}"}</div>
      </motion.div>
    </div>
  );
}
