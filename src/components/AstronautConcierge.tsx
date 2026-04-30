"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faTimes,
  faUserAstronaut,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

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

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when opened
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
      {/* Floating astronaut button */}
      <motion.button
        onClick={toggle}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ rotate: [0, -10, 10, 0] }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open AI concierge"
      >
        <FontAwesomeIcon
          icon={isOpen ? faTimes : faUserAstronaut}
          className="w-6 h-6"
        />
      </motion.button>

      {/* Chat drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 left-6 z-40 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/50 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUserAstronaut}
                  className="w-4 h-4 text-white"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Space Concierge
                </p>
                <p className="text-[11px] text-slate-400">
                  Ask me anything about Armando
                </p>
              </div>
              <button
                onClick={toggle}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin"
            >
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FontAwesomeIcon
                      icon={faRocket}
                      className="w-3 h-3 text-white"
                    />
                  </div>
                  <div className="bg-slate-800/80 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%]">
                    <p className="text-sm text-slate-200">
                      Hey! 👋 I&apos;m Armando&apos;s AI concierge. Ask me
                      anything — what technologies he uses, his projects, work
                      experience, or just say &quot;take me to his
                      projects&quot; and I&apos;ll fly you there!
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg) => {
                if (
                  msg.role === "assistant" &&
                  msg.parts &&
                  msg.parts.every(
                    (p) => p.type === "tool-invocation"
                  )
                ) {
                  return null;
                }

                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FontAwesomeIcon
                          icon={faRocket}
                          className="w-3 h-3 text-white"
                        />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-3 py-2 max-w-[85%] text-sm ${
                        isUser
                          ? "bg-indigo-500/20 border border-indigo-400/30 text-indigo-100 rounded-tr-sm"
                          : "bg-slate-800/80 text-slate-200 rounded-tl-sm"
                      }`}
                    >
                      {msg.parts
                        .filter((p) => p.type === "text")
                        .map((p, i) => (
                          <p key={i} className="whitespace-pre-wrap">
                            {p.type === "text" ? p.text : ""}
                          </p>
                        ))}
                    </div>
                  </div>
                );
              })}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon
                      icon={faRocket}
                      className="w-3 h-3 text-white animate-bounce"
                    />
                  </div>
                  <div className="bg-slate-800/80 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="text-center text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">
                  Something went wrong. Try again!
                </div>
              )}
            </div>

            {/* Quick prompts (when empty) */}
            {messages.length === 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {[
                  "What does Armando do?",
                  "Show me his projects",
                  "Tech skills?",
                  "How to contact him?",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendQuickPrompt(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/30 text-slate-300 hover:border-indigo-400/50 hover:text-indigo-300 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 border-t border-slate-700/50"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Armando..."
                className="flex-1 bg-slate-800/60 border border-slate-700/30 rounded-full px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400/50 transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-9 h-9 rounded-full bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-700 disabled:text-slate-500 text-white flex items-center justify-center transition-colors"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
