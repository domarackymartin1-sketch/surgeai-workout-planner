'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDateISO, getDayShort, getWeekDays, getWeekRangeLabel } from '@/lib/utils';

export default function WeekCalendar() {
  const weekOffset = useStore((s) => s.weekOffset);
  const setWeekOffset = useStore((s) => s.setWeekOffset);
  const workoutLogs = useStore((s) => s.workoutLogs);
  const workoutDates = new Set(workoutLogs.map((l) => l.date));

  const ref = new Date();
  ref.setDate(ref.getDate() - weekOffset * 7);
  const days = getWeekDays(ref);
  const today = formatDateISO();

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white/90">{getWeekRangeLabel(ref)}</p>
          <p className="text-xs text-white/40">Aktuálny týždeň</p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="glass touch-manipulation flex h-9 w-9 items-center justify-center rounded-xl text-white/50"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
            disabled={weekOffset === 0}
            className="glass touch-manipulation flex h-9 w-9 items-center justify-center rounded-xl text-white/50 disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {days.map((date) => {
          const dateStr = formatDateISO(date);
          const isToday = dateStr === today && weekOffset === 0;
          const workouts = workoutLogs.filter((l) => l.date === dateStr).length;

          return (
            <div
              key={dateStr}
              className={`relative flex min-w-[52px] flex-col items-center rounded-2xl px-3 py-3 transition-all ${
                isToday
                  ? 'glass-pill-active border-2 border-accent-green'
                  : 'glass-card'
              }`}
            >
              {workouts > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-green text-[10px] font-bold text-black">
                  {workouts}
                </span>
              )}
              <span className={`text-xs font-medium ${isToday ? 'text-accent-green' : 'text-white/40'}`}>
                {getDayShort(date)}
              </span>
              <span className={`mt-1 font-display text-lg font-bold ${isToday ? 'text-white' : 'text-white/70'}`}>
                {date.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
