'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import FitnessScore from '@/components/analytics/FitnessScore';
import WeightChart from '@/components/analytics/WeightChart';
import PRTable from '@/components/analytics/PRTable';
import VolumeChart from '@/components/analytics/VolumeChart';
import GreenButton from '@/components/ui/GreenButton';
import { useStore } from '@/lib/store';
import { getWeekVolume } from '@/lib/utils';

export default function AnalyticsPage() {
  const profile = useStore((s) => s.profile);
  const prs = useStore((s) => s.prs);
  const workoutLogs = useStore((s) => s.workoutLogs);
  const addWeight = useStore((s) => s.addWeight);
  const [weightInput, setWeightInput] = useState('');
  const [showWeightForm, setShowWeightForm] = useState(false);

  const volumeData = Array.from({ length: 4 }, (_, i) => {
    const weekNum = 4 - i;
    const volume = getWeekVolume(workoutLogs, i);
    return { week: `T${weekNum}`, volume: Math.round(volume) };
  }).reverse();

  const handleAddWeight = () => {
    const w = Number(weightInput);
    if (w > 0) {
      addWeight(w);
      setWeightInput('');
      setShowWeightForm(false);
    }
  };

  return (
    <div className="gradient-mesh min-h-dvh">
      <main className="page-container">
        <PageTransition>
          <FitnessScore />

          <Link
            href="/bmi"
            className="glass-card mb-8 flex items-center justify-between p-5 transition-opacity active:opacity-80"
          >
            <div className="text-left">
              <p className="score-title text-sm font-bold text-accent-green">BMI Kalkulačka</p>
              <p className="text-xs text-white/40">Výška, váha, zdravý rozsah</p>
            </div>
            <ChevronRight size={20} className="text-white/30" />
          </Link>

          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Váha</h2>
              <button
                type="button"
                onClick={() => setShowWeightForm(!showWeightForm)}
                className="touch-manipulation text-sm text-accent-green"
              >
                + Zaznamenať
              </button>
            </div>
            {showWeightForm && (
              <div className="mb-4 flex gap-2">
                <input
                  type="number"
                  placeholder="kg"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="glass-card flex-1 px-4 py-3 outline-none"
                />
                <GreenButton onClick={handleAddWeight}>Uložiť</GreenButton>
              </div>
            )}
            <div className="glass-card p-4">
              <WeightChart data={profile?.weight ?? []} />
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-white">Osobné Rekordy</h2>
            <PRTable prs={prs} />
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-white">Tréningový objem</h2>
            <div className="glass-card p-4">
              <VolumeChart data={volumeData} />
            </div>
          </section>
        </PageTransition>
      </main>
    </div>
  );
}
