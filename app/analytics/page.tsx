'use client';

import { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
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
    <main className="page-container min-h-dvh bg-bg-primary">
      <PageTransition>
        <h1 className="mb-6 font-display text-2xl font-bold">Analytics</h1>

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Váha</h2>
            <button
              type="button"
              onClick={() => setShowWeightForm(!showWeightForm)}
              className="touch-manipulation text-sm text-accent-green"
            >
              + Zaznamenať váhu
            </button>
          </div>
          {showWeightForm && (
            <div className="mb-4 flex gap-2">
              <input
                type="number"
                placeholder="kg"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="flex-1 rounded-btn bg-bg-card px-4 py-3 outline-none"
              />
              <GreenButton onClick={handleAddWeight}>Uložiť</GreenButton>
            </div>
          )}
          <div className="card-surface p-4">
            <WeightChart data={profile?.weight ?? []} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 font-display text-lg font-bold">Osobné Rekordy (PR)</h2>
          <PRTable prs={prs} />
        </section>

        <section className="mb-8">
          <h2 className="mb-4 font-display text-lg font-bold">Tréningový objem</h2>
          <div className="card-surface p-4">
            <VolumeChart data={volumeData} />
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg font-bold">Telesné miery</h2>
          <div className="card-surface p-4">
            {profile?.bodyMeasurements && profile.bodyMeasurements.length > 0 ? (
              profile.bodyMeasurements.map((m) => (
                <div key={m.date} className="mb-2 text-sm text-text-muted">
                  {new Date(m.date).toLocaleDateString('sk-SK')}:{' '}
                  {m.chest && `Hrudník ${m.chest}cm `}
                  {m.waist && `Pas ${m.waist}cm `}
                  {m.biceps && `Biceps ${m.biceps}cm`}
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-text-muted">
                Zaznamenávaj miery v budúcej verzii
              </p>
            )}
          </div>
        </section>
      </PageTransition>
    </main>
  );
}
