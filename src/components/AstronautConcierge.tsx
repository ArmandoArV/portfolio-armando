"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTerminal, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function AstronautConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error } = useChat({
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
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const toggle = useCallback(() => setIsOpen((p) => !p), []);

  const handleSubmit = useCallback(
    (e?: { preventDefault?: () => void }) => {
      e?.preventDefault?.();
      const text = input.trim();
      if (!text || isLoading) return;
      setInput("");
      sendMessage({ text });
    },
    [input, isLoading, sendMessage]
  );

  const sendQuickPrompt = useCallback(
    (prompt: string) => {
      if (isLoading) return;
      sendMessage({ text: prompt });
    },
    [isLoading, sendMessage]
  );

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
              {/* Traffic lights */}
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
              {/* Title */}
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
              {messages.length === 0 && (
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
                    Type a command or ask me anything about Armando.
                  </p>
                </div>
              )}

              {/* Messages */}
              {messages.map((msg) => {
                if (
                  msg.role === "assistant" &&
                  msg.parts &&
                  msg.parts.every((p) => p.type === "tool-invocation")
                ) {
                  return null;
                }

                const isUser = msg.role === "user";
                const textParts = msg.parts.filter((p) => p.type === "text");

                if (isUser) {
                  return (
                    <div key={msg.id} className="mb-1">
                      <span className="text-green-400 font-bold">
                        visitor@portfolio
                      </span>
                      <span className="text-slate-500">:</span>
                      <span className="text-indigo-400 font-bold">~</span>
                      <span className="text-slate-500">$ </span>
                      <span className="text-green-300">
                        {textParts.map((p) => (p.type === "text" ? p.text : "")).join("")}
                      </span>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="mb-3 pl-0">
                    {textParts.map((p, i) => (
                      <p
                        key={i}
                        className="text-green-300/90 whitespace-pre-wrap"
                      >
                        {p.type === "text" ? p.text : ""}
                      </p>
                    ))}
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
                { cmd: "cat contact.txt", label: "cat contact.txt" },
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
              {/* Blinking cursor when input is empty and focused */}
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
