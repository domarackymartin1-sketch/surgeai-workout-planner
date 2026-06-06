'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import CalendarStrip from '@/components/home/CalendarStrip';
import StepsCard from '@/components/home/StepsCard';
import CaloriesRing from '@/components/home/CaloriesRing';
import VolumeRing from '@/components/home/VolumeRing';
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
    return <div className="min-h-dvh bg-bg-primary" />;
  }

  if (!profile?.onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <div className="gradient-mesh min-h-dvh">
      <main className="page-container">
        <PageTransition>
          <Header name={profile.name} />
          <CalendarStrip />

          <section className="mb-6">
            <h2 className="mb-4 font-display text-lg font-bold tracking-wide text-white/90">
              Dnešný prehľad
            </h2>
            <StepsCard />
            <div className="flex gap-3">
              <CaloriesRing />
              <VolumeRing />
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-lg font-bold tracking-wide text-white/90">
              Tvoj Tréningový Plán
            </h2>
            <TodayPlanCard />
          </section>
        </PageTransition>
      </main>
    </div>
  );
}
