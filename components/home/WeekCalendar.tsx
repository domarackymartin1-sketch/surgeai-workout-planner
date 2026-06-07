'use client';

import WeekPillCalendar from '@/components/ui/WeekPillCalendar';
import { useStore } from '@/lib/store';
import { formatDateISO, getWeekDays } from '@/lib/utils';

export default function WeekCalendar() {
  const weekOffset = useStore((s) => s.weekOffset);
  const setWeekOffset = useStore((s) => s.setWeekOffset);
  const homeSelectedDate = useStore((s) => s.homeSelectedDate);
  const setHomeSelectedDate = useStore((s) => s.setHomeSelectedDate);
  const workoutLogs = useStore((s) => s.workoutLogs);

  const ref = new Date();
  ref.setDate(ref.getDate() - weekOffset * 7);
  const days = getWeekDays(ref).map((date) => {
    const dateStr = formatDateISO(date);
    const workouts = workoutLogs.filter((l) => l.date === dateStr).length;
    return { date: dateStr, badge: workouts };
  });

  const handleWeekChange = (offset: number) => {
    setWeekOffset(offset);
    const weekRef = new Date();
    weekRef.setDate(weekRef.getDate() - offset * 7);
    const weekStrs = getWeekDays(weekRef).map((d) => formatDateISO(d));
    const today = formatDateISO();
    if (weekStrs.includes(today)) {
      setHomeSelectedDate(today);
    } else if (!weekStrs.includes(homeSelectedDate)) {
      setHomeSelectedDate(weekStrs[0]);
    }
  };

  return (
    <WeekPillCalendar
      weekOffset={weekOffset}
      onWeekChange={handleWeekChange}
      days={days}
      selectedDate={homeSelectedDate}
      onSelectDate={setHomeSelectedDate}
      allowFuture
    />
  );
}
