'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import GreenButton from '@/components/ui/GreenButton';

const FEATURES = [
  {
    title: 'Inteligentná výživa',
    desc: 'AI zaznamenávanie jedál, detailné makro informácie, sledovanie vody a kalórií.',
    gradient: 'from-accent-green/20 to-accent-blue/10',
    mockLabel: 'Nutrition',
  },
  {
    title: 'Inteligentné tréningové plány',
    desc: 'Personalizované plány, knižnica cvikov, logovanie sérií a sledovanie progresu.',
    gradient: 'from-accent-blue/20 to-accent-purple/10',
    mockLabel: 'Workout',
  },
  {
    title: 'SurgeAI – Asistent',
    desc: 'Tvoj osobný AI tréner. Poradí s technikou, rozvrhom, regeneráciou a výživou.',
    gradient: 'from-accent-purple/20 to-accent-green/10',
    mockLabel: 'Surge AI',
  },
];

function PhoneMockup({ label, gradient }: { label: string; gradient: string }) {
  return (
    <div className="mx-auto w-[200px] rounded-[28px] border-4 border-white/10 bg-bg-card p-2 shadow-2xl">
      <div className={`flex h-[340px] flex-col rounded-[20px] bg-gradient-to-b ${gradient} p-4`}>
        <div className="mb-3 h-6 w-16 rounded-full bg-white/10" />
        <p className="mb-4 text-center text-xs font-bold text-white/80">{label}</p>
        <div className="mx-auto mb-3 h-24 w-24 rounded-full border-4 border-accent-green/30 bg-black/30" />
        <div className="mt-auto space-y-2">
          <div className="h-8 rounded-lg bg-white/10" />
          <div className="h-8 rounded-lg bg-white/10" />
          <div className="h-10 rounded-full bg-accent-green/40" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturesScreen({
  onFinish,
  onBack,
}: {
  onFinish: () => void;
  onBack: () => void;
}) {
  const [slide, setSlide] = useState(0);
  const feature = FEATURES[slide];

  return (
    <div className="onboarding-screen flex flex-col bg-black safe-top safe-bottom">
      <div className="flex items-center px-4 pt-4">
        <button type="button" onClick={onBack} className="touch-manipulation p-2 text-white/60">
          <ArrowLeft size={22} />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6">
        <PhoneMockup label={feature.mockLabel} gradient={feature.gradient} />

        <h2 className="mt-8 text-center text-2xl font-bold text-white">{feature.title}</h2>
        <p className="mt-3 text-center text-sm text-white/50">{feature.desc}</p>

        <div className="mt-6 flex justify-center gap-2">
          {FEATURES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all ${
                i === slide ? 'w-6 bg-accent-blue' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        <GreenButton
          fullWidth
          pill
          onClick={() => (slide < FEATURES.length - 1 ? setSlide(slide + 1) : onFinish())}
        >
          {slide < FEATURES.length - 1 ? 'Ďalej' : 'Začať trénovať ⚡'}
        </GreenButton>
      </div>
    </div>
  );
}
