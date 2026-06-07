'use client';

import { useRouter } from 'next/navigation';
import { Footprints, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function StepsCard() {
  const router = useRouter();
  const getStepsForWeek = useStore((s) => s.getStepsForWeek);
  const getTodaySteps = useStore((s) => s.getTodaySteps);

  const today = getTodaySteps();
  const weekData = getStepsForWeek();
  const maxSteps = Math.max(...weekData.map((d) => d.steps), 1);
  const dayLabels = ['P', 'U', 'S', 'Š', 'P', 'S', 'N'];

  return (
    <button
      type="button"
      onClick={() => router.push('/profile')}
      className="touch-manipulation glass-card mb-4 w-full p-5 text-left transition-transform active:scale-[0.99]"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="glass-pill-active flex h-9 w-9 items-center justify-center rounded-xl">
            <Footprints size={18} className="text-accent-green" />
          </div>
          <span className="font-display text-sm font-semibold">Kroky</span>
        </div>
        <ChevronRight size={18} className="text-white/30" />
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-4xl font-bold tracking-tight">
            {today.steps.toLocaleString('sk-SK')}
          </p>
          <p className="mt-1.5 text-xs text-white/40">
            {today.distanceKm} km · {today.kcal} kcal
          </p>
        </div>
        <div className="flex h-20 items-end gap-1.5">
          {weekData.map((d, i) => {
            const height = (d.steps / maxSteps) * 100;
            const isToday = i === weekData.length - 1;
            return (
              <div key={d.date} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-3.5 rounded-md transition-all"
                  style={{
                    height: `${Math.max(height, 12)}%`,
                    minHeight: 8,
                    background: isToday
                      ? 'linear-gradient(to top, var(--accent-dim), var(--accent-green))'
                      : 'rgba(0,255,102,0.15)',
                    boxShadow: isToday ? '0 0 8px rgba(0,255,102,0.3)' : 'none',
                  }}
                />
                <span className="text-[8px] font-medium text-white/30">{dayLabels[i]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </button>
  );
}
