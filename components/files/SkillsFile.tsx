"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { portfolioData } from "@/data/portfolio";

interface SkillBarProps {
  name: string;
  level: number;
  color: string;
  delay: number;
}

function SkillBar({ name, level, color, delay }: SkillBarProps) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(level), delay * 1000 + 300);
    return () => clearTimeout(t);
  }, [level, delay]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-vscode-cyan">{name}</span>
        <span className="text-vscode-muted">{level}%</span>
      </div>
      <div className="h-1.5 bg-vscode-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5", JavaScript: "#f7df1e", Java: "#b07219",
  "C++": "#f34b7d", C: "#555555", SQL: "#e38c00",
  Dart: "#00B4AB", "HTML/CSS": "#e34c26", TypeScript: "#3178c6",
};

const FW_COLORS: Record<string, string> = {
  Django: "#092e20", "Django REST Framework": "#092e20", "React.js": "#61dafb",
  "Next.js": "#ffffff", "Node.js": "#339933", "Express.js": "#ffffff",
  NestJS: "#e0234e", Flutter: "#02569B", "React Native": "#61dafb",
  "Three.js": "#ffffff", "Tailwind CSS": "#38bdf8",
};

const AIML_COLORS: Record<string, string> = {
  NumPy: "#4dabcf", Pandas: "#150458", SciPy: "#8caae6",
  "Scikit-learn": "#f7931e", TensorFlow: "#ff6f00", PyTorch: "#ee4c2c",
  OpenCV: "#5c3ee8", YOLOv8: "#00bfff",
  "Hugging Face Transformers": "#ffd21e", MLflow: "#0194e2",
};

const DB_COLORS: Record<string, string> = {
  PostgreSQL: "#336791", MySQL: "#4479A1", MongoDB: "#47A248",
  SQLite: "#003B57", Firebase: "#FFCA28", Supabase: "#3ECF8E",
};

const TOOL_COLORS: Record<string, string> = {
  Git: "#f34f29", "VS Code": "#007ACC", PyCharm: "#21D789",
  "Google Colab": "#F9AB00", Figma: "#F24E1E", Blender: "#F5792A",
  "Arduino IDE": "#00979D",
};

// Explicit proficiency levels based on resume project usage & expertise
const LANG_LEVELS: Record<string, number> = {
  Python: 90, JavaScript: 92, Java: 70, "C++": 72, C: 65,
  SQL: 80, Dart: 68, "HTML/CSS": 95,
};

const FW_LEVELS: Record<string, number> = {
  Django: 85, "Django REST Framework": 82, "React.js": 92, "Next.js": 90,
  "Node.js": 78, "Express.js": 75, NestJS: 68, Flutter: 72,
  "React Native": 70, "Three.js": 72, "Tailwind CSS": 90,
};

const AIML_LEVELS: Record<string, number> = {
  NumPy: 85, Pandas: 82, SciPy: 72, "Scikit-learn": 78,
  TensorFlow: 75, PyTorch: 80, OpenCV: 82, YOLOv8: 70,
  "Hugging Face Transformers": 65, MLflow: 62,
};

const DB_LEVELS: Record<string, number> = {
  PostgreSQL: 82, MySQL: 85, MongoDB: 75, SQLite: 72,
  Firebase: 78, Supabase: 70,
};

const TOOL_LEVELS: Record<string, number> = {
  Git: 90, "VS Code": 92, PyCharm: 78, "Google Colab": 80,
  Figma: 72, Blender: 65, "Arduino IDE": 68,
};

const langSkills = portfolioData.skills.languages.map((name) => ({
  name,
  level: LANG_LEVELS[name] ?? 65,
  color: LANG_COLORS[name] ?? "#4fc1ff",
}));

const fwSkills = portfolioData.skills.frameworks.map((name) => ({
  name,
  level: FW_LEVELS[name] ?? 65,
  color: FW_COLORS[name] ?? "#4fc1ff",
}));

const aimlSkills = portfolioData.skills.ai_ml_data.map((name) => ({
  name,
  level: AIML_LEVELS[name] ?? 65,
  color: AIML_COLORS[name] ?? "#ce9178",
}));

const dbSkills = portfolioData.skills.databases.map((name) => ({
  name,
  level: DB_LEVELS[name] ?? 65,
  color: DB_COLORS[name] ?? "#4fc1ff",
}));

const toolSkills = portfolioData.skills.tools.map((name) => ({
  name,
  level: TOOL_LEVELS[name] ?? 65,
  color: TOOL_COLORS[name] ?? "#9cdcfe",
}));

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

const sections = [
  { key: "languages", label: "languages", items: langSkills },
  { key: "frameworks", label: "frameworks & libraries", items: fwSkills },
  { key: "ai_ml", label: "AI/ML & data", items: aimlSkills },
  { key: "databases", label: "databases", items: dbSkills },
  { key: "tools", label: "tools & platforms", items: toolSkills },
];

export default function SkillsFile() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-6 text-sm">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show" className="font-mono text-xs">
        <div className="code-comment">{`// skills/languages.json — proficiency levels`}</div>
        <div className="code-operator mt-1">{"{"}</div>
      </motion.div>

      {sections.map((section, sIdx) => (
        <motion.div key={section.key} variants={fadeUp} custom={sIdx + 1} initial="hidden" animate="show" className="space-y-3 pl-6">
          <div className="code-property font-mono text-xs">&quot;{section.label}&quot;: {"{"}</div>
          <div className="space-y-3 pl-4">
            {section.items.map((s, i) => (
              <SkillBar key={s.name} {...s} delay={i * 0.03 + sIdx * 0.15} />
            ))}
          </div>
          <div className="font-mono text-xs code-operator">{"}"}<span className="text-vscode-muted">,</span></div>
        </motion.div>
      ))}

      <motion.div variants={fadeUp} custom={sections.length + 1} initial="hidden" animate="show" className="font-mono text-xs">
        <div className="code-operator">{"}"}</div>
      </motion.div>

      {/* Domains */}
      <motion.div variants={fadeUp} custom={sections.length + 2} initial="hidden" animate="show">
        <div className="text-[11px] text-vscode-muted uppercase tracking-wider font-semibold mb-2">Domains</div>
        <div className="flex flex-wrap gap-2">
          {portfolioData.skills.domains.map((domain) => (
            <span key={domain} className="px-3 py-1.5 rounded-full text-[11px] border border-vscode-green/40 text-vscode-green">
              {domain}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Summary counts */}
      <motion.div variants={fadeUp} custom={sections.length + 3} initial="hidden" animate="show">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
          {[
            { label: "Languages",  count: portfolioData.skills.languages.length,   color: "text-vscode-blue"   },
            { label: "Frameworks", count: portfolioData.skills.frameworks.length,   color: "text-vscode-yellow" },
            { label: "AI/ML",      count: portfolioData.skills.ai_ml_data.length,   color: "text-vscode-pink"   },
            { label: "Databases",  count: portfolioData.skills.databases.length,    color: "text-vscode-cyan"   },
            { label: "Tools",      count: portfolioData.skills.tools.length,        color: "text-vscode-green"  },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded bg-vscode-sidebar border border-vscode-border text-center">
              <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
              <div className="text-vscode-muted text-[11px]">{item.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
