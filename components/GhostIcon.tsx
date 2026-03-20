"use client";

export function GhostIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ghost body */}
      <path
        d="M8 36V20C8 12.268 15.163 6 24 6C32.837 6 40 12.268 40 20V36L35 32L30 36L25 32L20 36L15 32L10 36L8 36Z"
        fill="#1A1A1A"
        stroke="#F48024"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Eyes */}
      <circle cx="18" cy="21" r="3" fill="#F48024" />
      <circle cx="30" cy="21" r="3" fill="#F48024" />
      {/* Pupils */}
      <circle cx="19" cy="22" r="1.2" fill="#0D0D0D" />
      <circle cx="31" cy="22" r="1.2" fill="#0D0D0D" />
      {/* Glow dots */}
      <circle cx="19.5" cy="21" r="0.5" fill="white" opacity="0.8" />
      <circle cx="31.5" cy="21" r="0.5" fill="white" opacity="0.8" />
    </svg>
  );
}

export function StackOverflowLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M26 33v-9h4v13H0V24h4v9h22z" fill="#BCBBBB" />
      <path
        d="M21.5 0l-2.7 2 9.9 13.3 2.7-2L21.5 0zM26 18.4L13.3 7.8l2.1-2.5 12.7 10.6-2.1 2.5zM9.1 15.2l15 7 1.4-3-15-7-1.4 3zm14 10.8L5.6 23.8l.9-3.5 17.5 2.2-.9 3.5zM5 26h19v4H5v-4z"
        fill="#F48024"
      />
    </svg>
  );
}
