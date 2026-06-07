'use client';

import WeekPillCalendar from '@/components/ui/WeekPillCalendar';
import { useStore } from '@/lib/store';
import { formatDateISO, getWeekDays } from '@/lib/utils';

export default function WeekCalendar() {
  const weekOffset = useStore((s) => s.weekOffset);
  const setWeekOffset = useStore((s) => s.setWeekOffset);
  const workoutLogs = useStore((s) => s.workoutLogs);

  const ref = new Date();
  ref.setDate(ref.getDate() - weekOffset * 7);
  const days = getWeekDays(ref).map((date) => {
    const dateStr = formatDateISO(date);
    const workouts = workoutLogs.filter((l) => l.date === dateStr).length;
    return { date: dateStr, badge: workouts };
  });

  return (
    <WeekPillCalendar
      weekOffset={weekOffset}
      onWeekChange={setWeekOffset}
      days={days}
    />
  );
}
