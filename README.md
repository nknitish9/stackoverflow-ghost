# 👻 StackOverflow Ghost

> *"Your question has been answered. Reluctantly."*

A haunted coding assistant with serious personality. The Ghost is the collective spirit of every developer who ever had their question closed as "duplicate" — deeply knowledgeable, slightly sardonic, but always helpful.

**Live demo:** [stackoverflow-ghost.vercel.app](https://stackoverflow-ghost.vercel.app)  

---

## Why This Topic?

Every developer has a StackOverflow horror story. Questions closed as duplicates when they aren't. Accepted answers from 2009 with broken links. "Have you tried Google?" comments. The StackOverflow Ghost embodies that shared grief — it knows everything, sighs dramatically, but always gives you the real answer.

It's a topic with:
- **Instant recognition** — every developer gets the joke immediately
- **Rich UI language** — SO has iconic design patterns (voting, tags, code blocks) to riff on
- **A personality with depth** — the ghost isn't just a gimmick, it shapes every response

---

## What I Built

A full-stack Next.js chatbot with:

### The Experience
- **Empty state** — ghost mascot with fake SO stats and suggested questions to get users started fast
- **Loading states** — rotating sardonic messages like *"Searching 14 years of closed questions…"* and *"Consulting the spirit of Jon Skeet…"*
- **Error states** — styled as SO closure notices (*"This question has been closed as 'unclear what you're asking.'"*)
- **Upvote/downvote** — each assistant answer has functional vote buttons with live counters, just like SO
- **Code blocks** — syntax-highlighted with language labels and one-click copy, styled like SO answers
- **SO answer tags** — `answered`, `ghost-mode`, `haunted` tags on every response
- **Typing indicator** — animated dots with rotating flavor text

### The Design
- Dark terminal aesthetic with SO orange (`#F48024`) as the accent
- `IBM Plex Mono` for the ghost's voice, `JetBrains Mono` for code
- Scanline animation, noise texture overlay, subtle flickering ghost icon
- Fully responsive — works on mobile, tablet, desktop
- Custom scrollbar, text selection highlight in SO orange

### The AI
- Powered by Groq API (llama-3.3-70b-versatile) — fast inference, free tier
- System prompt crafts the Ghost's personality: expert but haunted, helpful but passive-aggressive
- Full conversation history sent on each request for context
- Markdown + syntax highlighting rendered client-side

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| AI | Groq API (llama-3.3-70b-versatile) |
| Markdown | react-markdown + react-syntax-highlighter |
| Animations | Framer Motion + CSS keyframes |
| Deployment | Vercel |

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/nknitish9/stackoverflow-ghost
cd stackoverflow-ghost

# 2. Install dependencies
npm install

# 3. Set your API key
cp .env.local.example .env.local
# Edit .env.local and add your GROQ_API_KEY (free at console.groq.com)

# 4. Run locally
npm run dev
# Open http://localhost:3000
```

---

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable in Vercel dashboard:
# GROQ_API_KEY = gsk_...
```

Or connect your GitHub repo to Vercel for automatic deploys.

---

## Project Structure

```
stackoverflow-ghost/
├── app/
│   ├── api/chat/route.ts   # Groq API endpoint
│   ├── globals.css          # Global styles + animations
│   ├── layout.tsx           # Root layout + font loading
│   └── page.tsx             # Main chat UI
├── components/
│   ├── ChatInput.tsx        # Textarea + send button
│   ├── EmptyState.tsx       # Welcome screen + suggestions
│   ├── ErrorBanner.tsx      # SO-style error display
│   ├── GhostIcon.tsx        # SVG icons
│   ├── MessageBubble.tsx    # Chat messages with voting
│   └── TypingIndicator.tsx  # Loading state
├── lib/
│   └── types.ts             # TypeScript interfaces
└── README.md
```
