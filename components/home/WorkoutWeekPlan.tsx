'use client';

import { Calendar, RotateCcw, Dumbbell, PersonStanding, RefreshCw, Heart } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { WorkoutCategory } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/utils';

const CATEGORY_ICONS: Record<WorkoutCategory, React.ReactNode> = {
  hybrid: <RefreshCw size={22} className="text-accent-blue" />,
  gym: <Dumbbell size={22} className="text-accent-blue" />,
  cardio: <PersonStanding size={22} className="text-accent-purple" />,
  recovery: <Heart size={22} className="text-accent-purple" />,
  hiit: <PersonStanding size={22} className="text-accent-purple" />,
  yoga: <Heart size={22} className="text-accent-purple" />,
};

const CATEGORY_BG: Record<WorkoutCategory, string> = {
  hybrid: 'bg-accent-blue/15',
  gym: 'bg-accent-blue/15',
  cardio: 'bg-accent-purple/15',
  recovery: 'bg-accent-purple/15',
  hiit: 'bg-accent-purple/15',
  yoga: 'bg-accent-purple/15',
};

const DAY_LABELS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

export default function WorkoutWeekPlan() {
  const weeklySchedule = useStore((s) => s.weeklySchedule);

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-white/50" />
          <h2 className="font-display text-base font-bold text-white/90">Tvoj Tréningový Plán</h2>
        </div>
        <button type="button" className="touch-manipulation flex items-center gap-1 text-xs text-white/40">
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      <div className="glass-card hide-scrollbar flex gap-3 overflow-x-auto p-4">
        {weeklySchedule.map((day) => (
          <div key={day.dayIndex} className="flex min-w-[72px] flex-col items-center gap-2">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${CATEGORY_BG[day.category]}`}>
              {CATEGORY_ICONS[day.category]}
            </div>
            <span className="text-[10px] text-white/35">{DAY_LABELS[day.dayIndex]}</span>
            <span className="text-center text-[11px] font-medium text-white/70">
              {CATEGORY_LABELS[day.category]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
