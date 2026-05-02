"use client";
import { motion } from "framer-motion";
import { Info, Code2, Cpu, Zap, Mail, Search, Terminal, Github, Smartphone, Layout } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

const FEATURES = [
  {
    title: "VS Code Inspired IDE Layout",
    description: "A fully functional developer environment with an Activity Bar, Sidebar, Editor Tabs, and a Terminal.",
    icon: Layout,
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    color: "#4fc1ff"
  },
  {
    title: "Interactive Terminal",
    description: "A custom-built terminal emulator that supports commands like 'help', 'about', 'clear', and interactive scripts.",
    icon: Terminal,
    tech: ["React Hooks", "Custom State Logic"],
    color: "#6a9955"
  },
  {
    title: "Real-time GitHub Integration",
    description: "Connects to GitHub's API to show live branch info, commit counts, and repository status in the status bar.",
    icon: Github,
    tech: ["GitHub REST API", "Next.js API Routes"],
    color: "#dcdcaa"
  },
  {
    title: "Secure SMTP Messaging",
    description: "A contact form powered by Gmail SMTP for direct email delivery with loading and success feedback.",
    icon: Mail,
    tech: ["Nodemailer", "Gmail App Passwords"],
    color: "#ce9178"
  },
  {
    title: "Cross-File Search",
    description: "Built-in search engine that indexes portfolio data and allows jumping to any file instantly.",
    icon: Search,
    tech: ["Client-side Indexing", "Regex Search"],
    color: "#38bdf8"
  },
  {
    title: "Dynamic Theme System",
    description: "Synchronized color accents across the entire application using CSS variables for a cohesive UI experience.",
    icon: Zap,
    tech: ["CSS Variables", "Theme Context"],
    color: "#f7df1e"
  },
  {
    title: "Responsive Design",
    description: "Optimized for all devices with a mobile-friendly drawer navigation and touch-enabled resizers.",
    icon: Smartphone,
    tech: ["Tailwind Media Queries", "Touch Events"],
    color: "#c586c0"
  }
];

export default function AboutSiteFile() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-8 text-sm">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-vscode-blue/10 border border-vscode-blue/20">
            <Info className="text-vscode-blue" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">About this Website</h1>
            <p className="text-vscode-muted text-xs font-mono">portfolio/docs/architecture.md</p>
          </div>
        </div>
        <p className="text-vscode-text leading-relaxed">
          I built this portfolio to be more than just a static resume, it's a fully functional <span className="text-vscode-blue">Developer OS</span> designed to show you exactly how I think and build. From the custom terminal to the integrated IDE layout, every piece is a reflection of my passion for clean code, smooth user experiences, and modern web architecture.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FEATURES.map((feature, i) => (
          <div key={feature.title} className="p-4 rounded-lg bg-vscode-sidebar border border-vscode-border hover:border-vscode-blue/30 transition-all group">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-md bg-vscode-bg border border-vscode-border group-hover:border-vscode-blue/50 transition-colors">
                <feature.icon size={20} style={{ color: feature.color }} />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-vscode-text leading-none">{feature.title}</h3>
                <p className="text-xs text-vscode-muted leading-relaxed">{feature.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {feature.tech.map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-vscode-bg border border-vscode-border text-[9px] text-vscode-muted font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show" className="pt-6 border-t border-vscode-border">
        <div className="flex items-center gap-2 mb-4">
          <Cpu size={18} className="text-vscode-yellow" />
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Core Tech Stack</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Next.js 14", sub: "App Router", color: "#ffffff" },
            { name: "React 18", sub: "Client Components", color: "#61dafb" },
            { name: "TypeScript", sub: "Type Safety", color: "#3178c6" },
            { name: "Tailwind CSS", sub: "Styling", color: "#38bdf8" },
            { name: "Framer Motion", sub: "Animations", color: "#ff0055" },
            { name: "Lucide Icons", sub: "Iconography", color: "#ce9178" },
            { name: "Nodemailer", sub: "Email Service", color: "#6a9955" },
            { name: "GitHub API", sub: "Real-time Stats", color: "#dcdcaa" },
          ].map(tech => (
            <div key={tech.name} className="space-y-1">
              <div className="text-xs font-semibold" style={{ color: tech.color }}>{tech.name}</div>
              <div className="text-[10px] text-vscode-muted">{tech.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show" className="pt-8 border-t border-vscode-border space-y-6">
        <div className="flex items-center gap-2">
          <Code2 size={18} className="text-vscode-blue" />
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Technical Deep Dive</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-vscode-blue uppercase tracking-tight">01. State Orchestration</h3>
            <p className="text-xs text-vscode-text leading-relaxed pl-4 border-l-2 border-vscode-blue/30">
              The entire IDE experience is managed through a centralized state in the <code className="text-vscode-pink">IDELayout</code> component. 
              It coordinates the file explorer, multi-tab system, and active editor content. By using <code className="text-vscode-yellow">useCallback</code> 
              and <code className="text-vscode-yellow">useEffect</code> hooks, I ensured that file transitions are smooth and that the terminal 
              state persists even when minimized.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-vscode-green uppercase tracking-tight">02. API & Security Architecture</h3>
            <p className="text-xs text-vscode-text leading-relaxed pl-4 border-l-2 border-vscode-green/30">
              Backend operations are handled via Next.js Route Handlers. The <code className="text-vscode-pink">/api/contact</code> route 
              uses <code className="text-vscode-yellow">nodemailer</code> with secure environment variables for SMTP transport. 
              To prevent abuse, I implemented basic validation and error handling. For GitHub stats, the <code className="text-vscode-pink">/api/git</code> 
              route leverages Next.js <code className="text-vscode-yellow">revalidate</code> to cache data while ensuring the status bar 
              stays relatively up-to-date without hitting rate limits.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-vscode-pink uppercase tracking-tight">03. UI/UX Motion Design</h3>
            <p className="text-xs text-vscode-text leading-relaxed pl-4 border-l-2 border-vscode-pink/30">
              I used <code className="text-vscode-yellow">Framer Motion</code> for advanced UI orchestration. Each file component 
              loads with a staggered <code className="text-vscode-pink">fadeUp</code> variant, and the tab system uses 
              <code className="text-vscode-pink">AnimatePresence</code> for smooth entry/exit animations. The resizable panels 
              leverage low-level pointer events to calculate dimensions in real-time, providing a high-performance, native-like feel.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
