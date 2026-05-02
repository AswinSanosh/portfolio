"use client";
import type { FileId } from "./FileExplorer";

const crumbs: Record<FileId, string[]> = {
  readme:     ["portfolio", "README.md"],
  about:      ["portfolio", "about", "profile.tsx"],
  skills:     ["portfolio", "skills", "stack.json"],
  projects:   ["portfolio", "projects", "index.tsx"],
  experience: ["portfolio", "experience", "journey.md"],
  education:  ["portfolio", "education", "degrees.md"],
  contact:    ["portfolio", "contact", "hire-me.ts"],
  github:     ["portfolio", "github", "stats.ts"],
  "about-site": ["portfolio", "about", "architecture.md"],
};

const extColor: Record<string, string> = {
  ".tsx": "#3178c6", ".ts": "#3178c6", ".md": "#519aba", ".json": "#cbcb41",
};

function fileColor(name: string) {
  const ext = name.match(/\.[^.]+$/)?.[0] ?? "";
  return extColor[ext] ?? "#d4d4d4";
}

export default function Breadcrumb({ activeFile }: { activeFile: FileId }) {
  const parts = crumbs[activeFile] ?? [];
  return (
    <div className="flex items-center gap-1 px-4 py-1 bg-vscode-bg border-b border-vscode-border text-xs text-vscode-muted select-none shrink-0">
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="opacity-40">›</span>}
          <span style={i === parts.length - 1 ? { color: fileColor(part) } : {}}>
            {part}
          </span>
        </span>
      ))}
    </div>
  );
}
