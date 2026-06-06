'use client';

import { getWeekDays, getDayLabel, formatDateISO } from '@/lib/utils';
import { useStore } from '@/lib/store';

export default function CalendarStrip() {
  const workoutLogs = useStore((s) => s.workoutLogs);
  const workoutDates = new Set(workoutLogs.map((l) => l.date));
  const today = formatDateISO();
  const days = getWeekDays();

  return (
    <div className="mb-6 flex justify-between gap-1">
      {days.map((date) => {
        const dateStr = formatDateISO(date);
        const isToday = dateStr === today;
        const hasWorkout = workoutDates.has(dateStr);

        return (
          <div key={dateStr} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] uppercase text-text-muted">
              {getDayLabel(date)}
            </span>
            <div
              className={`
                flex h-10 w-full max-w-[44px] items-center justify-center rounded-xl text-sm font-semibold
                ${isToday ? 'bg-accent-green text-black' : 'text-text-muted'}
              `}
            >
              {date.getDate()}
            </div>
            {hasWorkout && !isToday && (
              <span className="text-xs text-accent-green">•</span>
            )}
            {hasWorkout && isToday && (
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
            )}
            {!hasWorkout && <span className="h-1.5" />}
          </div>
        );
      })}
    </div>
  );
}
