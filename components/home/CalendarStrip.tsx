'use client';

import { getWeekDays, getDayLabel, formatDateISO } from '@/lib/utils';
import { useStore } from '@/lib/store';

export default function CalendarStrip() {
  const workoutLogs = useStore((s) => s.workoutLogs);
  const workoutDates = new Set(workoutLogs.map((l) => l.date));
  const today = formatDateISO();
  const days = getWeekDays();

  return (
    <div className="glass-card mb-6 flex justify-between gap-1 p-3">
      {days.map((date) => {
        const dateStr = formatDateISO(date);
        const isToday = dateStr === today;
        const hasWorkout = workoutDates.has(dateStr);

        return (
          <div key={dateStr} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[9px] font-medium uppercase tracking-wide text-white/35">
              {getDayLabel(date)}
            </span>
            <div
              className={`
                flex h-10 w-full max-w-[44px] items-center justify-center rounded-xl text-sm font-bold transition-all
                ${isToday
                  ? 'bg-accent-green text-black shadow-[0_0_16px_rgba(0,255,102,0.4)]'
                  : 'text-white/40'}
              `}
            >
              {date.getDate()}
            </div>
            <span className={`text-xs ${hasWorkout ? 'text-accent-green' : 'text-transparent'}`}>
              •
            </span>
          </div>
        );
      })}
    </div>
  );
}
