'use client';

import { useStore } from '@/lib/store';
import { calculateBMI, getBMICategory } from '@/lib/utils';
import RingProgress from '@/components/ui/RingProgress';

export default function BMICard() {
  const profile = useStore((s) => s.profile);
  const bmi = profile?.bmi || (profile ? calculateBMI(profile.weightKg, profile.heightCm) : 0);
  if (!profile || !bmi) return null;

  const cat = getBMICategory(bmi);
  const progress = Math.min(bmi / 35, 1);

  return (
    <section className="mb-6">
      <h2 className="mb-3 font-display text-base font-bold text-white/90">BMI Kalkulačka</h2>
      <div className="glass-card flex items-center gap-4 p-4">
        <RingProgress progress={progress} size={72} strokeWidth={6} color={cat.color}>
          <span className="font-display text-lg font-bold" style={{ color: cat.color }}>
            {bmi}
          </span>
        </RingProgress>
        <div className="flex-1">
          <p className="font-display text-xl font-bold" style={{ color: cat.color }}>{cat.label}</p>
          <p className="mt-1 text-xs text-white/40">
            {profile.heightCm} cm · {profile.weightKg} kg
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-white/35">
            Normálne BMI: 18.5 – 24.9
          </p>
        </div>
      </div>
    </section>
  );
}
