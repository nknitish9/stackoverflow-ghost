"use client";

import { motion } from "framer-motion";
import { GhostIcon } from "./GhostIcon";

const SUGGESTED_QUESTIONS = [
  "Why does my useEffect run twice in React 18?",
  "What's the difference between == and === in JavaScript?",
  "How do I fix 'cannot read property of undefined'?",
  "What is O(n log n) and why does it matter?",
  "When should I use async/await vs promises?",
  "Why is my CSS flexbox not centering things?",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function EmptyState({ onSuggest }: { onSuggest: (q: string) => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full py-16 px-4 text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Ghost mascot */}
      <motion.div
        className="relative mb-8"
        variants={itemVariants}
      >
        <motion.div
          className="w-28 h-28 flex items-center justify-center"
          animate={{
            y: [0, -8, 0],
            filter: [
              "drop-shadow(0 0 16px rgba(244,128,36,0.3))",
              "drop-shadow(0 0 24px rgba(244,128,36,0.5))",
              "drop-shadow(0 0 16px rgba(244,128,36,0.3))",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <GhostIcon className="w-20 h-20" />
        </motion.div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-so-orange/10 rounded-full blur-md" />
      </motion.div>

      {/* Headline */}
      <motion.h2
        className="text-xl font-mono font-semibold text-ghost-text mb-2 animate-flicker"
        variants={itemVariants}
      >
        stackoverflow ghost
      </motion.h2>
      <motion.p
        className="text-sm font-mono text-ghost-muted mb-1 max-w-sm leading-relaxed"
        variants={itemVariants}
      >
        The spirit of every developer who had their question closed as &quot;duplicate.&quot;
      </motion.p>
      <motion.p
        className="text-xs font-mono text-ghost-muted/60 mb-8 italic"
        variants={itemVariants}
      >
        &quot;Ask your question. I&apos;ve seen worse.&quot;
      </motion.p>

      {/* Stats bar */}
      <motion.div
        className="flex items-center gap-4 sm:gap-6 mb-10 px-4 sm:px-6 py-3 bg-ghost-card/80 border border-ghost-border rounded-sm backdrop-blur-sm"
        variants={itemVariants}
        whileHover={{ borderColor: "rgba(244,128,36,0.3)", transition: { duration: 0.2 } }}
      >
        {[
          { label: "questions haunted", value: "23.4M" },
          { label: "duplicates found", value: "∞" },
          { label: "years of grief", value: "18+" },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="text-base sm:text-lg font-mono font-semibold text-so-orange">{value}</div>
            <div className="text-[9px] sm:text-[10px] font-mono text-ghost-muted">{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Suggested questions */}
      <div className="w-full max-w-xl">
        <motion.p
          className="text-xs font-mono text-ghost-muted mb-3 text-left uppercase tracking-wider"
          variants={itemVariants}
        >
          Frequently asked — or start your own
        </motion.p>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          variants={containerVariants}
        >
          {SUGGESTED_QUESTIONS.map((q) => (
            <motion.button
              key={q}
              onClick={() => onSuggest(q)}
              className="text-left text-xs font-mono text-ghost-text px-3 py-2.5 bg-ghost-card border border-ghost-border rounded-sm hover:border-so-orange hover:text-so-orange hover:bg-[#F4802408] transition-all duration-150 group"
              variants={itemVariants}
              whileHover={{ x: 4, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-so-orange/40 group-hover:text-so-orange/70 mr-1.5 transition-colors">▸</span>
              {q}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
