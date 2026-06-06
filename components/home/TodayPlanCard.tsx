'use client';

import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';
import GreenButton from '@/components/ui/GreenButton';
import { useStore } from '@/lib/store';
import { formatDuration } from '@/lib/utils';

export default function TodayPlanCard() {
  const router = useRouter();
  const plans = useStore((s) => s.plans);
  const startWorkout = useStore((s) => s.startWorkout);

  const plan = plans[0];
  if (!plan) return null;

  const handleStart = () => {
    startWorkout(plan.id);
    router.push(`/workout/${plan.id}`);
  };

  return (
    <div className="relative overflow-hidden rounded-card bg-bg-card p-5" style={{ minHeight: 180 }}>
      <div
        className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, var(--accent-green), transparent)' }}
      />
      <h3 className="relative mb-2 font-display text-xl font-bold leading-tight">
        {plan.name}
      </h3>
      <p className="relative mb-3 text-sm text-text-muted">
        {plan.exercises.length} cvikov · {formatDuration(plan.estimatedMinutes)}
      </p>
      <div className="relative mb-4 flex flex-wrap gap-2">
        {plan.muscleGroups.map((mg) => (
          <span
            key={mg}
            className="rounded-full border border-accent-green/30 bg-accent-green/10 px-2.5 py-0.5 text-xs text-accent-green"
          >
            {mg}
          </span>
        ))}
      </div>
      <GreenButton fullWidth onClick={handleStart}>
        <span className="flex items-center justify-center gap-2">
          <Zap size={18} />
          ŠTART TRÉNINGU
        </span>
      </GreenButton>
    </div>
  );
}
