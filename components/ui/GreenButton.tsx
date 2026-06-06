'use client';

import { motion } from 'framer-motion';

interface GreenButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function GreenButton({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  fullWidth = false,
}: GreenButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      className={`
        touch-manipulation min-h-[44px] rounded-btn bg-accent-green px-6 py-3
        font-display text-base font-bold uppercase tracking-wide text-black
        transition-opacity disabled:opacity-50
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
