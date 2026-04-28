"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, User } from "lucide-react";
import type { FileId } from "./FileExplorer";
import { portfolioData } from "@/data/portfolio";
import ReadmeFile from "@/components/files/ReadmeFile";
import AboutFile from "@/components/files/AboutFile";
import SkillsFile from "@/components/files/SkillsFile";
import ProjectsFile from "@/components/files/ProjectsFile";
import ExperienceFile from "@/components/files/ExperienceFile";
import EducationFile from "@/components/files/EducationFile";
import ContactFile from "@/components/files/ContactFile";
import GithubFile from "@/components/files/GithubFile";
import { useEffect, useRef, useState } from "react";

const fileComponents: Partial<Record<FileId, React.ComponentType>> = {
  about: AboutFile,
  skills: SkillsFile,
  projects: ProjectsFile,
  experience: ExperienceFile,
  education: EducationFile,
  contact: ContactFile,
  github: GithubFile,
};

interface EditorContentProps {
  activeFile: FileId;
  openFiles: FileId[];
  onNavigate: (id: FileId) => void;
}

function WelcomeScreen() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-vscode-blue to-vscode-pink flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Code2 size={40} className="text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-white">{portfolioData.name}</div>
          <div className="text-vscode-yellow">{portfolioData.title}</div>
          <div className="text-vscode-muted text-sm">Open a file from the explorer to get started</div>
        </div>
        <div className="text-xs text-vscode-muted space-y-1">
          <div>← Click any file in the sidebar</div>
          <div>or type <span className="text-vscode-cyan">help</span> in the terminal below</div>
        </div>
      </div>
    </div>
  );
}

export default function EditorContent({ activeFile, openFiles, onNavigate }: EditorContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(10);

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Line height is 20px (leading-5)
        const newCount = Math.max(1, Math.ceil(entry.target.scrollHeight / 20));
        // Prevent infinite loop by checking if we really need to update
        setLineCount((prev) => (prev !== newCount ? newCount : prev));
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [activeFile]);

  if (openFiles.length === 0) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <WelcomeScreen />
      </div>
    );
  }

  const renderContent = () => {
    if (activeFile === "readme") return <ReadmeFile onNavigate={onNavigate} />;
    const Component = fileComponents[activeFile];
    if (!Component) return null;
    return <Component />;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-vscode-bg">
      <div className="min-h-full flex">
        <div className="flex flex-col text-right pt-4 sm:pt-6 md:pt-8 px-0 select-none shrink-0">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="line-number leading-5 text-[13px]">
              {i + 1}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-hidden pb-10">
          <div ref={contentRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFile}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
