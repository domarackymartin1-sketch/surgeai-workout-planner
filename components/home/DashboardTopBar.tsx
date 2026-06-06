'use client';

import { Map, Calendar } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function DashboardTopBar() {
  return (
    <header className="mb-5 flex items-center justify-between">
      <button type="button" className="glass touch-manipulation flex h-11 w-11 items-center justify-center rounded-2xl text-white/60">
        <Map size={20} />
      </button>
      <div className="scale-90">
        <Logo size="sm" />
      </div>
      <button type="button" className="glass touch-manipulation flex h-11 w-11 items-center justify-center rounded-2xl text-white/60">
        <Calendar size={20} />
      </button>
    </header>
  );
}
