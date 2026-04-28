"use client";
import { motion } from "framer-motion";
import { Files, Search, GitBranch, Blocks } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

interface ActivityBarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
  onContactOpen: () => void;
  activeFile: string;
}

const activities = [
  {
    id: "explorer",
    title: "Explorer — browse files",
    icon: <Files size={24} strokeWidth={1.5} />,
  },
  {
    id: "search",
    title: "Search — jump to a file",
    icon: <Search size={24} strokeWidth={1.5} />,
  },
  {
    id: "git",
    title: "Source Control — commit history",
    icon: <GitBranch size={24} strokeWidth={1.5} />,
  },
  {
    id: "extensions",
    title: "Extensions — tech stack",
    icon: <Blocks size={24} strokeWidth={1.5} />,
  },
];

export default function ActivityBar({ activePanel, onPanelChange, onContactOpen, activeFile }: ActivityBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="w-12 bg-[#333333] flex flex-col items-center py-2 gap-1 shrink-0 border-r border-vscode-border h-full"
    >
      {activities.map((activity) => (
        <button
          key={activity.id}
          onClick={() => onPanelChange(activePanel === activity.id ? "" : activity.id)}
          title={activity.title}
          className={`w-full flex items-center justify-center h-12 relative transition-colors ${activePanel === activity.id
              ? "text-vscode-text"
              : "text-vscode-muted hover:text-vscode-text"
            }`}
        >
          {activePanel === activity.id && (
            <motion.div
              layoutId="activity-indicator"
              className="absolute left-0 top-1 bottom-1 w-0.5 bg-vscode-text rounded-r"
            />
          )}
          {activity.icon}
        </button>
      ))}

      <div className="flex-1" />

      <button
        onClick={onContactOpen}
        title={`Open hire-me.ts — Contact ${portfolioData.name.split(" ")[0]}`}
        className={`w-full flex items-center justify-center h-12 relative transition-colors ${activeFile === "contact"
            ? "text-vscode-text bg-vscode-hover/50"
            : "text-vscode-muted hover:text-vscode-blue"
          }`}
      >
        {activeFile === "contact" && (
          <motion.div
            initial={{ opacity: 0, x: -2 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute left-0 top-1 bottom-1 w-0.5 bg-vscode-text rounded-r"
          />
        )}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </motion.div>
  );
}
