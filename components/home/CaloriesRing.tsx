'use client';

import { Flame } from 'lucide-react';
import RingProgress from '@/components/ui/RingProgress';
import { useStore } from '@/lib/store';

export default function CaloriesRing() {
  const profile = useStore((s) => s.profile);
  const getTodayNutrition = useStore((s) => s.getTodayNutrition);

  const nutrition = getTodayNutrition();
  const target = profile?.dailyKcalTarget ?? 2500;
  const consumed = nutrition.totalKcal;
  const progress = consumed / target;
  const overLimit = consumed > target;

  return (
    <div className="card-surface flex flex-1 flex-col p-4">
      <div className="mb-2 flex items-center gap-2">
        <Flame size={16} className="text-orange-400" />
        <span className="font-display text-xs font-semibold">Kalórie</span>
      </div>
      <p className="font-display text-xl font-bold">{consumed}</p>
      <p className="mb-2 text-[10px] text-text-muted">kcal</p>
      <div className="mt-auto flex justify-end">
        <RingProgress
          progress={Math.min(progress, 1)}
          size={64}
          strokeWidth={5}
          color={overLimit ? 'var(--danger)' : 'var(--accent-green)'}
        />
      </div>
    </div>
  );
}
