"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTerminal, faTimes } from "@fortawesome/free-solid-svg-icons";

/* ── Easter egg responses ── */
interface LocalMsg {
  id: string;
  role: "user" | "assistant";
  text: string;
  isHtml?: boolean;
}

const NEOFETCH = `\x1b[34m       ▄▄▄▄▄▄▄       \x1b[0mvisitor@portfolio
\x1b[34m    ▄▀         ▀▄    \x1b[0m─────────────────
\x1b[34m  ▄▀    ●   ●    ▀▄  \x1b[0mOS: PortfolioOS 2.0.26 LTS
\x1b[34m ▄▀                ▀▄ \x1b[0mHost: Microsoft Azure / Vercel
\x1b[34m █   ▀▀▀▀▀▀▀▀▀▀▀   █ \x1b[0mKernel: Next.js 16.2.4
\x1b[34m █                  █ \x1b[0mShell: React 19 + TypeScript
\x1b[34m ▀▄  ▄▄▄▄▄▄▄▄▄▄  ▄▀ \x1b[0mDE: Three.js 0.184
\x1b[34m   ▀▄            ▄▀  \x1b[0mTheme: Space Universe [dark]
\x1b[34m     ▀▀▀▀▀▀▀▀▀▀▀     \x1b[0mEngine: Azure OpenAI (gpt-4.1-mini)
                        CPU: Vercel Edge Runtime
                        GPU: WebGL2 / R3F
                        Uptime: since 2025`;

const EASTER_EGGS: Record<string, string | { text: string; action?: string }> = {
  "sudo hire-me": {
    text: `sudo: permission granted ✓

┌──────────────────────────────────┐
│  🚀 LET'S BUILD SOMETHING!      │
│                                  │
│  📧 contact@armandoav.com        │
│  💼 linkedin.com/in/armando-av   │
│  🐙 github.com/ArmandoArV       │
│  🌐 armandoav.com                │
│                                  │
│  Status: Open to opportunities   │
└──────────────────────────────────┘`,
  },
  "rm -rf /": "rm: cannot remove '/': Permission denied 😏\nThis universe is protected by cosmic firewalls.",
  "rm -rf / --no-preserve-root": "Nice try, but even root can't destroy this universe 🛡️",
  neofetch: NEOFETCH,
  exit: "There is no escape from this universe 🚀\nTry exploring a planet instead!",
  hack: {
    text: `[sudo] password for visitor: ********
Access granted...

Initializing exploit framework...
[██████████████████████████] 100%

Just kidding 😄 No systems were harmed.
But seriously, Armando does know offensive security (C).
Type 'cat skills.txt' to see all his skills.`,
  },
  help: `Available commands:
  whoami          — Who is Armando?
  ls projects/    — List projects
  cat skills.txt  — Show technical skills
  cat contact.txt — Show contact info
  cat resume.pdf  — Download resume
  neofetch        — System info
  sudo hire-me    — Hire Armando
  hack            — Try to hack the system
  rm -rf /        — Try to delete everything
  clear           — Clear terminal
  exit            — Try to exit
  help            — Show this help

Or just ask me anything in natural language!`,
  "cat resume.pdf": { text: "Downloading resume...", action: "download-resume" },
};

let localIdCounter = 0;

