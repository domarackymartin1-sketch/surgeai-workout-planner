'use client';

import { Dumbbell, TrendingUp, TrendingDown } from 'lucide-react';
import RingProgress from '@/components/ui/RingProgress';
import { useStore } from '@/lib/store';
import { formatDateISO, getVolumeChangePercent, getWeekVolume } from '@/lib/utils';

export default function VolumeRing() {
  const workoutLogs = useStore((s) => s.workoutLogs);
  const today = formatDateISO();

  const todayVolume = workoutLogs
    .filter((l) => l.date === today)
    .reduce((sum, l) => sum + l.totalVolume, 0);

  const thisWeek = getWeekVolume(workoutLogs, 0);
  const lastWeek = getWeekVolume(workoutLogs, 1);
  const change = getVolumeChangePercent(thisWeek, lastWeek);
  const progress = Math.min(todayVolume / 5000, 1);

  return (
    <div className="card-surface flex flex-1 flex-col p-4">
      <div className="mb-2 flex items-center gap-2">
        <Dumbbell size={16} className="text-accent-green" />
        <span className="font-display text-xs font-semibold">Objem</span>
      </div>
      <p className="font-display text-xl font-bold">
        {todayVolume > 0 ? `${Math.round(todayVolume)}` : '0'}
      </p>
      <p className="mb-1 text-[10px] text-text-muted">kg</p>
      <div className="flex items-center gap-1 text-[10px]">
        {change >= 0 ? (
          <TrendingUp size={10} className="text-accent-green" />
        ) : (
          <TrendingDown size={10} className="text-danger" />
        )}
        <span className={change >= 0 ? 'text-accent-green' : 'text-danger'}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      </div>
      <div className="mt-auto flex justify-end">
        <RingProgress progress={progress} size={64} strokeWidth={5} />
      </div>
    </div>
  );
}
