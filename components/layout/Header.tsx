'use client';

import { Bell } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface HeaderProps {
  name: string;
}

export default function Header({ name }: HeaderProps) {
  return (
    <header className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="glass-card flex h-12 w-12 items-center justify-center font-display text-lg font-bold text-accent-green">
          {getInitials(name)}
        </div>
        <div>
          <p className="font-display text-xl font-semibold leading-tight">
            Ahoj, {name}
          </p>
          <p className="text-sm text-white/45">Vitaj späť!</p>
        </div>
      </div>
      <button
        type="button"
        className="glass touch-manipulation flex h-12 w-12 items-center justify-center rounded-2xl text-white/50"
        aria-label="Notifikácie"
      >
        <Bell size={20} />
      </button>
    </header>
  );
}
