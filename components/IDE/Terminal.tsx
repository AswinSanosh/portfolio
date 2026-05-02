"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

interface Line {
  type: "input" | "output" | "error" | "info";
  text: string;
}

const COMMANDS: Record<string, () => string[]> = {
  help: () => {
    const name = portfolioData.name.toLowerCase().replace(/ /g, "");
    const cmds = [
      { cmd: "whoami", desc: "About me" },
      { cmd: "skills", desc: "List my tech skills" },
      { cmd: "projects", desc: "Show my projects" },
      { cmd: "experience", desc: "Work history" },
      { cmd: "contact", desc: "How to reach me" },
      { cmd: "about-site", desc: "Tech stack & features" },
      { cmd: "hire", desc: "Make me an offer 😄" },
      { cmd: "git log", desc: "My commit history" },
      { cmd: `npm install ${name}`, desc: "Install me 📦" },
      { cmd: `sudo hire ${name}`, desc: "Fast track hiring 🚀" },
      { cmd: `ping ${name}`, desc: "Check availability" },
      { cmd: "ls / pwd / date", desc: "Unix classics" },
      { cmd: "clear", desc: "Clear terminal" },
    ];

    // Use standard JS length since emojis in this font accurately take up 2 character columns
    const maxCmdLen = Math.max(...cmds.map(c => c.cmd.length));
    
    const CMD_PADDING = 4;
    const lines = cmds.map(c => `${c.cmd.padEnd(maxCmdLen + CMD_PADDING, " ")}— ${c.desc}`);
    
    const maxLen = Math.max(...lines.map(l => l.length));
    
    // Increase the total width of the box
    const EXTRA_BOX_PADDING = 12;
    const innerWidth = maxLen + EXTRA_BOX_PADDING;

    const topBorder = "╔" + "═".repeat(innerWidth) + "╗";
    const divider = "╠" + "═".repeat(innerWidth) + "╣";
    const bottomBorder = "╚" + "═".repeat(innerWidth) + "╝";
    
    const title = " Available Commands ";
    const leftPad = Math.floor((innerWidth - title.length) / 2);
    const rightPad = innerWidth - title.length - leftPad;
    const titleLine = "║" + "".repeat(leftPad) + title + "\t\t\t\t\t\t\t\t\t   " + "║";

    const textWidth = innerWidth - 4;

    return [
      topBorder,
      titleLine,
      divider,
      ...lines.map(l => "║" + l.padEnd(textWidth, " ") + "║"),
      bottomBorder
    ];
  },

  whoami: () => [
    `Name    : ${portfolioData.name}`,
    `Role    : ${portfolioData.title}`,
    `Stack   : ${portfolioData.skills.frameworks.slice(0, 4).join(" · ")}`,
    `Location: ${portfolioData.location}`,
    `Status  : 🟢 Open to opportunities`,
    `Email   : ${portfolioData.email}`,
    "",
    portfolioData.summary.trim(),
  ],

  skills: () => [
    "Languages  : " + portfolioData.skills.languages.join(", "),
    "Frameworks : " + portfolioData.skills.frameworks.join(", "),
    "Databases  : " + portfolioData.skills.databases.join(", "),
    "Cloud      : " + portfolioData.skills.cloud.join(", "),
    "Tools      : " + portfolioData.skills.tools.join(", "),
    "Domains    : " + portfolioData.skills.domains.join(", "),
  ],

  projects: () =>
    portfolioData.projects.map(
      (p, i) =>
        `[${i + 1}] ${p.icon} ${p.name.padEnd(16)} — ${p.subtitle}`
    ),

  experience: () =>
    portfolioData.experience.map((exp) => [
      `Company : ${exp.company}`,
      `Role    : ${exp.role} (${exp.type})`,
      `Period  : ${exp.period}`,
      exp.tech && exp.tech.length ? `Stack   : ${exp.tech.join(", ")}` : null,
      exp.description ? `→ ${exp.description}` : null,
      ...(exp.achievements && exp.achievements.length ? exp.achievements.map(a => `→ ${a}`) : []),
      ""
    ].filter((line): line is string => Boolean(line))).flat(),

  contact: () => [
    `📧  Email   : ${portfolioData.email}`,
    `📞  Phone   : ${portfolioData.phone}`,
    `💼  LinkedIn: ${portfolioData.linkedin}`,
    `📍  Location: ${portfolioData.location}`,
  ],

  "about-site": () => [
    "🚀  Tech Stack & Features",
    "-------------------------",
    "→ Framework: Next.js 14 (App Router)",
    "→ UI: Tailwind CSS + Framer Motion",
    "→ Backend: Node.js API Routes",
    "→ Messaging: Nodemailer + Gmail SMTP",
    "→ Stats: Live GitHub API integration",
    "→ Themes: Dynamic CSS Variable syncing",
    "→ Icons: Lucide React",
    "",
    "Built with passion for clean code and UX."
  ],

  hire: () => [
    "  ╔══════════════════════════════════════╗",
    `  ║   🎉  Great choice! Let's connect!   ║`,
    "  ╠══════════════════════════════════════╣",
    "  ║                                      ║",
    `  ║  ${portfolioData.name} is available for:             ║`,
    "  ║  → Full-stack development roles      ║",
    "  ║  → Internships & fresher positions   ║",
    "  ║  → Remote, hybrid, or on-site        ║",
    "  ║                                      ║",
    `  ║  📧 ${portfolioData.email}          ║`,
    "  ║                                      ║",
    "  ╚══════════════════════════════════════╝",
    "",
    '  "I am ready to contribute from day one."',
  ],

  ls: () => [
    "drwxr-xr-x  about/",
    "drwxr-xr-x  skills/",
    "drwxr-xr-x  projects/",
    "drwxr-xr-x  experience/",
    "drwxr-xr-x  education/",
    "drwxr-xr-x  contact/",
    "-rw-r--r--  README.md",
  ],

  "git log": () =>
    portfolioData.projects.map((p, i) => [
      `commit ${(Math.random() + 1).toString(36).substring(2, 10)} (HEAD -> main, origin/main)`,
      `Author: ${portfolioData.name} <${portfolioData.email}>`,
      `Date:   ${new Date().getFullYear()}`,
      "",
      `    feat: add ${p.name}`,
      ""
    ]).flat(),

  [`npm install ${portfolioData.name.toLowerCase().replace(/ /g, "")}`]: () => [
    "",
    `  npm warn deprecated old-developer@0.0.0`,
    `  added 1 brilliant developer in 0.3s`,
    "",
    `  📦 ${portfolioData.name.toLowerCase().replace(/ /g, "-")}@1.0.0`,
    ...portfolioData.skills.frameworks.slice(0, 3).map(f => `  ├── ${f.toLowerCase()} ^1.0.0`),
    "  ├── problem-solving ^∞",
    "  └── dedication ^∞",
    "",
    "  ✓ Ready to ship features from day one",
  ],

  [`sudo hire ${portfolioData.name.toLowerCase().replace(/ /g, "")}`]: () => [
    `[sudo] password for recruiter:`,
    "...",
    "✓ Access granted",
    "",
    `🎉 Congratulations! You just made a great decision.`,
    "",
    `   Onboarding ${portfolioData.name}...`,
    "   ████████████████████ 100%",
    "",
    "   → Full Stack capabilities: ENABLED",
    "   → Problem solving mode:    ACTIVE",
    "   → Ready to contribute:     NOW",
    "",
    `   📧 ${portfolioData.email}`,
  ],

  "cat readme.md": () => [
    `# ${portfolioData.name} — ${portfolioData.title}`,
    "",
    portfolioData.skills.frameworks.slice(0, 4).join(" | "),
    "Open to full-time & internship roles.",
    `Based in ${portfolioData.location}.`,
    "",
    "> 'Building the future, one commit at a time.'",
  ],

  date: () => [new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST"],

  pwd: () => ["/home/portfolio"],
  [`ping ${portfolioData.name.toLowerCase().replace(/ /g, "")}`]: () => [
    `PING ${portfolioData.name} (${portfolioData.email})`,
    "64 bytes: response_time=0ms  — Available ✓",
    "64 bytes: response_time=0ms  — Motivated ✓",
    "64 bytes: response_time=0ms  — Ready     ✓",
    "",
    "--- ping statistics ---",
    "3 packets transmitted, 3 received, 0% packet loss",
  ],
};

interface TerminalProps {
  isOpen: boolean;
  onToggle: () => void;
  height?: number;
}

export default function Terminal({ isOpen, onToggle, height }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([
    { type: "info", text: `Welcome to ${portfolioData.name.toLowerCase().replace(/ /g, "")}.dev terminal. Type "help" for commands.` },
    { type: "info", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const run = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    setLines((prev) => [...prev, { type: "input", text: `> ${cmd}` }]);

    if (!trimmed) return;

    if (trimmed === "clear") {
      setLines([{ type: "info", text: 'Terminal cleared. Type "help" for commands.' }, { type: "info", text: "" }]);
      return;
    }

    const handler = COMMANDS[trimmed];
    if (handler) {
      const output = handler();
      setLines((prev) => [...prev, ...output.map((t) => ({ type: "output" as const, text: "  " + t }))]);
    } else {
      setLines((prev) => [
        ...prev,
        { type: "error", text: `Command not found: "${trimmed}". Type "help" for available commands.` },
      ]);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      run(input);
      setHistory((prev) => [input, ...prev].slice(0, 50));
      setHistIdx(-1);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : history[next] ?? "");
    }
  };

  return (
    <div
      className={`flex flex-col border-t border-vscode-border bg-[#1e1e1e] ${!height ? "transition-all duration-200" : ""}`}
      style={isOpen ? { height: height ?? 200 } : { height: 32 }}
    >
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 h-8 text-xs text-vscode-muted hover:text-vscode-text hover:bg-vscode-hover transition-colors shrink-0 w-full text-left"
      >
        <span className="text-[10px]">{isOpen ? "▾" : "▸"}</span>
        <span className="font-semibold">TERMINAL</span>
        <span className="ml-2 text-vscode-green text-[10px]">bash</span>
        <span className="ml-auto text-[10px] opacity-50">{portfolioData.name.toLowerCase().split(" ")[0]}@portfolio:~</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-y-auto px-4 pb-2 font-mono text-xs bg-[#0c0c0c]"
            onClick={() => inputRef.current?.focus()}
          >
            <br></br>
            {lines.map((line, i) => (
              <div
                key={i}
                className={`whitespace-pre ${
                  line.type === "input"
                    ? "text-vscode-cyan"
                    : line.type === "error"
                      ? "text-vscode-red"
                      : line.type === "info"
                        ? "text-vscode-muted"
                        : "text-vscode-green"
                }`}
              >
                {line.text}
              </div>
            ))}

            <div className="flex items-center gap-1 mt-1">
              <span style={{ color: 'rgb(var(--theme-accent))' }}>{portfolioData.name.toLowerCase().split(" ")[0]}@portfolio</span>
              <span className="text-vscode-muted">:</span>
              <span style={{ color: 'rgb(var(--theme-accent))' }}>~</span>
              <span className="text-vscode-muted">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                className="flex-1 bg-transparent outline-none text-vscode-text ml-1 caret-white placeholder:text-vscode-muted/40 placeholder:italic"
                spellCheck={false}
                autoComplete="off"
                placeholder="This terminal is just for fun. Try typing 'help'..."
              />
            </div>
            <div ref={bottomRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
