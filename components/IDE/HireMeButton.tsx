"use client";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export default function HireMeButton({ onOpenContact, terminalOpen }: { onOpenContact: () => void; terminalOpen: boolean }) {
  return (
    <div className="relative shrink-0">
      <motion.button
        onClick={onOpenContact}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`absolute right-3 bottom-4 z-30 hidden md:flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-medium bg-[#007acc] text-white hover:bg-[#0062a3] transition-all shadow-sm`}
      >
        <Mail size={12} />
        <span>Hire Me</span>
      </motion.button>
    </div>
  );
}
