"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileQuestion, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timeout = setTimeout(() => {
      window.location.href = "https://aswinsanosh.vercel.app/?file=about";
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#d4d4d4] flex flex-col items-center justify-center font-mono p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#1e1e1e] border border-vscode-border rounded-lg p-8 shadow-2xl relative overflow-hidden"
      >
        {/* VS Code title bar style accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-vscode-blue" />
        
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="p-4 bg-[#2d2d2d] rounded-full text-vscode-red">
            <FileQuestion size={48} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-vscode-text tracking-tight">404: File Not Found</h1>
            <p className="text-sm text-vscode-muted">
              The requested resource could not be found in the workspace.
            </p>
          </div>

          <div className="w-full bg-[#0c0c0c] border border-vscode-border rounded p-4 text-xs text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-vscode-green">$</span>
              <span className="text-vscode-cyan">locate</span>
              <span>missing_file.tsx</span>
            </div>
            <div className="text-vscode-red italic">Error: No such file or directory</div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-vscode-green">$</span>
              <span className="text-vscode-yellow">redirect</span>
              <span>--target=about</span>
            </div>
            <div className="text-vscode-muted mt-1">
              Redirecting in <span className="text-vscode-blue font-bold tracking-tighter">{countdown}s</span>...
            </div>
          </div>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={() => window.location.href = "https://aswinsanosh.vercel.app/?file=about"}
              className="flex items-center justify-center gap-2 w-full bg-vscode-blue hover:opacity-90 text-white py-2.5 rounded text-sm font-medium transition-all"
            >
              Go to Profile <ArrowRight size={16} />
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 w-full bg-vscode-hover hover:opacity-90 text-vscode-text py-2.5 rounded text-sm font-medium transition-all"
            >
              <Home size={16} /> Back Home
            </button>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-8 text-[10px] text-vscode-muted opacity-40 uppercase tracking-widest">
        Aswin Sanosh • Developer Portfolio • VS Code Edition
      </div>
    </div>
  );
}
