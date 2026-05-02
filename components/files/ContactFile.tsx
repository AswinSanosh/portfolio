"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Send, Check, Github, Instagram, Palette } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const CONTACTS = [
  { key: "email",    label: portfolioData.email,    Icon: Mail,     value: portfolioData.email,                         href: `mailto:${portfolioData.email}`,                  color: "#4fc1ff" },
  { key: "phone",    label: portfolioData.phone,     Icon: Phone,    value: portfolioData.phone,                         href: `tel:${portfolioData.phone.replace(/\s/g, "")}`,   color: "#6a9955" },
  { key: "linkedin", label: portfolioData.linkedin,   Icon: Linkedin, value: `https://${portfolioData.linkedin}`,          href: `https://${portfolioData.linkedin}`,               color: "#0077b5" },
  { key: "github",   label: "github.com/AswinSanosh", Icon: Github,   value: "https://github.com/AswinSanosh",             href: "https://github.com/AswinSanosh",                  color: "#dcdcaa" },
  { key: "instagram",label: "instagram.com/_aswin__sanosh_", Icon: Instagram, value: "https://www.instagram.com/_aswin__sanosh_/", href: "https://www.instagram.com/_aswin__sanosh_/",color: "#c586c0" },
  { key: "behance",  label: "behance.net/aswinsanosh",Icon: Palette,  value: "https://www.behance.net/aswinsanosh",        href: "https://www.behance.net/aswinsanosh",             color: "#38bdf8" },
];

export default function ContactFile() {
  const [copied, setCopied] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", number: "", email: "", subject: "", message: "" });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", number: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-6 text-sm">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show" className="font-mono text-xs space-y-1">
        <div className="code-comment">{`// contact/hire-me.ts`}</div>
        <div className="code-comment">{`// Let's build something great together`}</div>
        <div className="h-2" />
        <div>
          <span className="code-keyword">async function </span>
          <span className="code-function">{`hire${portfolioData.name.split(" ")[0]}`}</span>
          <span>(</span><span className="code-variable">yourCompany</span><span className="code-operator">: </span><span className="code-type">string</span><span>) {"{"}</span>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show" className="pl-6 space-y-3 font-mono text-xs">
        <div className="code-comment">{`  // Reach out via any channel below:`}</div>
        <div><span className="code-keyword">const </span><span className="code-variable">contacts</span><span className="code-operator"> = </span><span>{"{"}</span></div>
      </motion.div>

      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show" className="pl-10 space-y-3">
        {CONTACTS.map((contact) => (
          <div
            key={contact.key}
            className="group flex items-center justify-between p-3 rounded-lg bg-vscode-sidebar border border-vscode-border hover:border-vscode-blue/50 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <contact.Icon size={18} style={{ color: contact.color }} className="shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] text-vscode-muted uppercase tracking-wider">{contact.key}:</div>
                <a
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs hover:underline transition-colors truncate block"
                  style={{ color: contact.color }}
                >
                  &quot;{contact.label}&quot;
                </a>
              </div>
            </div>
            <button
              onClick={() => copy(contact.value, contact.key)}
              className="opacity-100 md:opacity-0 group-hover:opacity-100 text-xs text-vscode-muted hover:text-vscode-text transition-all px-2 py-1 rounded border border-vscode-border shrink-0 ml-2 flex items-center gap-1"
            >
              {copied === contact.key ? <><Check size={11} className="text-vscode-green" /> Copied</> : "Copy"}
            </button>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show" className="pl-6 font-mono text-xs">
        <div>{"  }"}</div>
      </motion.div>

      <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show" className="pl-6 font-mono text-xs space-y-1">
        <div className="code-comment">{`  // What I'm looking for:`}</div>
        <div><span className="code-keyword">return </span><span>{"{"}</span></div>
        <div className="pl-6 space-y-1">
          <div><span className="code-property">type</span><span className="code-operator">: </span><span className="code-string">&quot;Full-time | Internship&quot;</span><span>,</span></div>
          <div><span className="code-property">roles</span><span className="code-operator">: </span><span>[<span className="code-string">&quot;Full Stack&quot;</span>, <span className="code-string">&quot;Backend&quot;</span>, <span className="code-string">&quot;Frontend&quot;</span>]</span><span>,</span></div>
          <div><span className="code-property">location</span><span className="code-operator">: </span><span className="code-string">&quot;Remote / Hybrid / On-site&quot;</span><span>,</span></div>
          <div><span className="code-property">available</span><span className="code-operator">: </span><span className="code-keyword">true</span><span>,</span></div>
        </div>
        <div>{"  }"}</div>
      </motion.div>

      <motion.div variants={fadeUp} custom={5} initial="hidden" animate="show" className="font-mono text-xs">
        <div>{"}"}</div>
      </motion.div>

      <motion.div variants={fadeUp} custom={6} initial="hidden" animate="show" className="mt-8 border-t border-vscode-border pt-6">
        <div className="font-mono text-xs mb-4 code-comment">{`// Or send a direct message:`}</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-vscode-bg border border-vscode-border rounded p-2.5 text-xs text-vscode-text outline-none focus:border-vscode-blue transition-colors font-mono placeholder:text-vscode-muted/50 w-full disabled:opacity-50" disabled={status === "loading"} />
            <input type="text" placeholder="Phone Number (Optional)" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} className="bg-vscode-bg border border-vscode-border rounded p-2.5 text-xs text-vscode-text outline-none focus:border-vscode-blue transition-colors font-mono placeholder:text-vscode-muted/50 w-full disabled:opacity-50" disabled={status === "loading"} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-vscode-bg border border-vscode-border rounded p-2.5 text-xs text-vscode-text outline-none focus:border-vscode-blue transition-colors font-mono placeholder:text-vscode-muted/50 w-full disabled:opacity-50" disabled={status === "loading"} />
            <input required type="text" placeholder="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="bg-vscode-bg border border-vscode-border rounded p-2.5 text-xs text-vscode-text outline-none focus:border-vscode-blue transition-colors font-mono placeholder:text-vscode-muted/50 w-full disabled:opacity-50" disabled={status === "loading"} />
          </div>
          <textarea required placeholder="Write your message here..." rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-vscode-bg border border-vscode-border rounded p-2.5 text-xs text-vscode-text outline-none focus:border-vscode-blue transition-colors resize-y font-mono placeholder:text-vscode-muted/50 disabled:opacity-50" disabled={status === "loading"} />
          
          <button
            type="submit"
            disabled={status === "loading"}
            className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded font-medium text-[11px] uppercase tracking-wider transition-all shadow-sm ${
              status === "loading" ? "bg-vscode-hover text-vscode-muted cursor-not-allowed" :
              status === "success" ? "bg-vscode-green text-white" :
              status === "error" ? "bg-vscode-error text-white" :
              "bg-[#238636] text-white hover:bg-[#2ea043]"
            }`}
          >
            {status === "loading" ? (
              <div className="w-4 h-4 border-2 border-vscode-muted border-t-transparent rounded-full animate-spin" />
            ) : status === "success" ? (
              <><Check size={14} className="shrink-0" /> Message Sent!</>
            ) : status === "error" ? (
              "Failed to Send"
            ) : (
              <><Send size={14} className="shrink-0" /> Send Message</>
            )}
          </button>
        </form>

      </motion.div>
    </div>
  );
}
