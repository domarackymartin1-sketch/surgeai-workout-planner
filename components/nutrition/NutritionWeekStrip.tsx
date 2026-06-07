'use client';

import WeekPillCalendar from '@/components/ui/WeekPillCalendar';
import { useStore } from '@/lib/store';
import { formatDateISO, getWeekDays } from '@/lib/utils';

export default function NutritionWeekStrip() {
  const nutritionLogs = useStore((s) => s.nutritionLogs);
  const nutritionWeekOffset = useStore((s) => s.nutritionWeekOffset);
  const nutritionSelectedDate = useStore((s) => s.nutritionSelectedDate);
  const setNutritionWeekOffset = useStore((s) => s.setNutritionWeekOffset);
  const setNutritionSelectedDate = useStore((s) => s.setNutritionSelectedDate);

  const ref = new Date();
  ref.setDate(ref.getDate() - nutritionWeekOffset * 7);
  const weekDays = getWeekDays(ref);

  const days = weekDays.map((date) => {
    const dateStr = formatDateISO(date);
    const log = nutritionLogs.find((l) => l.date === dateStr);
    const kcal = log?.totalKcal ?? 0;
    return {
      date: dateStr,
      badge: kcal > 0 ? Math.min(Math.round(kcal / 100), 9) || 1 : 0,
      subLabel: kcal > 0 ? `${kcal}` : undefined,
    };
  });

  return (
    <WeekPillCalendar
      weekOffset={nutritionWeekOffset}
      onWeekChange={setNutritionWeekOffset}
      days={days}
      selectedDate={nutritionSelectedDate}
      onSelectDate={setNutritionSelectedDate}
      allowFuture
    />
  );
}
