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
      onClick={() => router.push('/analytics')}
      className="touch-manipulation card-surface mb-4 w-full p-4 text-left"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Footprints size={18} className="text-accent-green" />
          <span className="font-display text-sm font-semibold">Kroky</span>
        </div>
        <ChevronRight size={18} className="text-text-muted" />
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-3xl font-bold">
            {today.steps.toLocaleString('sk-SK')}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {today.distanceKm} km | {today.kcal} kcal
          </p>
        </div>
        <div className="flex h-16 items-end gap-1">
          {weekData.map((d, i) => {
            const height = (d.steps / maxSteps) * 100;
            const isToday = i === weekData.length - 1;
            return (
              <div key={d.date} className="flex flex-col items-center gap-1">
                <div
                  className="w-3 rounded-sm"
                  style={{
                    height: `${Math.max(height, 8)}%`,
                    minHeight: 4,
                    background: isToday
                      ? 'linear-gradient(to top, var(--accent-dim), var(--accent-green))'
                      : 'var(--accent-olive)',
                  }}
                />
                <span className="text-[8px] text-text-muted">{dayLabels[i]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </button>
  );
}
