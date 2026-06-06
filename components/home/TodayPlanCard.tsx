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
    <div className="glass-card relative overflow-hidden p-5">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,255,102,0.12), transparent 70%)' }}
      />
      <h3 className="relative mb-1 font-display text-lg font-bold leading-tight">{plan.name}</h3>
      <p className="relative mb-4 text-sm text-white/40">
        {plan.exercises.length} cvikov · {formatDuration(plan.estimatedMinutes)}
      </p>
      <div className="relative mb-4 flex flex-wrap gap-2">
        {plan.muscleGroups.map((mg) => (
          <span
            key={mg}
            className="rounded-full border border-accent-green/20 bg-accent-green/10 px-2.5 py-0.5 text-xs text-accent-green"
          >
            {mg}
          </span>
        ))}
      </div>
      <GreenButton fullWidth pill onClick={handleStart}>
        <Zap size={18} />
        ŠTART TRÉNINGU
      </GreenButton>
    </div>
  );
}
