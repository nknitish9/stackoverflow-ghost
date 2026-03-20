"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Message } from "@/lib/types";
import { MessageBubble } from "@/components/MessageBubble";
import { TypingIndicator } from "@/components/TypingIndicator";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBanner } from "@/components/ErrorBanner";
import { ChatInput } from "@/components/ChatInput";
import { StackOverflowLogo } from "@/components/GhostIcon";

const MAX_MESSAGES = 100;
const MAX_HISTORY_SENT = 20; // Only send last N messages to API for token efficiency

let msgIdCounter = 0;
function newId() {
  return `msg-${++msgIdCounter}-${Date.now()}`;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const loadingCycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Cycle loading messages
  useEffect(() => {
    if (isLoading) {
      loadingCycleRef.current = setInterval(() => {
        setLoadingIndex((i) => i + 1);
      }, 2800);
    } else {
      if (loadingCycleRef.current) clearInterval(loadingCycleRef.current);
      setLoadingIndex(0);
    }
    return () => {
      if (loadingCycleRef.current) clearInterval(loadingCycleRef.current);
    };
  }, [isLoading]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Client-side validation
    if (content.length > 4000) {
      setError("Message too long. Keep it under 4000 characters.");
      return;
    }

    if (messages.length >= MAX_MESSAGES) {
      setError("Conversation limit reached. Start a new conversation.");
      return;
    }

    setError(null);
    setLastFailedMessage(null);

    const userMessage: Message = {
      id: newId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Only send the last N messages to save tokens
      const allMessages = [...messages, userMessage];
      const historyToSend = allMessages.slice(-MAX_HISTORY_SENT);
      const history = historyToSend.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || String(res.status));
      }

      const assistantMessage: Message = {
        id: newId(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        votes: Math.floor(Math.random() * 60) + 5,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request timed out. The Ghost took too long.");
      } else {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
      }
      setLastFailedMessage(content.trim());
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleRetry = useCallback(() => {
    if (lastFailedMessage) {
      setError(null);
      sendMessage(lastFailedMessage);
    }
  }, [lastFailedMessage, sendMessage]);

  const handleClear = () => {
    setMessages([]);
    setError(null);
    setLastFailedMessage(null);
  };

  return (
    <div className="flex flex-col h-screen bg-ghost-bg relative z-10">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-ghost-border bg-ghost-surface/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo area */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <StackOverflowLogo className="w-5 h-6 opacity-60" />
              <div className="absolute -top-1 -right-1 w-3 h-3 flex items-center justify-center text-[8px]">
                👻
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-mono font-semibold text-ghost-text tracking-tight">
                  stackoverflow
                  <span className="text-so-orange animate-flicker"> ghost</span>
                </h1>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-so-orange/10 text-so-orange border border-so-orange/20">
                  BETA
                </span>
              </div>
              <p className="text-[10px] font-mono text-ghost-muted leading-none mt-0.5 hidden sm:block">
                your questions were answered in 2009
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-ghost-green animate-pulse-slow" />
              <span className="text-[10px] font-mono text-ghost-muted">haunting</span>
            </div>

            {/* Message count */}
            {messages.length > 0 && (
              <span className="text-[10px] font-mono text-ghost-muted border border-ghost-border px-2 py-1 rounded-sm">
                {Math.ceil(messages.length / 2)} Q{Math.ceil(messages.length / 2) !== 1 ? "s" : ""}
              </span>
            )}

            {/* Clear */}
            {messages.length > 0 && (
              <button
                onClick={handleClear}
                className="text-[10px] font-mono text-ghost-muted hover:text-red-400 border border-ghost-border hover:border-red-800/50 px-2 py-1 rounded-sm transition-all duration-150"
                title="Clear conversation"
              >
                clear
              </button>
            )}

            {/* GitHub link */}
            <a
              href="https://github.com/nknitish9/stackoverflow-ghost"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ghost-muted hover:text-so-orange transition-colors duration-150"
              title="View on GitHub"
            >
              <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* SO-style top bar decoration */}
      <div className="flex-shrink-0 h-px bg-gradient-to-r from-transparent via-so-orange/30 to-transparent" />

      {/* Main chat area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6">
          {messages.length === 0 && !isLoading ? (
            <EmptyState onSuggest={sendMessage} />
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <AnimatePresence>
                {isLoading && <TypingIndicator index={loadingIndex} />}
              </AnimatePresence>
            </div>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>
      </main>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <ErrorBanner
            error={error}
            onDismiss={() => setError(null)}
            onRetry={lastFailedMessage ? handleRetry : undefined}
          />
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="flex-shrink-0 max-w-4xl w-full mx-auto">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
