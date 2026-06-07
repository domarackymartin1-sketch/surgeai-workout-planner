'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import FitnessScore from '@/components/analytics/FitnessScore';
import PRTable from '@/components/analytics/PRTable';
import VolumeChart from '@/components/analytics/VolumeChart';
import { useStore } from '@/lib/store';
import { getWeekVolume } from '@/lib/utils';

type Tab = 'score' | 'training';

export default function ProgressSection() {
  const [tab, setTab] = useState<Tab>('score');
  const prs = useStore((s) => s.prs);
  const workoutLogs = useStore((s) => s.workoutLogs);

  const volumeData = Array.from({ length: 4 }, (_, i) => {
    const weekNum = 4 - i;
    const volume = getWeekVolume(workoutLogs, i);
    return { week: `T${weekNum}`, volume: Math.round(volume) };
  }).reverse();

  return (
    <section className="glass-card mb-6 p-4">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp size={16} className="text-white/50" />
        <h2 className="text-base font-bold text-white">Progress</h2>
      </div>

      <div className="mb-5 flex gap-2 rounded-2xl bg-white/5 p-1">
        <button
          type="button"
          onClick={() => setTab('score')}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
            tab === 'score'
              ? 'border border-accent-green/40 bg-accent-green/10 text-accent-green'
              : 'text-white/50'
          }`}
        >
          Fitness Score
        </button>
        <button
          type="button"
          onClick={() => setTab('training')}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
            tab === 'training'
              ? 'border border-accent-green/40 bg-accent-green/10 text-accent-green'
              : 'bg-white/8 text-white/70'
          }`}
        >
          Training
        </button>
      </div>

      {tab === 'score' ? (
        <FitnessScore compact />
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-left text-sm font-bold text-white/70">Osobné rekordy</h3>
            <PRTable prs={prs} />
          </div>
          <div>
            <h3 className="mb-3 text-left text-sm font-bold text-white/70">Objem</h3>
            <VolumeChart data={volumeData} />
          </div>
        </div>
      )}
    </section>
  );
}
