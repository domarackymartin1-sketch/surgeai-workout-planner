'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculateBMI, getBMICategory } from '@/lib/utils';
import { useStore } from '@/lib/store';
import GreenButton from '@/components/ui/GreenButton';
import RingProgress from '@/components/ui/RingProgress';

export default function BMICalculator({ standalone = false }: { standalone?: boolean }) {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const updateBodyStats = useStore((s) => s.updateBodyStats);
  const [height, setHeight] = useState(profile?.heightCm?.toString() ?? '');
  const [weight, setWeight] = useState(profile?.weightKg?.toString() ?? '');
  const [saved, setSaved] = useState(false);

  const heightNum = Number(height);
  const weightNum = Number(weight);
  const bmi = heightNum > 0 && weightNum > 0 ? calculateBMI(weightNum, heightNum) : 0;
  const cat = bmi > 0 ? getBMICategory(bmi) : null;
  const canSave = heightNum > 0 && weightNum > 0;

  const handleSave = () => {
    if (!canSave) return;
    updateBodyStats(heightNum, weightNum);
    setSaved(true);
    setTimeout(() => {
      if (standalone) router.back();
      else setSaved(false);
    }, 1200);
  };

  return (
    <div className={`${standalone ? '' : 'glass-card'} p-5 text-center`}>
      {standalone && (
        <h1 className="score-title mb-2 text-2xl font-bold text-accent-green">BMI Kalkulačka</h1>
      )}
      {!standalone && (
        <h2 className="mb-4 text-left text-lg font-bold text-white">BMI Kalkulačka</h2>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="glass-card p-4 text-left">
          <label className="text-xs text-white/40">Výška (cm)</label>
          <input
            type="text"
            inputMode="numeric"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value.replace(/[^0-9]/g, ''));
              setSaved(false);
            }}
            placeholder="175"
            className="mt-1 w-full bg-transparent text-2xl font-bold text-white outline-none"
          />
        </div>
        <div className="glass-card p-4 text-left">
          <label className="text-xs text-white/40">Váha (kg)</label>
          <input
            type="text"
            inputMode="decimal"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value.replace(/[^0-9.,]/g, ''));
              setSaved(false);
            }}
            placeholder="75"
            className="mt-1 w-full bg-transparent text-2xl font-bold text-white outline-none"
          />
        </div>
      </div>

      {bmi > 0 && cat && (
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div
              className="absolute inset-0 m-auto h-32 w-32 rounded-full opacity-30 blur-2xl"
              style={{ background: cat.color }}
            />
            <RingProgress
              progress={Math.min(bmi / 35, 1)}
              size={140}
              strokeWidth={8}
              color={cat.color}
            >
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: cat.color }}>{bmi}</p>
                <p className="text-xs text-white/50">BMI</p>
              </div>
            </RingProgress>
          </div>
          <p className="text-xl font-bold" style={{ color: cat.color }}>{cat.label}</p>
          <p className="mt-2 text-sm text-white/40">
            Zdravý rozsah: 18.5 – 24.9
          </p>
        </div>
      )}

      <GreenButton fullWidth pill onClick={handleSave} disabled={!canSave || saved}>
        {saved ? 'Uložené ✓' : 'Uložiť váhu'}
      </GreenButton>
    </div>
  );
}
