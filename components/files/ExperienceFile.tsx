"use client";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle } from "lucide-react";
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
  const experiences = portfolioData.experience;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-6 text-sm">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show" className="font-mono text-xs space-y-1">
        <div className="code-comment">{`# experience/ — Professional Journey`}</div>
        <div className="code-comment">{`# ${experiences.length} roles across research, startups & academia`}</div>
        <div className="h-2" />
      </motion.div>

      {experiences.map((exp, idx) => {
        const colors = statusColor(exp.type);
        const isPresent = exp.period.toLowerCase().includes("present");

        return (
          <motion.div
            key={idx}
            variants={fadeUp}
            custom={idx + 1}
            initial="hidden"
            animate="show"
          >
            <div className={`p-5 rounded-xl border ${isPresent ? "border-vscode-blue/40" : "border-vscode-border"} bg-vscode-sidebar space-y-4`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-vscode-blue/20 to-vscode-pink/20 border border-vscode-border flex items-center justify-center shrink-0">
                    <Briefcase size={22} className="text-vscode-blue" />
                  </div>
                  <div>
                    <div className="text-vscode-yellow font-semibold text-base">{exp.role}</div>
                    <div className="text-vscode-cyan text-sm">{exp.company}</div>
                    <div className="text-vscode-muted text-xs mt-0.5">{exp.type} · {exp.period}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] ${colors.bg} ${colors.text} border ${colors.border} shrink-0 whitespace-nowrap`}>
                  {isPresent ? "Current" : exp.type}
                </span>
              </div>

              {exp.description && (
                <>
                  <div className="h-px bg-vscode-border" />
                  <div className="space-y-2">
                    <div className="text-vscode-muted text-[11px] uppercase tracking-wider font-semibold">Description</div>
                    <p className="text-vscode-text text-xs leading-relaxed opacity-90">
                      {exp.description}
                    </p>
                  </div>
                </>
              )}

              {exp.achievements && exp.achievements.length > 0 && (
                <div className="space-y-2">
                  <div className="text-vscode-muted text-[11px] uppercase tracking-wider font-semibold">Key Achievements</div>
                  <div className="space-y-2">
                    {exp.achievements.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <CheckCircle size={13} className="text-vscode-green mt-0.5 shrink-0" />
                        <span className="text-vscode-text opacity-80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {exp.tech && exp.tech.length > 0 && (
                <div className="space-y-2">
                  <div className="text-vscode-muted text-[11px] uppercase tracking-wider font-semibold">Tech Stack</div>
                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded-full text-[11px] border border-vscode-blue/40 text-vscode-cyan">
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

      <motion.div variants={fadeUp} custom={experiences.length + 1} initial="hidden" animate="show">
        <div className="p-4 rounded-lg bg-vscode-sidebar border border-vscode-border">
          <div className="text-vscode-muted text-[11px] uppercase tracking-wider font-semibold mb-3">Timeline</div>
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
              <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                <div className="relative z-10 w-2 h-2 rounded-full shrink-0 -ml-5" style={{ backgroundColor: item.color }} />
                <span className="text-vscode-muted text-[11px] w-8 shrink-0">{item.year}</span>
                <span className="text-vscode-text text-xs">{item.event}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
