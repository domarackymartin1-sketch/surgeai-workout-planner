'use client';

import { useStore } from '@/lib/store';
import { formatDateISO, getWeekDays } from '@/lib/utils';

export default function WeeklyOverview() {
  const workoutLogs = useStore((s) => s.workoutLogs);
  const weekOffset = useStore((s) => s.weekOffset);
  const getTodaySteps = useStore((s) => s.getTodaySteps);

  const ref = new Date();
  ref.setDate(ref.getDate() - weekOffset * 7);
  const days = getWeekDays(ref);
  const dayStrings = days.map((d) => formatDateISO(d));

  const weekLogs = workoutLogs.filter((l) => dayStrings.includes(l.date));
  const workoutsDone = weekLogs.length;
  const totalMinutes = weekLogs.reduce((s, l) => s + l.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const tonsLifted = Math.round(weekLogs.reduce((s, l) => s + l.totalVolume, 0) / 1000);
  const steps = getTodaySteps();

  const stats = [
    { value: String(workoutsDone), label: 'Tréningov' },
    { value: `${hours}:${String(mins).padStart(2, '0')}`, label: 'Hodín' },
    { value: String(tonsLifted || 0), label: 'Tonáž' },
    { value: String(Math.round(steps.distanceKm)), label: 'Km' },
  ];

  return (
    <section className="mb-6 text-center">
      <h2 className="mb-4 text-base font-bold text-white/90">Týždenný prehľad 📈</h2>
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card flex flex-col items-center justify-center px-4 py-5">
            <span className="text-3xl font-bold text-white">{stat.value}</span>
            <span className="mt-1 text-[11px] text-white/40">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
