"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, X, ChevronDown, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { portfolioData } from "@/data/portfolio";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  width?: number;
}

export default function ChatPanel({ isOpen, onClose, width = 350 }: ChatPanelProps) {
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

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="hidden md:flex flex-col bg-vscode-sidebar border-l border-vscode-border h-full relative z-[45]"
      style={{ width }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-vscode-border shrink-0 bg-vscode-sidebar/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-vscode-blue" />
          <span className="text-[11px] uppercase tracking-widest text-vscode-text font-semibold">AI CHAT</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={resetChat}
            className="p-1 hover:bg-vscode-hover rounded text-vscode-muted hover:text-vscode-text transition-colors"
            title="Reset Chat"
          >
            <RotateCcw size={14} />
          </button>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-vscode-hover rounded text-vscode-muted hover:text-vscode-text transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>


 
       {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div className={`flex items-center gap-2 mb-1 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`p-1 rounded bg-vscode-hover ${msg.role === "user" ? "text-vscode-blue" : "text-vscode-cyan"}`}>
                  {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <span className="text-[10px] font-bold text-vscode-muted uppercase tracking-wider">
                  {msg.role === "user" ? "You" : "Assistant"}
                </span>
              </div>
              
              <div className={`max-w-[90%] text-xs leading-relaxed p-3 rounded-lg border ${
                msg.role === "user" 
                ? "bg-vscode-blue/10 border-vscode-blue/30 text-vscode-text ml-4" 
                : "bg-vscode-bg border-vscode-border/50 text-vscode-text/90 mr-4 shadow-lg shadow-black/20"
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
             <div className="flex items-center gap-2 mb-1">
                <div className="p-1 rounded bg-vscode-hover text-vscode-cyan">
                  <Bot size={14} />
                </div>
                <span className="text-[10px] font-bold text-vscode-muted uppercase tracking-wider">Assistant</span>
             </div>
             <div className="flex gap-1.5 p-3 rounded-lg border border-vscode-border/50 bg-vscode-bg">
                <div className="w-1.5 h-1.5 rounded-full bg-vscode-muted/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-vscode-muted/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-vscode-muted/40 animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-vscode-border bg-[#1e1e1e]">
        <div className="relative bg-[#2d2d2d] border border-vscode-border rounded-lg overflow-hidden focus-within:border-vscode-blue transition-colors shadow-inner shadow-black/20">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me anything..."
            className="w-full bg-transparent border-none py-2 px-3 text-xs text-vscode-text focus:outline-none placeholder:text-vscode-muted/50 resize-none min-h-[40px]"
            rows={1}
          />
          
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-1.5 bg-vscode-bg/50 px-1.5 py-1 rounded text-[10px] text-vscode-muted hover:text-vscode-text transition-colors cursor-default group">
              <Bot size={12} className="text-vscode-cyan group-hover:scale-110 transition-transform" />
              <span className="font-medium">OpenRouter AI</span>
              <ChevronDown size={10} className="opacity-50" />
            </div>
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-1.5 rounded-md transition-all ${
                input.trim() && !isLoading 
                ? "bg-vscode-blue text-white shadow-lg shadow-vscode-blue/20" 
                : "text-vscode-muted opacity-50"
              }`}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[9px] text-vscode-muted/40 uppercase tracking-[0.1em] font-medium">
           <div className="w-1 h-1 rounded-full bg-vscode-green" />
           <span>System Online</span>
        </div>
      </div>
    </motion.div>
  );
}
