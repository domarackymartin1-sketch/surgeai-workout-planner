'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatDateISO, getWeekDays } from '@/lib/utils';

export interface WeekDayData {
  date: string;
  badge?: number;
  subLabel?: string;
}

interface WeekPillCalendarProps {
  weekOffset: number;
  onWeekChange: (offset: number) => void;
  days: WeekDayData[];
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  allowFuture?: boolean;
}

function formatWeekRange(ref: Date): string {
  const days = getWeekDays(ref);
  const start = days[0].toLocaleDateString('sk-SK', { day: 'numeric', month: 'short' });
  const end = days[6].toLocaleDateString('sk-SK', { day: 'numeric', month: 'short' });
  const year = days[6].getFullYear();
  return `${start} – ${end}, ${year}`;
}

export default function WeekPillCalendar({
  weekOffset,
  onWeekChange,
  days,
  selectedDate,
  onSelectDate,
  allowFuture = false,
}: WeekPillCalendarProps) {
  const ref = new Date();
  ref.setDate(ref.getDate() - weekOffset * 7);
  const weekDays = getWeekDays(ref);
  const today = formatDateISO();
  const isCurrentWeek = weekOffset === 0;

  const dayMap = new Map(days.map((d) => [d.date, d]));

  return (
    <section className="mb-6 text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onWeekChange(weekOffset + 1)}
          className="touch-manipulation flex h-8 w-8 items-center justify-center text-white/60"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="text-sm font-semibold text-white">{formatWeekRange(ref)}</p>
          {isCurrentWeek && (
            <p className="mt-0.5 flex items-center justify-center gap-1 text-xs text-white/40">
              <Calendar size={12} /> Aktuálny týždeň
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onWeekChange(weekOffset - 1)}
          disabled={!allowFuture && weekOffset === 0}
          className="touch-manipulation flex h-8 w-8 items-center justify-center text-white/60 disabled:opacity-25"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mx-auto grid max-w-sm grid-cols-7 gap-1.5 px-1">
        {weekDays.map((date) => {
          const dateStr = formatDateISO(date);
          const isToday = dateStr === today;
          const isSelected = selectedDate
            ? dateStr === selectedDate
            : isToday && isCurrentWeek;
          const data = dayMap.get(dateStr);
          const badge = data?.badge ?? 0;
          const dayLetter = date.toLocaleDateString('en-US', { weekday: 'narrow' });

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDate?.(dateStr)}
              className={`
                relative flex flex-col items-center rounded-[20px] px-1 py-2.5 transition-all
                ${isSelected
                  ? 'border-2 border-accent-green bg-gradient-to-b from-accent-green/20 to-transparent shadow-[0_0_20px_rgba(0,255,102,0.15)]'
                  : 'border border-accent-olive/80 bg-gradient-to-b from-white/5 to-transparent'}
              `}
            >
              {badge > 0 && (
                <span
                  className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${
                    isSelected ? 'bg-accent-green text-black' : 'bg-accent-olive text-white/80'
                  }`}
                >
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
              <span className={`text-xs font-semibold ${isSelected ? 'text-accent-green' : 'text-white/50'}`}>
                {dayLetter}
              </span>
              {isToday && (
                <span className={`my-0.5 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-accent-green/60'}`} />
              )}
              <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-white/70'}`}>
                {date.getDate()}
              </span>
              {data?.subLabel && (
                <span className="mt-0.5 text-[8px] text-white/35">{data.subLabel}</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
