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
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg-card font-display text-lg font-bold text-accent-green">
          {getInitials(name)}
        </div>
        <div>
          <p className="font-display text-lg font-semibold leading-tight">
            Ahoj, {name}
          </p>
          <p className="text-sm text-text-muted">Vitaj späť!</p>
        </div>
      </div>
      <button
        type="button"
        className="touch-manipulation flex h-11 w-11 items-center justify-center rounded-full text-text-muted"
        aria-label="Notifikácie"
      >
        <Bell size={22} />
      </button>
    </header>
  );
}
