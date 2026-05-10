"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle, Search, LayoutGrid, List, ChevronDown } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

const statusColor = (type: string) => {
  if (type === "Full-Time") return { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" };
  if (type === "Internship") return { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" };
  if (type === "Leadership") return { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" };
  return { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" };
};

export default function ExperienceFile() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const types = useMemo(() => {
    const t = new Set<string>();
    portfolioData.experience.forEach(exp => t.add(exp.type));
    return ["All", ...Array.from(t)];
  }, []);

  const filteredExperiences = useMemo(() => {
    let filtered = portfolioData.experience.filter(exp => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = exp.role.toLowerCase().includes(q) || 
                            exp.company.toLowerCase().includes(q) || 
                            exp.description.toLowerCase().includes(q) || 
                            exp.tech.some(t => t.toLowerCase().includes(q));
      const matchesType = selectedType === "All" || exp.type === selectedType;
      return matchesSearch && matchesType;
    });

    if (sortBy === "oldest") {
      filtered = [...filtered].reverse();
    }

    return filtered;
  }, [searchQuery, selectedType, sortBy]);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 text-sm">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show" className="font-mono text-xs space-y-1">
        <div className="code-comment">{`# experience/ — Professional Journey`}</div>
        <div className="code-comment">{`# ${portfolioData.experience.length} roles across research, startups & academia`}</div>
        <div className="h-2" />
      </motion.div>

      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show" className="flex flex-col sm:flex-row gap-3 relative z-20">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-vscode-muted" />
          <input 
            type="text" 
            placeholder="Search roles, companies, or tech..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-vscode-border rounded-lg py-2 pl-9 pr-4 text-xs text-vscode-text focus:outline-none focus:border-vscode-blue transition-colors shadow-inner shadow-black/20"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none bg-[#1e1e1e] border border-vscode-border rounded-lg py-2 pl-3 pr-8 text-xs text-vscode-text focus:outline-none focus:border-vscode-blue transition-colors shadow-inner shadow-black/20"
            >
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
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
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
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

      {filteredExperiences.length === 0 && (
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show" className="py-12 text-center text-vscode-muted text-xs">
          No experience found matching your criteria.
        </motion.div>
      )}

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10" : "space-y-4 relative z-10"}>
        {filteredExperiences.map((exp, idx) => {
          const colors = statusColor(exp.type);
          const isPresent = exp.period.toLowerCase().includes("present");

          return (
            <motion.div
              key={`${exp.role}-${exp.company}-${idx}`}
              variants={fadeUp}
              custom={idx * 0.5 + 2}
              initial="hidden"
              animate="show"
              className={viewMode === "grid" ? "h-full" : ""}
            >
              <div className={`h-full p-5 rounded-xl border ${isPresent ? "border-vscode-blue/40" : "border-vscode-border"} bg-vscode-sidebar flex flex-col group transition-colors shadow-sm`}>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-vscode-blue/20 to-vscode-pink/20 border border-vscode-border flex items-center justify-center shrink-0">
                      <Briefcase size={22} className="text-vscode-blue" />
                    </div>
                    <div>
                      <div className="text-vscode-yellow font-semibold text-sm">{exp.role}</div>
                      <div className="text-vscode-cyan text-[11px] leading-tight mt-0.5">{exp.company}</div>
                      <div className="text-vscode-muted text-[10px] mt-1">{exp.period}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[9px] ${colors.bg} ${colors.text} border ${colors.border} shrink-0 whitespace-nowrap`}>
                    {isPresent ? "Current" : exp.type}
                  </span>
                </div>

                {exp.description && (
                  <>
                    <div className="h-px bg-vscode-border/50 mb-4" />
                    <div className="space-y-1.5 flex-1">
                      {viewMode === "list" && <div className="text-vscode-muted text-[10px] uppercase tracking-wider font-semibold mb-1">Description</div>}
                      <p className="text-vscode-text text-[11px] leading-relaxed opacity-90">
                        {exp.description}
                      </p>
                    </div>
                  </>
                )}

                {exp.achievements && exp.achievements.length > 0 && (
                  <div className={`space-y-1.5 mt-4 ${viewMode === "grid" ? "flex-1" : ""}`}>
                    {viewMode === "list" && <div className="text-vscode-muted text-[10px] uppercase tracking-wider font-semibold mb-1">Key Achievements</div>}
                    <div className="space-y-1.5">
                      {exp.achievements.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px]">
                          <CheckCircle size={12} className="text-vscode-green mt-[3px] shrink-0" />
                          <span className="text-vscode-text opacity-80 leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {exp.tech && exp.tech.length > 0 && (
                  <div className="space-y-2 mt-4 pt-4 border-t border-vscode-border/50">
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tech.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded text-[9px] border border-vscode-blue/30 text-vscode-cyan bg-vscode-blue/5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={fadeUp} custom={10} initial="hidden" animate="show" className="pt-8">
        <div className="p-5 rounded-xl bg-vscode-sidebar border border-vscode-border shadow-sm">
          <div className="text-vscode-muted text-[11px] uppercase tracking-wider font-bold mb-4">Timeline overview</div>
          <div className="relative pl-4">
            <div className="absolute left-0 top-1 bottom-1 w-px bg-vscode-border z-0" />
            {[
              { year: "2026", event: "Graduating — Seeking Full-Time Role",              color: "#ce9178" },
              { year: "2025", event: "Research Intern — Digital Twin (Taiwan)",           color: "#4fc1ff" },
              { year: "2025", event: "Software Mentor at Tessat Space (Startup)",        color: "#6a9955" },
              { year: "2024", event: "Research Intern at National Chung Cheng University", color: "#dcdcaa" },
              { year: "2023", event: "Chief Marketing Officer at IEDC@Saintgits",       color: "#c586c0" },
              { year: "2021", event: "Started Integrated MCA at Saintgits College of Engineering", color: "#4fc1ff" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 mb-4 last:mb-0">
                <div className="relative z-10 w-2.5 h-2.5 rounded-full shrink-0 -ml-[21px] border-2 border-vscode-sidebar" style={{ backgroundColor: item.color }} />
                <span className="text-vscode-muted text-[10px] w-8 shrink-0 font-mono">{item.year}</span>
                <span className="text-vscode-text text-xs opacity-90">{item.event}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
