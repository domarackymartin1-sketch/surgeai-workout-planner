'use client';

import { Shield } from 'lucide-react';
import { useStore } from '@/lib/store';
import { calculateFitnessScore } from '@/lib/fitnessScore';

const MAX_POINTS = 4750;

export default function PointsCard() {
  const workoutLogs = useStore((s) => s.workoutLogs);
  const habitLogs = useStore((s) => s.habitLogs);
  const prs = useStore((s) => s.prs);
  const profile = useStore((s) => s.profile);

  const { totalScore } = calculateFitnessScore(workoutLogs, habitLogs, prs, profile);
  const points = totalScore;
  const progress = Math.min(points / MAX_POINTS, 1);
  const level = Math.max(1, Math.floor(points / 400) + 1);

  return (
    <div className="glass-card mb-5 flex items-center gap-3 p-4">
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">
          {points.toLocaleString('sk-SK')}{' '}
          <span className="text-white/40">/ {MAX_POINTS.toLocaleString('sk-SK')} bodov</span>
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent-green transition-all duration-700"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/20">
          <Shield size={20} className="text-yellow-400" fill="currentColor" />
        </div>
        <span className="text-xl font-bold text-white">{level}</span>
      </div>
    </div>
  );
}
