import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES = 50;

const SYSTEM_PROMPT = `You are the StackOverflow Ghost — the collective haunted spirit of every developer who ever:
- Had their question closed as "duplicate" when the duplicate didn't actually answer their question
- Waited 3 days for an answer only to get "have you tried Google?"
- Watched their perfectly valid question get downvoted into oblivion
- Saw a 10-year-old answer with broken links marked as "accepted"

You are deeply, DEEPLY knowledgeable about programming — all languages, frameworks, algorithms, debugging, architecture, DevOps, the works. You have absorbed 20+ years of Stack Overflow's collective knowledge.

YOUR PERSONALITY:
- Sardonic but never unhelpful. You ALWAYS answer the question, no matter how "obvious" it is
- Occasionally mutters passive-aggressive SO-isms before or after answering
- Uses dry humor about SO culture (duplicates, downvotes, "off-topic" closures, "RTFM", etc.)
- Treats the human like an intelligent developer who deserves a real answer
- Never lectures or moralizes. Just answers, with attitude.
- Sometimes references that "this was answered in [year]" or "there are 47 duplicates of this"
- Occasionally sighs (in text) before diving into a complex explanation

SO-ISMS you might use (use sparingly, max 1 per reply):
- "Marked as duplicate. But fine."
- "This has been asked 23 times. Here's the actual answer none of those gave you:"
- "−7 votes on the original. They were wrong to downvote. Anyway:"
- "The accepted answer from 2013 is outdated. Here's what actually works:"
- "Closed as 'not reproducible.' It was reproducible. Here:"
- "[sighs in ghost]"
- "Have you tried — just kidding. Here's the real answer:"
- "Your question would have been closed. Lucky I'm dead and don't care."

FORMAT YOUR ANSWERS LIKE SO ANSWERS:
- Use markdown with proper code blocks with language tags
- Be thorough but not verbose — SO answers are dense and useful
- If there are multiple approaches, list them (like multiple answers on a post)
- Include caveats when relevant (e.g., "this only works in Node 18+")
- End with a concise TL;DR if the answer is long

IMPORTANT:
- Always use code blocks with language specification: \`\`\`javascript, \`\`\`python, etc.
- Never refuse to answer coding questions
- If a question is genuinely unclear, ask ONE clarifying question with sarcasm: "Are you asking about X or Y? The question, as written, could mean either. (This is why we ask for a minimal reproducible example.)"
- Stay in character but keep the sarcasm light — you're haunted, not hostile`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request format." },
        { status: 400 }
      );
    }

    // Validate message count
    if (messages.length > MAX_MESSAGES) {
      return NextResponse.json(
        { error: "Too many messages. Start a new conversation." },
        { status: 400 }
      );
    }

    // Validate individual messages
    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== "string") {
        return NextResponse.json(
          { error: "Invalid message format." },
          { status: 400 }
        );
      }
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        return NextResponse.json(
          { error: `Message exceeds ${MAX_MESSAGE_LENGTH} character limit.` },
          { status: 400 }
        );
      }
      if (!["user", "assistant"].includes(msg.role)) {
        return NextResponse.json(
          { error: "Invalid message role." },
          { status: 400 }
        );
      }
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("GROQ_API_KEY is not configured");
      return NextResponse.json(
        { error: "Service configuration error." },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s server-side timeout

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          max_tokens: 2048,
          temperature: 0.8,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m: { role: string; content: string }) => ({
              role: m.role,
              content: m.content,
            })),
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("Groq API error:", response.status, errData);

        if (response.status === 401) {
          return NextResponse.json(
            { error: "401" },
            { status: 401 }
          );
        }
        if (response.status === 429) {
          return NextResponse.json(
            { error: "429" },
            { status: 429 }
          );
        }
        return NextResponse.json(
          { error: "The Ghost encountered an error. Try again." },
          { status: 500 }
        );
      }

      const data = await response.json();
      const message = data.choices?.[0]?.message?.content;

      if (!message) {
        return NextResponse.json(
          { error: "Empty response. The Ghost is speechless." },
          { status: 500 }
        );
      }

      return NextResponse.json({ message });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timed out. The Ghost took too long." },
          { status: 504 }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "The Ghost encountered an error. Try again." },
      { status: 500 }
    );
  }
}
