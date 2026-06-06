'use client';

import { motion } from 'framer-motion';

interface NeonBadgeProps {
  children: React.ReactNode;
}

export default function NeonBadge({ children }: NeonBadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-1 rounded-full bg-accent-green/20 px-2 py-0.5 text-xs font-semibold text-accent-green"
    >
      {children}
    </motion.span>
  );
}
