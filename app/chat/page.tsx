"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { portfolioData } from "@/data/portfolio";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function MobileChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm Aswin's AI assistant. Ask me anything about his projects, skills, or experience!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error}` },
        ]);
      } else {
        const assistantMessage = data.choices[0].message.content;
        setMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Hi! I'm Aswin's AI assistant. Ask me anything about his projects, skills, or experience!`,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 bg-vscode-bg flex flex-col text-vscode-text select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-vscode-border bg-vscode-sidebar shrink-0 pt-safe">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 text-vscode-muted hover:text-vscode-text transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-vscode-blue/20 flex items-center justify-center text-vscode-blue">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-sm font-bold leading-none">Copilot Chat</div>
              <div className="text-[10px] text-vscode-green mt-0.5 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-vscode-green animate-pulse" />
                 OpenRouter AI Online
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={resetChat}
          className="p-2 text-vscode-muted hover:text-vscode-text transition-colors"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth pb-20"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div className={`flex items-center gap-2 mb-0.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`p-1 rounded bg-vscode-hover ${msg.role === "user" ? "text-vscode-blue" : "text-vscode-cyan"}`}>
                  {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                </div>
                <span className="text-[9px] font-bold text-vscode-muted uppercase tracking-wider">
                  {msg.role === "user" ? "You" : "Assistant"}
                </span>
              </div>
              
              <div className={`max-w-[85%] text-xs leading-relaxed p-3.5 rounded-2xl border ${
                msg.role === "user" 
                ? "bg-vscode-blue/20 border-vscode-blue/30 text-vscode-text rounded-tr-none" 
                : "bg-vscode-sidebar border-vscode-border/50 text-vscode-text/90 rounded-tl-none"
              }`}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li>{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-vscode-blue">{children}</strong>,
                    code: ({ children }) => <code className="bg-vscode-hover px-1 rounded text-vscode-cyan">{children}</code>,
                    a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-vscode-blue hover:underline">{children}</a>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-2 items-start"
          >
             <div className="flex items-center gap-2 mb-0.5">
                <div className="p-1 rounded bg-vscode-hover text-vscode-cyan">
                  <Bot size={12} />
                </div>
                <span className="text-[9px] font-bold text-vscode-muted uppercase tracking-wider">Assistant</span>
             </div>
             <div className="flex gap-1.5 p-3.5 rounded-2xl border border-vscode-border/50 bg-vscode-sidebar rounded-tl-none">
                <div className="w-1.5 h-1.5 rounded-full bg-vscode-muted/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-vscode-muted/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-vscode-muted/40 animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-vscode-sidebar border-t border-vscode-border pb-safe">
        <div className="relative flex items-end gap-2 bg-vscode-bg border border-vscode-border rounded-2xl p-2 focus-within:border-vscode-blue transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message assistant..."
            className="flex-1 bg-transparent border-none py-2 px-2 text-sm text-vscode-text focus:outline-none placeholder:text-vscode-muted/50 resize-none max-h-32"
            rows={1}
            style={{ height: 'auto' }}
            onInput={(e) => {
               const target = e.target as HTMLTextAreaElement;
               target.style.height = 'auto';
               target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl transition-all ${
              input.trim() && !isLoading 
              ? "bg-vscode-blue text-white shadow-lg shadow-vscode-blue/20" 
              : "text-vscode-muted bg-vscode-hover opacity-50"
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
