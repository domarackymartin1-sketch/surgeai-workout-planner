'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PointsCard from '@/components/profile/PointsCard';
import ProgressSection from '@/components/profile/ProgressSection';
import HabitTrackerWeekly from '@/components/habits/HabitTrackerWeekly';
import WeightChart from '@/components/analytics/WeightChart';
import { useStore } from '@/lib/store';

export default function ProfilePage() {
  const profile = useStore((s) => s.profile);

  return (
    <div className="gradient-mesh app-screen">
      <main className="page-container !px-0">
        <PageTransition>
          <ProfileHeader />

          <div className="px-4">
            <PointsCard />
            <ProgressSection />
            <HabitTrackerWeekly />

            <Link
              href="/bmi"
              className="glass-card mb-6 flex items-center justify-between p-5"
            >
              <div className="text-left">
                <p className="score-title text-sm font-bold text-accent-green">BMI Kalkulačka</p>
                <p className="text-xs text-white/40">Výška, váha, zdravý rozsah</p>
              </div>
              <ChevronRight size={20} className="text-white/30" />
            </Link>

            <section className="mb-8">
              <h2 className="mb-4 text-lg font-bold text-white">Váha</h2>
              <div className="glass-card p-4">
                <WeightChart data={profile?.weight ?? []} />
              </div>
            </section>
          </div>
        </PageTransition>
      </main>
    </div>
  );
}
