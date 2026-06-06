'use client';

import { motion } from 'framer-motion';

interface GreenButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  fullWidth?: boolean;
  pill?: boolean;
}

export default function GreenButton({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  fullWidth = false,
  pill = false,
}: GreenButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      className={`
        touch-manipulation flex min-h-[48px] items-center justify-center gap-2
        bg-accent-green px-6 py-3 font-display text-base font-bold text-black
        transition-opacity disabled:opacity-50
        ${pill ? 'rounded-full neon-glow' : 'rounded-btn uppercase tracking-wide'}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
