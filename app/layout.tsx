import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackOverflow Ghost — Your Questions Were Answered In 2009",
  description:
    "A haunted coding assistant. Expert answers from the spirit of every developer who rage-quit after a 'marked as duplicate' response.",
  keywords: ["stackoverflow", "chatbot", "coding assistant", "developer tools", "programming help"],
  authors: [{ name: "Nitish Kumar" }],
  openGraph: {
    title: "StackOverflow Ghost",
    description: "The spirit of StackOverflow answers your questions. Reluctantly.",
    type: "website",
    siteName: "StackOverflow Ghost",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackOverflow Ghost",
    description: "The spirit of StackOverflow answers your questions. Reluctantly.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        {/* Ghost favicon */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👻</text></svg>"
        />
        <meta name="theme-color" content="#0D0D0D" />
      </head>
      <body className="noise-bg scanline antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
