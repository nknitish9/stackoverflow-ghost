"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Message } from "@/lib/types";

function formatTime(date: Date) {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className={`px-2 py-1 text-[10px] font-mono border rounded transition-all duration-200 ${
        copied
          ? "text-ghost-green border-ghost-green/40 bg-ghost-green/10"
          : "text-ghost-muted bg-ghost-surface border-ghost-border hover:text-so-orange hover:border-so-orange/50"
      }`}
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}

function detectTags(content: string): string[] {
  const tags: string[] = ["answered"];
  const lower = content.toLowerCase();
  if (lower.includes("```javascript") || lower.includes("```js") || lower.includes("node")) tags.push("javascript");
  else if (lower.includes("```python") || lower.includes("django") || lower.includes("flask")) tags.push("python");
  else if (lower.includes("```typescript") || lower.includes("```tsx")) tags.push("typescript");
  else if (lower.includes("```css") || lower.includes("flexbox") || lower.includes("grid")) tags.push("css");
  else if (lower.includes("```sql") || lower.includes("database")) tags.push("sql");
  else if (lower.includes("```rust")) tags.push("rust");
  else if (lower.includes("```go")) tags.push("golang");
  else if (lower.includes("```java") && !lower.includes("javascript")) tags.push("java");
  else tags.push("ghost-mode");

  if (lower.includes("duplicate") || lower.includes("asked") || lower.includes("2013") || lower.includes("2009")) {
    tags.push("haunted");
  }
  return tags;
}

export function MessageBubble({ message }: { message: Message }) {
  const [votes, setVotes] = useState(message.votes ?? Math.floor(Math.random() * 40) + 3);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  const isAssistant = message.role === "assistant";

  const handleVote = (dir: "up" | "down") => {
    if (voted === dir) {
      setVoted(null);
      setVotes((v) => (dir === "up" ? v - 1 : v + 1));
    } else {
      const prev = voted;
      setVoted(dir);
      setVotes((v) => {
        let next = v;
        if (prev === "up") next -= 1;
        if (prev === "down") next += 1;
        if (dir === "up") next += 1;
        if (dir === "down") next -= 1;
        return next;
      });
    }
  };

  if (!isAssistant) {
    return (
      <motion.div
        className="flex items-start gap-3 justify-end"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex-1 min-w-0 flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-ghost-muted">{formatTime(message.timestamp)}</span>
            <span className="text-xs font-mono text-ghost-text font-medium">you</span>
          </div>
          <div className="max-w-[85%] sm:max-w-[80%] bg-ghost-surface border border-ghost-border rounded-sm px-4 py-3">
            <p className="text-sm font-mono text-ghost-text leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-ghost-surface border border-ghost-border flex items-center justify-center text-ghost-muted text-xs font-mono">
          usr
        </div>
      </motion.div>
    );
  }

  const tags = detectTags(message.content);

  return (
    <motion.div
      className="flex items-start gap-2 sm:gap-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Voting column — SO style */}
      <div className="flex flex-col items-center gap-1 pt-8 flex-shrink-0">
        <button
          onClick={() => handleVote("up")}
          className={`upvote-btn w-6 h-6 flex items-center justify-center rounded transition-all duration-150 ${
            voted === "up" ? "text-so-orange scale-110" : "text-ghost-muted hover:text-so-orange"
          }`}
          title="This answer helped"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill={voted === "up" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M12 4l8 8H4l8-8z" />
          </svg>
        </button>
        <motion.span
          className={`text-xs font-mono font-semibold tabular-nums ${
            votes > 0 ? "text-so-orange" : votes < 0 ? "text-red-500" : "text-ghost-muted"
          }`}
          key={votes}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {votes}
        </motion.span>
        <button
          onClick={() => handleVote("down")}
          className={`w-6 h-6 flex items-center justify-center rounded transition-all duration-150 ${
            voted === "down" ? "text-red-500 scale-110" : "text-ghost-muted hover:text-red-500"
          }`}
          title="This answer did not help"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill={voted === "down" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M12 20l-8-8h16l-8 8z" />
          </svg>
        </button>
      </div>

      {/* Answer content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <div className="w-5 h-5 flex items-center justify-center text-so-orange text-xs animate-flicker">👻</div>
          <span className="text-xs font-mono text-so-orange font-semibold">stackoverflow ghost</span>
          <span className="text-xs text-ghost-muted">·</span>
          <span className="text-xs text-ghost-muted">{formatTime(message.timestamp)}</span>
          <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-ghost-green/10 border border-ghost-green/20 text-ghost-green">
            ✓ accepted
          </span>
        </div>

        <div className="bg-ghost-card border border-ghost-border rounded-sm p-3 sm:p-4 hover:border-ghost-border-glow transition-colors duration-300">
          <div className="prose-ghost text-sm font-mono text-ghost-text leading-relaxed">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  const isInline = !match && !codeString.includes("\n");

                  if (isInline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <div className="relative my-3 group">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-ghost-surface border border-b-0 border-ghost-border rounded-t-sm">
                        <span className="text-[10px] font-mono text-ghost-muted uppercase tracking-wider">
                          {match?.[1] || "code"}
                        </span>
                        <CopyButton text={codeString} />
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match?.[1] || "text"}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          borderRadius: "0 0 4px 4px",
                          border: "1px solid #2A2A2A",
                          borderTop: "none",
                          background: "#0A0A0A",
                          fontSize: "0.78rem",
                          fontFamily: "'JetBrains Mono', monospace",
                          padding: "1rem",
                        }}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* SO-style footer tags — dynamic based on content */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-[#F4802415] text-so-orange border border-[#F4802430] cursor-default hover:bg-[#F4802425] transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
