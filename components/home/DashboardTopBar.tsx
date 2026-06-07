'use client';

import { Map, Calendar } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function DashboardTopBar() {
  return (
    <header className="mb-5 flex items-center justify-between px-1 pt-1">
      <Logo size="sm" />
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="glass touch-manipulation flex h-11 w-11 items-center justify-center rounded-2xl text-white/60"
          aria-label="Mapa"
        >
          <Map size={20} />
        </button>
        <button
          type="button"
          className="glass touch-manipulation flex h-11 w-11 items-center justify-center rounded-2xl text-white/60"
          aria-label="Kalendár"
        >
          <Calendar size={20} />
        </button>
      </div>
    </header>
  );
}
