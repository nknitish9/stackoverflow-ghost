"use client";

import { useState, useRef, KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const MAX_CHARS = 4000;

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading || trimmed.length > MAX_CHARS) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  };

  const isOverLimit = value.length > MAX_CHARS;

  return (
    <div className="border-t border-ghost-border bg-ghost-bg/95 backdrop-blur-sm px-3 sm:px-4 py-3">
      {/* Hint */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px flex-1 bg-ghost-border" />
        <span className="text-[9px] sm:text-[10px] font-mono text-ghost-muted/50 px-2">
          shift+enter for newline · enter to send
        </span>
        <div className="h-px flex-1 bg-ghost-border" />
      </div>

      <div
        className={`flex items-end gap-2 bg-ghost-card border rounded-sm transition-all duration-200 ${
          isOverLimit
            ? "border-red-500/60 shadow-[0_0_0_1px_rgba(239,68,68,0.15)]"
            : isLoading
            ? "border-ghost-border"
            : "border-ghost-border focus-within:border-so-orange/60 focus-within:shadow-[0_0_0_1px_rgba(244,128,36,0.15)]"
        }`}
      >
        {/* Input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask your question. I've seen worse."
          disabled={isLoading || disabled}
          rows={1}
          className="flex-1 min-w-0 bg-transparent px-3 sm:px-4 py-3 text-sm font-mono text-ghost-text placeholder-ghost-muted/50 resize-none focus:outline-none disabled:opacity-50 leading-relaxed"
          style={{ minHeight: "44px", maxHeight: "160px" }}
        />

        {/* Send */}
        <div className="flex-shrink-0 p-2">
          <button
            onClick={handleSend}
            disabled={!value.trim() || isLoading || isOverLimit}
            className={`w-8 h-8 flex items-center justify-center rounded-sm font-mono text-xs transition-all duration-150 ${
              value.trim() && !isLoading && !isOverLimit
                ? "bg-so-orange text-white hover:bg-so-orange-dark active:scale-95 shadow-orange-sm"
                : "bg-ghost-surface text-ghost-muted cursor-not-allowed border border-ghost-border"
            }`}
            title="Send (Enter)"
          >
            {isLoading ? (
              <span className="w-3 h-3 border border-ghost-muted/50 border-t-so-orange rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 1L1 6l5 2 2 5 6-13z" />
                <path d="M6 8l4-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[9px] sm:text-[10px] font-mono text-ghost-muted/40">
          haunted by 20 years of SO grief
        </span>
        <span className={`text-[9px] sm:text-[10px] font-mono transition-colors ${
          isOverLimit ? "text-red-400" : "text-ghost-muted/40"
        }`}>
          {value.length > 0 && `${value.length}/${MAX_CHARS}`}
        </span>
      </div>
    </div>
  );
}
