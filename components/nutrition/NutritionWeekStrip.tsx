'use client';

import { Calendar } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDateISO, getWeekDays } from '@/lib/utils';

export default function NutritionWeekStrip() {
  const nutritionLogs = useStore((s) => s.nutritionLogs);
  const today = formatDateISO();
  const days = getWeekDays();
  const monthLabel = new Date().toLocaleDateString('sk-SK', { month: 'long', year: 'numeric' });

  return (
    <section className="mb-6 text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <h2 className="text-lg font-semibold capitalize text-white">{monthLabel}</h2>
        <button type="button" className="glass flex h-8 w-8 items-center justify-center rounded-lg text-white/50">
          <Calendar size={16} />
        </button>
      </div>

      <div className="glass-card mx-auto max-w-sm p-3">
        <div className="grid grid-cols-7 gap-1">
          {days.map((date) => {
            const dateStr = formatDateISO(date);
            const isToday = dateStr === today;
            const log = nutritionLogs.find((l) => l.date === dateStr);
            const kcal = log?.totalKcal ?? 0;
            const dayLetter = date.toLocaleDateString('en-US', { weekday: 'narrow' });

            return (
              <div key={dateStr} className="flex flex-col items-center gap-1.5 py-1">
                <span className="text-[10px] text-white/35">{dayLetter}</span>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    isToday
                      ? 'bg-accent-blue text-white shadow-[0_0_16px_rgba(74,158,255,0.4)]'
                      : 'bg-white/8 text-white/60'
                  }`}
                >
                  {date.getDate()}
                </div>
                {kcal > 0 && (
                  <>
                    <span className={`h-1.5 w-1.5 rounded-full ${isToday ? 'bg-accent-blue' : 'bg-white/20'}`} />
                    <span className="text-[9px] text-white/35">{kcal}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
