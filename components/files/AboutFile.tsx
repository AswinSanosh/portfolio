"use client";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { User, Wrench, Code2, Briefcase, GraduationCap, Mail, MapPin, CheckCircle, X, Search } from "lucide-react";
import { portfolioData } from "@/data/portfolio";
import type { FileId } from "@/components/IDE/FileExplorer";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const CERTS = portfolioData.certifications.slice(0, 3).map((c) => ({
  name: c.name,
  Icon: Code2,
  color: "#4fc1ff",
}));

const NAV_ITEMS: { id: FileId; label: string; desc: string; Icon: React.ElementType; color: string }[] = [
  { id: "skills", label: "stack.json", desc: "Skills", Icon: Wrench, color: "#cbcb41" },
  { id: "projects", label: "index.tsx", desc: "Projects", Icon: Code2, color: "#3178c6" },
  { id: "experience", label: "journey.md", desc: "Experience", Icon: Briefcase, color: "#519aba" },
  { id: "education", label: "degrees.md", desc: "Education", Icon: GraduationCap, color: "#dcdcaa" },
  { id: "contact", label: "hire-me.ts", desc: "Contact", Icon: Mail, color: "#c586c0" },
];

function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, to, { duration: 1.5, ease: "easeOut", delay: 0.5 });
    const unsub = rounded.on("change", setDisplay);
    return () => { controls.stop(); unsub(); };
  }, [to, count, rounded]);

  return <span>{display}{suffix}</span>;
}

export default function AboutFile({ onNavigate }: { onNavigate?: (id: FileId) => void }) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [githubData, setGithubData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/github")
      .then(r => r.json())
      .then(d => {
        if (!d.error) setGithubData(d);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-8 text-sm pb-12">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show" className="font-mono text-xs space-y-1">
        <div><span className="code-keyword">import </span><span className="code-variable">Developer</span><span className="code-operator"> from </span><span className="code-string">&apos;@/types&apos;</span>;</div>
        <div className="h-2" />
        <div><span className="code-keyword">const </span><span className="code-variable">{portfolioData.name.toLowerCase().split(" ")[0]}</span><span className="code-operator">: </span><span className="code-type">Developer</span><span className="code-operator"> = {"{"}  </span></div>
      </motion.div>

      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show" className="pl-6 space-y-6 border-l-2 border-vscode-blue/30">
        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
          <div 
            onClick={() => setShowImageModal(true)}
            className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden shrink-0 shadow-lg shadow-blue-500/20 cursor-pointer group relative"
          >
            <img src="/photo.jpg" alt="Profile" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-vscode-blue/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Search size={24} className="text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-vscode-blue glow-blue">
              Hi, I&apos;m <span className="text-white">{portfolioData.name}</span>
            </div>
            <div className="text-xl text-vscode-yellow">{portfolioData.title}</div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {portfolioData.skills.frameworks.slice(0, 4).concat(portfolioData.skills.languages.slice(0, 2)).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-vscode-highlight text-vscode-cyan text-[11px] border border-vscode-blue/30 cursor-default transition-colors hover:border-[#4fc1ff]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show" className="pl-6 font-mono text-xs space-y-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Significant Projects", value: portfolioData.projects.length, suffix: "+" },
            { label: "Technologies",   value: portfolioData.skills.frameworks.length, suffix: "+" },
            { label: "Experiences",     value: portfolioData.experience.length, suffix: ""  },
            { label: "Graduating",     value: 2026, suffix: ""  },
            { label: "GitHub Repos",   value: githubData?.stats?.totalRepos || 0, suffix: "" },
            { label: "Total Commits",  value: githubData?.stats?.allTimeCommits || githubData?.stats?.totalCommits || 0, suffix: "+" },
            { label: "Pull Requests",  value: githubData?.stats?.allTimePRs || githubData?.stats?.totalPRs || 0, suffix: "" },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-lg bg-vscode-sidebar border border-vscode-border text-center hover:border-vscode-blue/50 transition-colors">
              <div className="text-2xl font-bold text-vscode-blue glow-blue">
                {stat.value === 0 && !githubData && stat.label !== "Experience" && stat.label !== "Graduating" ? (
                  <span className="opacity-50 text-xl">...</span>
                ) : (
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <div className="text-vscode-muted text-[11px] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div><span className="code-property">  summary</span><span className="code-operator">: </span><span className="code-comment">{`// What drives me`}</span></div>
        <div className="pl-4 p-3 rounded bg-vscode-sidebar border border-vscode-border text-vscode-text leading-relaxed text-[13px] max-w-2xl md:text-justify">
          {portfolioData.summary}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show" className="pl-6 space-y-3 font-mono text-xs">
        <div><span className="code-property">  quickNav</span><span className="code-operator">: </span><span className="code-comment">{`// Explore more`}</span></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pl-4 max-w-2xl">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate && onNavigate(item.id)}
              className="p-3 rounded bg-vscode-sidebar border border-vscode-border hover:border-vscode-blue/60 transition-colors text-left group cursor-pointer"
            >
              <item.Icon size={16} className="mb-2" style={{ color: item.color }} />
              <div className="text-vscode-yellow text-[11px] group-hover:text-vscode-cyan transition-colors font-medium">
                {item.label}
              </div>
              <div className="text-vscode-muted text-[10px]">{item.desc}</div>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show" className="font-mono text-xs space-y-3 pl-6">
        <div><span className="code-property">  softSkills</span><span className="code-operator">: </span><span>[</span></div>
        <div className="flex flex-wrap gap-2 pl-4 max-w-xl">
          {portfolioData.softSkills.slice(0, 4).map((skill) => (
            <span key={skill} className="px-3 py-1.5 rounded-full border border-vscode-purple/30 bg-vscode-purple/5 text-vscode-pink text-[11px]">
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

      <motion.div variants={fadeUp} custom={6} initial="hidden" animate="show" className="font-mono text-xs pl-6 space-y-3">
        <div><span className="code-property">  status</span><span className="code-operator">: </span><span className="code-comment">{`// Current state`}</span></div>
        <div className="flex flex-wrap gap-4 text-xs pl-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-vscode-green">Available for work</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-vscode-muted" />
            <span className="text-vscode-muted">Kerala, India · Remote OK</span>
          </div>
        </div>
        
        <div className="pt-4 max-w-xl">
          <div className="p-4 rounded-lg bg-[#0d1117] border border-vscode-green/20">
            <div className="text-vscode-green mb-2">{`// Quick hire in terminal:`}</div>
            <div className="text-vscode-muted mb-1">{`$ sudo hire ${portfolioData.name.toLowerCase().split(" ")[0]}`}</div>
            <div className="flex items-center gap-1.5 text-vscode-green">
              <CheckCircle size={12} />
              {portfolioData.name} successfully onboarded
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={7} initial="hidden" animate="show" className="font-mono text-xs pt-4">
        <div><span className="code-operator">{"}"}</span>;</div>
        <div><span className="code-keyword">export default </span><span className="code-variable">{portfolioData.name.toLowerCase().split(" ")[0]}</span>;</div>
      </motion.div>

      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/photo.jpg"
                alt="Profile Large"
                className="w-full h-auto rounded-2xl shadow-2xl border border-vscode-border"
              />
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
