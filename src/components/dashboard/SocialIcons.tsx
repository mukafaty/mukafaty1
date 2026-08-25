type IconProps = { size?: number; className?: string };

export function SnapchatIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.002 2c2.79 0 4.63 2.06 4.63 4.9 0 .5-.03 1.02-.06 1.5.2.1.45.16.7.16.35 0 .74-.14 1.04-.14.42 0 .8.24.8.66 0 .6-.86.86-1.5 1.06-.4.13-.8.25-.8.6 0 .18.07.36.16.56.6 1.32 1.83 2.63 3.36 2.94.28.06.46.3.46.58 0 .68-1.36 1.02-2.36 1.18-.13.2-.2.7-.3 1.06-.06.2-.2.4-.53.4-.36 0-.86-.16-1.6-.16-1.16 0-1.6.24-2.44.86-.72.53-1.5 1-2.56 1s-1.83-.47-2.55-1c-.84-.62-1.28-.86-2.44-.86-.74 0-1.24.16-1.6.16-.33 0-.47-.2-.53-.4-.1-.36-.17-.86-.3-1.06-1-.16-2.36-.5-2.36-1.18 0-.28.18-.52.46-.58 1.53-.31 2.76-1.62 3.36-2.94.09-.2.16-.38.16-.56 0-.35-.4-.47-.8-.6-.64-.2-1.5-.46-1.5-1.06 0-.42.38-.66.8-.66.3 0 .69.14 1.04.14.25 0 .5-.06.7-.16-.03-.48-.06-1-.06-1.5C7.372 4.06 9.212 2 12.002 2z" />
    </svg>
  );
}

export function TiktokIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.5 2h-3v13.2a2.7 2.7 0 1 1-2.7-2.7c.24 0 .47.03.7.09V9.5a5.9 5.9 0 0 0-.7-.04A5.7 5.7 0 1 0 16.5 15.2V8.6a6.9 6.9 0 0 0 4 1.28V6.86a3.9 3.9 0 0 1-4-3.86V2z" />
    </svg>
  );
}

export function XIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.53 3h3.02l-6.6 7.54L21.75 21h-5.9l-4.62-6.04L5.9 21H2.87l7.06-8.07L2.5 3h6.05l4.18 5.52L17.53 3zm-1.06 16.2h1.67L7.6 4.72H5.8l10.67 14.48z" />
    </svg>
  );
}

/* ————— أيقونات ملونة بهوية كل منصة ————— */

export function InstagramColorIcon({ size = 22, className }: IconProps) {
  const id = "ig-grad";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="24" x2="24" y2="0">
          <stop offset="0%" stopColor="#FFC107" />
          <stop offset="35%" stopColor="#F44336" />
          <stop offset="70%" stopColor="#9C27B0" />
          <stop offset="100%" stopColor="#3F51B5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill={`url(#${id})`} />
      <circle cx="12" cy="12" r="4.4" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="#fff" />
    </svg>
  );
}

export function XColorIcon({ size = 22, className }: IconProps) {
  return <XIcon size={size} className={className ? `${className} text-[#000000]` : "text-[#000000]"} />;
}

export function FacebookColorIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.6 12.9h2l.4-2.6h-2.4V8.9c0-.8.3-1.2 1.2-1.2h1.2V5.3c-.5-.07-1.3-.13-2-.13-2 0-3.3 1.2-3.3 3.4v1.7H8.5v2.6h2.2V22c.4.06.9.08 1.4.08.4 0 .9-.02 1.5-.08v-9.1z"
      />
    </svg>
  );
}

export function SnapchatColorIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#FFFC00" />
      <path
        fill="#fff"
        stroke="#111"
        strokeWidth=".4"
        d="M12 5.4c1.9 0 3.2 1.4 3.2 3.4 0 .35-.02.7-.04 1.03.14.07.3.11.48.11.24 0 .5-.1.7-.1.3 0 .56.17.56.46 0 .42-.6.6-1.05.74-.28.09-.55.17-.55.42 0 .12.05.25.11.39.42.92 1.27 1.83 2.33 2.05.2.04.32.2.32.4 0 .47-.94.7-1.63.82-.09.14-.14.48-.21.73-.04.14-.14.28-.37.28-.25 0-.6-.11-1.11-.11-.8 0-1.11.16-1.69.6-.5.36-1.04.68-1.78.68s-1.27-.32-1.77-.69c-.58-.43-.89-.59-1.69-.59-.51 0-.86.11-1.11.11-.23 0-.33-.14-.37-.28-.07-.25-.12-.59-.21-.73C5.44 15.32 4.5 15.09 4.5 14.62c0-.2.12-.36.32-.4 1.06-.22 1.91-1.13 2.33-2.05.06-.14.11-.27.11-.39 0-.25-.27-.33-.55-.42-.45-.14-1.05-.32-1.05-.74 0-.29.26-.46.56-.46.2 0 .46.1.7.1.18 0 .34-.04.48-.11-.02-.33-.04-.68-.04-1.03 0-2 1.3-3.4 3.2-3.4z"
      />
    </svg>
  );
}

export function TiktokColorIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#25F4EE"
        d="M14.7 2h-2.3v13.2a2.4 2.4 0 1 1-2.4-2.4c.2 0 .4.02.6.07V10.3a5.9 5.9 0 0 0-.6-.04A5.5 5.5 0 1 0 15.5 15.7V8.9a6.7 6.7 0 0 0 3.2 1.1V7.4a3.9 3.9 0 0 1-2.8-1.6"
      />
      <path
        fill="#FE2C55"
        d="M16.5 2.6h-2.3v13.2a2.4 2.4 0 1 1-2.4-2.4c.2 0 .4.02.6.07v-2.6a5.9 5.9 0 0 0-.6-.03A5.5 5.5 0 1 0 17.3 16.3V9.5a6.7 6.7 0 0 0 3.2 1.1V8a3.9 3.9 0 0 1-4-3.8V2.6z"
      />
      <path
        fill="#000"
        d="M15.6 2.3h-2.3v13.2a2.4 2.4 0 1 1-2.4-2.4c.2 0 .4.02.6.07V10.6a5.9 5.9 0 0 0-.6-.04A5.5 5.5 0 1 0 16.4 16V9.2a6.7 6.7 0 0 0 3.2 1.1V7.7a3.9 3.9 0 0 1-4-3.8V2.3z"
      />
    </svg>
  );
}

export function YoutubeColorIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="1.5" y="5" width="21" height="14" rx="4" fill="#FF0000" />
      <path fill="#fff" d="M10 8.8l6 3.2-6 3.2z" />
    </svg>
  );
}

export function LinkedinColorIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M6.9 9.4h2.2V18H6.9zM8 5.9a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6zM10.8 9.4H13v1.2c.3-.6 1.1-1.4 2.4-1.4 1.8 0 2.7 1.2 2.7 3.4V18h-2.2v-4.9c0-1.2-.4-1.8-1.3-1.8-1 0-1.5.7-1.5 1.8V18h-2.3z"
      />
    </svg>
  );
}

export function WebsiteColorIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9.5" fill="#248EF6" />
      <g fill="none" stroke="#fff" strokeWidth="1.3">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M2.5 12h19M12 2.5c2.6 2.6 2.6 16.4 0 19M12 2.5c-2.6 2.6-2.6 16.4 0 19" />
      </g>
    </svg>
  );
}
