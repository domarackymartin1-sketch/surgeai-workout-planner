'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDateISO, getDayShort, getWeekDays, getWeekRangeLabel } from '@/lib/utils';

export default function WeekCalendar() {
  const weekOffset = useStore((s) => s.weekOffset);
  const setWeekOffset = useStore((s) => s.setWeekOffset);
  const workoutLogs = useStore((s) => s.workoutLogs);

  const ref = new Date();
  ref.setDate(ref.getDate() - weekOffset * 7);
  const days = getWeekDays(ref);
  const today = formatDateISO();

  return (
    <section className="mb-6 text-center">
      <div className="mb-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="glass touch-manipulation flex h-9 w-9 items-center justify-center rounded-xl text-white/50"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <p className="text-sm font-semibold text-white/90">{getWeekRangeLabel(ref)}</p>
          <p className="text-xs text-white/40">Aktuálny týždeň</p>
        </div>
        <button
          type="button"
          onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
          disabled={weekOffset === 0}
          className="glass touch-manipulation flex h-9 w-9 items-center justify-center rounded-xl text-white/50 disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="glass-card mx-auto max-w-sm p-3">
        <div className="grid grid-cols-7 gap-1">
          {days.map((date) => {
            const dateStr = formatDateISO(date);
            const isToday = dateStr === today && weekOffset === 0;
            const workouts = workoutLogs.filter((l) => l.date === dateStr).length;

            return (
              <div key={dateStr} className="relative flex flex-col items-center gap-1 py-2">
                {workouts > 0 && (
                  <span className="absolute -right-0.5 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent-green text-[8px] font-bold text-black">
                    {workouts}
                  </span>
                )}
                <span className={`text-[10px] font-medium ${isToday ? 'text-accent-green' : 'text-white/35'}`}>
                  {getDayShort(date)}
                </span>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
                    isToday
                      ? 'glass-pill-active border border-accent-green text-white'
                      : 'text-white/60'
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
