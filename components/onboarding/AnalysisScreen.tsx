'use client';

import { useState, useEffect } from 'react';
import GreenButton from '@/components/ui/GreenButton';
import { ChevronRight } from 'lucide-react';

const BARS = [
  { label: 'Profil', duration: 1200 },
  { label: 'Ciele', duration: 1800 },
  { label: 'Personalizácia', duration: 2200 },
];

export default function AnalysisScreen({ onNext }: { onNext: () => void }) {
  const [progress, setProgress] = useState([0, 0, 0]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const totalDuration = 2800;
    const tick = () => {
      const elapsed = Date.now() - start;
      const newProgress = BARS.map((bar) => {
        const p = Math.min(100, (elapsed / bar.duration) * 100);
        return Math.round(p);
      });
      setProgress(newProgress);
      const avg = newProgress.reduce((a, b) => a + b, 0) / 3;
      if (elapsed >= totalDuration) {
        setProgress([100, 100, 100]);
        setDone(true);
        return;
      }
      requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const circlePct = Math.round(progress.reduce((a, b) => a + b, 0) / 3);
  const circ = 2 * Math.PI * 70;
  const offset = circ * (1 - circlePct / 100);

  return (
    <div className="onboarding-screen flex flex-col items-center justify-center bg-black px-6 text-center safe-top safe-bottom">
      <h2 className="mb-10 text-2xl font-bold text-white drop-shadow-[0_0_24px_rgba(74,158,255,0.5)]">
        Tvoje odpovede sa analyzujú
      </h2>

      <div className="relative mb-10">
        <div className="absolute inset-0 m-auto h-40 w-40 rounded-full bg-accent-blue/20 blur-3xl" />
        <svg width={180} height={180} className="-rotate-90">
          <circle cx={90} cy={90} r={70} fill="none" stroke="rgba(74,158,255,0.15)" strokeWidth={10} />
          <circle
            cx={90} cy={90} r={70} fill="none"
            stroke="#4A9EFF" strokeWidth={10} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-accent-blue">{circlePct}%</span>
        </div>
      </div>

      <div className="mb-10 w-full max-w-xs space-y-4">
        {BARS.map((bar, i) => (
          <div key={bar.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-white/70">{bar.label}</span>
              <span className="text-accent-blue">{progress[i]}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-accent-blue transition-all duration-200"
                style={{ width: `${progress[i]}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mb-8 max-w-sm text-sm text-white/40">
        Skoro hotovo! Vytvárame tvoj individuálny plán na základe tvojich odpovedí a dát úspešných SurgeAI používateľov.
      </p>

      {done && (
        <GreenButton fullWidth pill onClick={onNext} className="max-w-xs">
          Ďalej <ChevronRight size={18} />
        </GreenButton>
      )}
    </div>
  );
}
