"use client";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, ChevronRight, Award } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function EducationFile() {
  const education = portfolioData.education;
  const certs = portfolioData.certifications;
  const primary = education[0]; // MCA
  const others = education.slice(1);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-6 text-sm">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show" className="font-mono text-xs space-y-1">
        <div className="code-comment">{`# education/ — Academic Background`}</div>
        <div className="h-2" />
      </motion.div>

      {/* Primary degree — featured card */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show">
        <div className="p-5 rounded-xl border border-vscode-yellow/40 bg-vscode-sidebar space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-vscode-yellow/20 to-vscode-orange/20 border border-vscode-border flex items-center justify-center shrink-0">
              <GraduationCap size={28} className="text-vscode-yellow" />
            </div>
            <div>
              <div className="text-white font-semibold text-base">{primary.degree}</div>
              <div className="text-vscode-yellow text-sm mt-0.5">{primary.institution}</div>
              <div className="text-vscode-muted text-xs mt-0.5">{primary.location} · {primary.period}</div>
            </div>
          </div>

          <div className="h-px bg-vscode-border" />

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded bg-vscode-bg border border-vscode-border text-center">
              <div className="text-2xl font-bold text-vscode-blue">{primary.score?.split(":")[1]?.trim().split("/")[0] || "—"}</div>
              <div className="text-vscode-muted text-[11px]">CGPA</div>
            </div>
            <div className="p-3 rounded bg-vscode-bg border border-vscode-border text-center">
              <div className="text-2xl font-bold text-vscode-green">{primary.period.split("–")[1]?.trim()}</div>
              <div className="text-vscode-muted text-[11px]">Graduating</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-vscode-muted text-[11px] uppercase tracking-wider font-semibold">Course Highlights</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Data Structures & Algorithms",
                "Object Oriented Programming",
                "Database Management Systems",
                "Web Technologies",
                "Software Engineering",
                "Machine Learning",
                "Computer Vision",
                "Mobile Application Dev",
              ].map((course) => (
                <div key={course} className="flex items-center gap-1.5 text-xs text-vscode-muted">
                  <ChevronRight size={11} className="text-vscode-blue shrink-0" />
                  {course}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Other education entries */}
      {others.map((edu, idx) => (
        <motion.div key={idx} variants={fadeUp} custom={idx + 2} initial="hidden" animate="show">
          <div className="p-5 rounded-xl border border-vscode-border bg-vscode-sidebar space-y-3">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-vscode-border flex items-center justify-center shrink-0">
                <BookOpen size={22} className="text-vscode-cyan" />
              </div>
              <div>
                <div className="text-white font-medium text-sm">{edu.degree}</div>
                <div className="text-vscode-cyan text-xs mt-0.5">{edu.institution}</div>
                <div className="text-vscode-muted text-xs mt-0.5">{edu.location ? `${edu.location} · ` : ""}{edu.period}</div>
              </div>
              {edu.score && (
                <div className="ml-auto text-right shrink-0">
                  <div className="text-vscode-green text-xl font-bold">{edu.score}</div>
                  <div className="text-vscode-muted text-[11px]">Score</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Certifications */}
      <motion.div variants={fadeUp} custom={others.length + 2} initial="hidden" animate="show">
        <div className="p-4 rounded-lg bg-vscode-sidebar border border-vscode-border">
          <div className="text-vscode-muted text-[11px] uppercase tracking-wider font-semibold mb-3">Certifications</div>
          <div className="space-y-2">
            {certs.map((cert) => (
              <div key={cert.name} className="flex items-center gap-3 p-2 rounded hover:bg-vscode-hover transition-colors">
                <span className="text-lg shrink-0">{cert.icon}</span>
                <span className="text-xs text-vscode-text">{cert.name}</span>
                <span className="ml-auto flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 shrink-0">
                  <Award size={10} />
                  Certified
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
