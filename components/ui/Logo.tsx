'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export default function Logo({ size = 'md', variant = 'light' }: LogoProps) {
  const textSize = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' }[size];
  const iconSize = { sm: 28, md: 36, lg: 44 }[size];

  return (
    <div className="flex items-center gap-2.5">
      <svg width={iconSize} height={iconSize} viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="20" stroke="var(--accent-green)" strokeWidth="2" opacity="0.3" />
        <path
          d="M22 6 C22 6 32 14 32 22 C32 30 22 38 22 38 C22 38 12 30 12 22 C12 14 22 6 22 6Z"
          fill="var(--accent-green)"
          opacity="0.9"
        />
        <circle cx="22" cy="20" r="4" fill="#000" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className={`font-display font-bold tracking-wide ${textSize} ${variant === 'light' ? 'text-white' : 'text-text-primary'}`}>
          SURGE<span className="text-accent-green">AI</span>
        </span>
        <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/50">
          Workout
        </span>
      </div>
    </div>
  );
}
