"use client";

import { motion, AnimatePresence } from "framer-motion";

const LOADING_MESSAGES = [
  "Searching 14 years of closed questions…",
  "Consulting the spirit of Jon Skeet…",
  "Checking if this was marked duplicate in 2011…",
  "Sighing deeply at your question…",
  "Cross-referencing 47 duplicate threads…",
  "Haunting the SO archives…",
  "The accepted answer from 2008 is wrong. Finding the real one…",
];

export function TypingIndicator({ index }: { index: number }) {
  const message = LOADING_MESSAGES[index % LOADING_MESSAGES.length];

  return (
    <motion.div
      className="flex items-start gap-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ghost avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-ghost-card border border-ghost-border flex items-center justify-center text-so-orange text-sm shadow-orange-sm">
        <motion.span
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          👻
        </motion.span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-mono text-so-orange font-medium">stackoverflow ghost</span>
          <span className="text-xs text-ghost-muted">·</span>
          <span className="text-xs text-ghost-muted animate-pulse">channeling...</span>
        </div>

        <div className="bg-ghost-card border border-ghost-border rounded-sm p-3 inline-flex items-center gap-3 max-w-sm sm:max-w-md">
          {/* Dots */}
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-so-orange"
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={message}
              className="text-xs text-ghost-muted font-mono italic"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
            >
              {message}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
