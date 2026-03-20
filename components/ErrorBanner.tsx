"use client";

import { motion } from "framer-motion";

const ERROR_MESSAGES: Record<string, string> = {
  "401": "This question has been put on hold — invalid API credentials.",
  "429": "Slow down. The Ghost needs a moment between hauntings.",
  default: "This question has been closed as 'unclear what you're asking.' Try again.",
};

interface ErrorBannerProps {
  error: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export function ErrorBanner({ error, onDismiss, onRetry }: ErrorBannerProps) {
  const friendlyMsg = ERROR_MESSAGES[error] || ERROR_MESSAGES.default;

  return (
    <motion.div
      className="mx-4 mb-3 flex items-start gap-3 px-4 py-3 bg-red-950/30 border border-red-800/40 rounded-sm"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-shrink-0 mt-0.5">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" className="text-red-400">
          <path d="M8 1L15 14H1L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8 6v4M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-red-300 font-medium mb-0.5">closed as error</p>
        <p className="text-xs font-mono text-red-400/80">{friendlyMsg}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs font-mono text-red-300 hover:text-so-orange border border-red-800/40 hover:border-so-orange/40 px-2 py-1 rounded-sm transition-colors duration-150"
          >
            retry
          </button>
        )}
        <button
          onClick={onDismiss}
          className="text-red-500/60 hover:text-red-400 text-xs font-mono transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}
