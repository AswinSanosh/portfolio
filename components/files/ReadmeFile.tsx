"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { User, Wrench, Code2, Briefcase, GraduationCap, Mail, MapPin, CheckCircle } from "lucide-react";
import type { FileId } from "@/components/IDE/FileExplorer";
import { portfolioData } from "@/data/portfolio";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

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

const NAV_ITEMS: { id: FileId; label: string; desc: string; Icon: React.ElementType; color: string }[] = [
  { id: "about", label: "profile.tsx", desc: "About Me", Icon: User, color: "#4fc1ff" },
  { id: "skills", label: "stack.json", desc: "Skills", Icon: Wrench, color: "#cbcb41" },
  { id: "projects", label: "index.tsx", desc: "Projects", Icon: Code2, color: "#3178c6" },
  { id: "experience", label: "journey.md", desc: "Experience", Icon: Briefcase, color: "#519aba" },
  { id: "education", label: "degrees.md", desc: "Education", Icon: GraduationCap, color: "#dcdcaa" },
  { id: "contact", label: "hire-me.ts", desc: "Contact", Icon: Mail, color: "#c586c0" },
];

interface ReadmeFileProps {
  onNavigate: (id: FileId) => void;
}

export default function ReadmeFile({ onNavigate }: ReadmeFileProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-8 text-sm leading-relaxed">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show">
        <div className="code-comment text-base mb-1">{`# README.md`}</div>
        <div className="h-px bg-vscode-border" />
      </motion.div>

      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show" className="space-y-3">
        <div className="text-3xl font-bold text-vscode-blue glow-blue">
          Hi, I&apos;m <span className="text-white">{portfolioData.name}</span>
        </div>
        <div className="text-xl text-vscode-yellow">{portfolioData.title}</div>
        <div className="flex flex-wrap gap-2 pt-1">
          {portfolioData.skills.frameworks.slice(0, 4).concat(portfolioData.skills.languages.slice(0, 2)).map((tag) => (
            <motion.span
              key={tag}
              whileHover={{ scale: 1.05, borderColor: "#4fc1ff" }}
              className="px-3 py-1 rounded-full bg-vscode-highlight text-vscode-cyan text-xs border border-vscode-blue/30 cursor-default transition-colors"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Projects Built", value: portfolioData.projects.length, suffix: "+" },
            { label: "Technologies",   value: portfolioData.skills.frameworks.length, suffix: "+" },
            { label: "Experience",     value: portfolioData.experience.length, suffix: ""  },
            { label: "Graduating",     value: 2026, suffix: ""  },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-lg bg-vscode-sidebar border border-vscode-border text-center hover:border-vscode-blue/50 transition-colors">
              <div className="text-2xl font-bold text-vscode-blue glow-blue">
                <AnimatedCounter to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-vscode-muted text-[11px] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show" className="space-y-2">
        <div className="code-comment">{`## About`}</div>
        <p className="text-vscode-text opacity-90 pl-4 border-l-2 border-vscode-blue leading-relaxed md:text-justify">
          {isExpanded ? portfolioData.summary : `${portfolioData.summary.slice(0, 200).trim()}... `}
          {!isExpanded && (
            <button 
              onClick={() => setIsExpanded(true)} 
              className="text-vscode-blue hover:underline font-semibold ml-1 cursor-pointer"
            >
              Read more
            </button>
          )}
        </p>
      </motion.div>

      <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show" className="space-y-3">
        <div className="code-comment">{`## Quick Navigation`}</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {NAV_ITEMS.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 rounded bg-vscode-sidebar border border-vscode-border hover:border-vscode-blue/60 transition-colors text-left group cursor-pointer"
            >
              <item.Icon size={18} className="mb-2" style={{ color: item.color }} />
              <div className="text-vscode-yellow text-xs group-hover:text-vscode-cyan transition-colors font-medium">
                {item.label}
              </div>
              <div className="text-vscode-muted text-[11px]">{item.desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={5} initial="hidden" animate="show" className="space-y-2">
        <div className="code-comment">{`## Status`}</div>
        <div className="flex flex-wrap gap-4 text-xs pl-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-vscode-green">Available for work</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-vscode-muted" />
            <span className="text-vscode-muted">Kerala, India · Remote OK</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap size={12} className="text-vscode-muted" />
            <span className="text-vscode-muted">Graduating 2026</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={6} initial="hidden" animate="show">
        <div className="p-4 rounded-lg bg-[#0d1117] border border-vscode-green/20 font-mono text-xs">
          <div className="text-vscode-green mb-2">{`// Quick hire in terminal:`}</div>
          <div className="text-vscode-muted mb-1">{`$ sudo hire ${portfolioData.name.toLowerCase().split(" ")[0]}`}</div>
          <div className="flex items-center gap-1.5 text-vscode-green">
            <CheckCircle size={12} />
            {portfolioData.name} successfully onboarded
          </div>
        </div>
      </motion.div>
    </div>
  );
}