export default function AstronautConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<LocalMsg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onToolCall({ toolCall }) {
      if (toolCall.toolName === "navigate") {
        const { planet } = toolCall.input as { planet: string };
        document
          .getElementById("explore")
          ?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("navigate-planet", { detail: planet })
          );
        }, 400);
      }
    },
    onError(error) {
      console.error("Chat error:", error);
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, localMessages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const toggle = useCallback(() => setIsOpen((p) => !p), []);

  const addLocalMessage = useCallback((role: "user" | "assistant", text: string) => {
    const id = `local-${++localIdCounter}`;
    setLocalMessages((prev) => [...prev, { id, role, text }]);
  }, []);

  const handleSubmit = useCallback(
    (e?: { preventDefault?: () => void }) => {
      e?.preventDefault?.();
      const text = input.trim();
      if (!text || isLoading) return;
      setInput("");

      const cmd = text.toLowerCase();

      // Handle clear
      if (cmd === "clear") {
        setLocalMessages([]);
        setMessages([]);
        return;
      }

      // Check easter eggs
      const egg = EASTER_EGGS[cmd];
      if (egg) {
        addLocalMessage("user", text);
        const response = typeof egg === "string" ? egg : egg.text;
        setTimeout(() => {
          addLocalMessage("assistant", response);
          if (typeof egg === "object" && egg.action === "download-resume") {
            const link = document.createElement("a");
            link.href = "/Armando_Arredondo_Valle_Resume.pdf";
            link.download = "Armando_Arredondo_Valle_Resume.pdf";
            link.click();
          }
        }, 300);
        return;
      }

      // Normal AI message
      sendMessage({ text });
    },
    [input, isLoading, sendMessage, addLocalMessage, setMessages]
  );

  const sendQuickPrompt = useCallback(
    (prompt: string) => {
      if (isLoading) return;
      const cmd = prompt.toLowerCase();
      const egg = EASTER_EGGS[cmd];
      if (egg) {
        addLocalMessage("user", prompt);
        const response = typeof egg === "string" ? egg : egg.text;
        setTimeout(() => addLocalMessage("assistant", response), 300);
        return;
      }
      sendMessage({ text: prompt });
    },
    [isLoading, sendMessage, addLocalMessage]
  );

  // Merge local + AI messages by insertion order
  const allMessages = [
    ...localMessages.map((m) => ({
      id: m.id,
      role: m.role,
      source: "local" as const,
      text: m.text,
    })),
    ...messages
      .filter(
        (msg) =>
          !(
            msg.role === "assistant" &&
            msg.parts?.every((p) => p.type === "tool-invocation")
          )
      )
      .map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        source: "ai" as const,
        text: msg.parts
          .filter((p) => p.type === "text")
          .map((p) => (p.type === "text" ? p.text : ""))
          .join(""),
      })),
  ];

  return (
    <>
      {/* Floating terminal button */}
      <motion.button
        onClick={toggle}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-slate-900 border-2 border-blue-500/40 text-blue-400 shadow-lg shadow-blue-500/20 flex items-center justify-center hover:scale-110 hover:border-blue-400 transition-all"
        whileHover={{ rotate: [0, -5, 5, 0] }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open terminal"
      >
        <FontAwesomeIcon
          icon={isOpen ? faTimes : faTerminal}
          className="w-6 h-6"
        />
      </motion.button>

      {/* Terminal window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 left-6 z-40 w-[420px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden border border-slate-700/50"
          >
            {/* ── Title bar ── */}
            <div className="flex items-center h-9 px-3 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 select-none">
              <div className="flex items-center gap-[7px]">
                <button
                  onClick={toggle}
                  className="w-[13px] h-[13px] rounded-full bg-red-500 hover:brightness-110 transition-all group relative"
                  aria-label="Close"
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center text-[8px] text-black/70 font-bold">
                    ×
                  </span>
                </button>
                <div className="w-[13px] h-[13px] rounded-full bg-yellow-500" />
                <div className="w-[13px] h-[13px] rounded-full bg-green-500" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[12px] text-slate-400 font-mono">
                  armando@portfolio: ~
                </span>
              </div>
              <div className="w-[60px]" />
            </div>

            {/* ── Terminal body ── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto bg-slate-950/95 backdrop-blur-md px-3 py-3 font-mono text-[13px] leading-relaxed scrollbar-thin scrollbar-thumb-blue-500/20"
            >
              {/* Boot message */}
              {allMessages.length === 0 && (
                <div className="space-y-1 mb-3">
                  <p className="text-green-500/70">
                    GNU/Portfolio 2.0.26 LTS (Armando Arredondo Valle)
                  </p>
                  <p className="text-green-500/70">
                    * Documentation:&nbsp;
                    <span className="text-blue-400">
                      https://armandoav.com
                    </span>
                  </p>
                  <p className="text-green-500/70">
                    * System: Microsoft Azure / Next.js / Three.js
                  </p>
                  <p className="text-green-500/70">
                    Last login: {new Date().toUTCString()}
                  </p>
                  <p className="text-green-500/70 mt-2">
                    Type a command or ask anything. Try{" "}
                    <span className="text-green-300">help</span> for commands.
                  </p>
                </div>
              )}

              {/* All messages (local + AI) */}
              {allMessages.map((msg) => {
                if (msg.role === "user") {
                  return (
                    <div key={msg.id} className="mb-1">
                      <span className="text-green-400 font-bold">
                        visitor@portfolio
                      </span>
                      <span className="text-slate-500">:</span>
                      <span className="text-indigo-400 font-bold">~</span>
                      <span className="text-slate-500">$ </span>
                      <span className="text-green-300">{msg.text}</span>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="mb-3 pl-0">
                    <p className="text-green-300/90 whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>
                );
              })}

              {/* Loading cursor blink */}
              {isLoading && (
                <div className="mb-1">
                  <span className="text-green-400 font-bold">
                    system@portfolio
                  </span>
                  <span className="text-slate-500">:</span>
                  <span className="text-blue-400 font-bold">~</span>
                  <span className="text-slate-500">$ </span>
                  <span className="text-green-300 animate-pulse">
                    processing
                  </span>
                  <span className="inline-block w-[7px] h-[14px] bg-green-400 ml-0.5 animate-[blink_1s_steps(1)_infinite]" />
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-2">
                  <span className="text-red-400">
                    bash: error: {error.message || "Something went wrong. Try again."}
                  </span>
                </div>
              )}
            </div>

            {/* Quick commands */}
            <div className="bg-slate-950/95 px-3 pb-2 flex flex-wrap gap-1.5 font-mono">
              {[
                { cmd: "whoami", label: "whoami" },
                { cmd: "ls projects/", label: "ls projects/" },
                { cmd: "cat skills.txt", label: "cat skills.txt" },
                { cmd: "neofetch", label: "neofetch" },
                { cmd: "help", label: "help" },
              ].map(({ cmd, label }) => (
                <button
                  key={cmd}
                  onClick={() => sendQuickPrompt(cmd)}
                  disabled={isLoading}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/40 text-green-400 hover:border-green-400/60 hover:text-green-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  $ {label}
                </button>
              ))}
            </div>

            {/* ── Input prompt ── */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center bg-slate-950/95 border-t border-slate-800/50 px-3 py-2 font-mono text-[13px]"
            >
              <span className="text-green-400 font-bold shrink-0">
                visitor@portfolio
              </span>
              <span className="text-slate-500 shrink-0">:</span>
              <span className="text-indigo-400 font-bold shrink-0">~</span>
              <span className="text-slate-500 shrink-0 mr-1">$ </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder=""
                className="flex-1 bg-transparent text-green-300 placeholder:text-slate-600 focus:outline-none caret-green-400 min-w-0"
                disabled={isLoading}
                autoComplete="off"
                spellCheck={false}
              />
              {!input && !isLoading && (
                <span className="w-[7px] h-[14px] bg-green-400 animate-[blink_1s_steps(1)_infinite] shrink-0" />
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
