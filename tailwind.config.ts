import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'IBM Plex Mono'", "monospace"],
        code: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        so: {
          orange: "#F48024",
          "orange-dark": "#C0601A",
          "orange-glow": "#F4802440",
        },
        ghost: {
          bg: "#0D0D0D",
          surface: "#141414",
          card: "#1A1A1A",
          border: "#2A2A2A",
          "border-glow": "#F4802420",
          text: "#E8E0D4",
          muted: "#6B6460",
          green: "#4ADE80",
          "green-dim": "#22C55E60",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        flicker: "flicker 4s linear infinite",
        "fade-up": "fadeUp 0.4s ease forwards",
        "typing-dot": "typingDot 1.4s infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        flicker: {
          "0%, 95%, 100%": { opacity: "1" },
          "96%": { opacity: "0.6" },
          "97%": { opacity: "1" },
          "98%": { opacity: "0.4" },
          "99%": { opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        typingDot: {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "30%": { transform: "translateY(-6px)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      boxShadow: {
        "orange-glow": "0 0 20px #F4802430, 0 0 60px #F4802415",
        "orange-sm": "0 0 8px #F4802440",
        "green-glow": "0 0 12px #4ADE8040",
      },
    },
  },
  plugins: [],
};

export default config;
