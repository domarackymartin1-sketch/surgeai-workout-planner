'use client';

import { Calendar, RotateCcw, Dumbbell, PersonStanding, RefreshCw, Heart } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { WorkoutCategory } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/utils';

const CATEGORY_ICONS: Record<WorkoutCategory, React.ReactNode> = {
  hybrid: <RefreshCw size={20} className="text-accent-blue" />,
  gym: <Dumbbell size={20} className="text-accent-blue" />,
  cardio: <PersonStanding size={20} className="text-accent-purple" />,
  recovery: <Heart size={20} className="text-accent-purple" />,
  hiit: <PersonStanding size={20} className="text-accent-purple" />,
  yoga: <Heart size={20} className="text-accent-purple" />,
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
    <section className="mb-6 text-center">
      <div className="mb-4 flex items-center justify-center gap-2">
        <Calendar size={16} className="text-white/50" />
        <h2 className="text-base font-bold text-white/90">Tvoj Tréningový Plán</h2>
        <button type="button" className="ml-2 touch-manipulation text-xs text-white/30">
          <RotateCcw size={12} className="inline" /> Reset
        </button>
      </div>

      <div className="glass-card mx-auto max-w-sm p-4">
        <div className="grid grid-cols-7 gap-1">
          {weeklySchedule.map((day) => (
            <div key={day.dayIndex} className="flex flex-col items-center gap-1.5 py-1">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${CATEGORY_BG[day.category]}`}>
                {CATEGORY_ICONS[day.category]}
              </div>
              <span className="text-[9px] text-white/30">{DAY_LABELS[day.dayIndex]}</span>
              <span className="max-w-[40px] truncate text-[8px] font-medium text-white/50">
                {CATEGORY_LABELS[day.category]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
