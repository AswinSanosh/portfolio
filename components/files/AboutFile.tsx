"use client";
import { motion } from "framer-motion";
import { Smartphone, BarChart2, Code2, User } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const CERTS = portfolioData.certifications.slice(0, 3).map((c) => ({
  name: c.name,
  Icon: Code2,
  color: "#4fc1ff",
}));

export default function AboutFile() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-6 text-sm">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show" className="font-mono text-xs space-y-1">
        <div><span className="code-keyword">import </span><span className="code-variable">Developer</span><span className="code-operator"> from </span><span className="code-string">&apos;@/types&apos;</span>;</div>
        <div className="h-2" />
        <div><span className="code-keyword">const </span><span className="code-variable">{portfolioData.name.toLowerCase().split(" ")[0]}</span><span className="code-operator">: </span><span className="code-type">Developer</span><span className="code-operator"> = {"{"}  </span></div>
      </motion.div>

      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show" className="pl-6 space-y-4 border-l-2 border-vscode-blue/30">
        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-vscode-blue to-vscode-pink flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <User size={36} className="text-white" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">{portfolioData.name}</div>
            <div className="text-vscode-yellow">{portfolioData.title}</div>
            <div className="text-vscode-muted text-xs">{portfolioData.location.split(",").slice(-3).join(",").trim()}</div>
            <div className="text-vscode-muted text-xs">{portfolioData.email}</div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show" className="font-mono text-xs space-y-2 pl-6">
        <div><span className="code-property">  name</span><span className="code-operator">: </span><span className="code-string">&quot;{portfolioData.name}&quot;</span><span>,</span></div>
        <div><span className="code-property">  role</span><span className="code-operator">: </span><span className="code-string">&quot;{portfolioData.title}&quot;</span><span>,</span></div>
        <div><span className="code-property">  location</span><span className="code-operator">: </span><span className="code-string">&quot;Kerala, India&quot;</span><span>,</span></div>
        <div><span className="code-property">  status</span><span className="code-operator">: </span><span className="code-string">&quot;Open to opportunities&quot;</span><span>,</span></div>
        <div><span className="code-property">  graduating</span><span className="code-operator">: </span><span className="code-number">2026</span><span>,</span></div>
      </motion.div>

      <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show" className="font-mono text-xs space-y-2 pl-6">
        <div><span className="code-property">  summary</span><span className="code-operator">: </span><span className="code-comment">{`// What drives me`}</span></div>
        <div className="pl-4 p-3 rounded bg-vscode-sidebar border border-vscode-border text-vscode-text leading-relaxed text-xs max-w-xl">
          {portfolioData.summary}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show" className="font-mono text-xs space-y-3 pl-6">
        <div><span className="code-property">  softSkills</span><span className="code-operator">: </span><span>[</span></div>
        <div className="flex flex-wrap gap-2 pl-4">
          {portfolioData.softSkills.slice(0, 4).map((skill) => (
            <span key={skill} className="px-3 py-1.5 rounded-full border border-vscode-purple text-vscode-pink text-[11px]">
              &quot;{skill}&quot;
            </span>
          ))}
        </div>
        <div>  ],</div>
      </motion.div>

      <motion.div variants={fadeUp} custom={5} initial="hidden" animate="show" className="font-mono text-xs pl-6 space-y-1">
        <div><span className="code-property">  certifications</span><span className="code-operator">: </span><span>[</span></div>
        {CERTS.map((cert) => (
          <div key={cert.name} className="pl-4 flex items-center gap-2 text-vscode-orange">
            <cert.Icon size={13} style={{ color: cert.color }} className="shrink-0" />
            <span className="code-string">&quot;{cert.name} Certification&quot;</span>
            <span>,</span>
          </div>
        ))}
        <div>  ],</div>
      </motion.div>

      <motion.div variants={fadeUp} custom={6} initial="hidden" animate="show" className="font-mono text-xs">
        <div><span className="code-operator">{"}"}</span>;</div>
      </motion.div>
    </div>
  );
}
