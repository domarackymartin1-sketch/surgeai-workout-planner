'use client';

import { useEffect, useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import DashboardTopBar from '@/components/home/DashboardTopBar';
import WeekCalendar from '@/components/home/WeekCalendar';
import WorkoutWeekPlan from '@/components/home/WorkoutWeekPlan';
import WeeklyOverview from '@/components/home/WeeklyOverview';
import HabitTracker from '@/components/home/HabitTracker';
import BMICard from '@/components/home/BMICard';
import TodayPlanCard from '@/components/home/TodayPlanCard';
import Onboarding from '@/components/onboarding/Onboarding';
import { useStore } from '@/lib/store';

export default function HomePage() {
  const profile = useStore((s) => s.profile);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <div className="min-h-dvh min-h-svh bg-black" />;
  }

  if (!profile?.onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <div className="gradient-mesh min-h-dvh min-h-svh">
      <main className="page-container">
        <PageTransition>
          <DashboardTopBar />
          <WeekCalendar />
          <WorkoutWeekPlan />
          <WeeklyOverview />
          <HabitTracker />
          <BMICard />

          <section className="mb-6">
            <h2 className="mb-3 font-display text-base font-bold text-white/90">
              Dnešný tréning
            </h2>
            <TodayPlanCard />
          </section>
        </PageTransition>
      </main>
    </div>
  );
}
