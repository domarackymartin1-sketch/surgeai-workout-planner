'use client';

import { ArrowLeft } from 'lucide-react';
import GreenButton from '@/components/ui/GreenButton';

const REVIEWS = [
  {
    name: 'Sarah M.',
    age: 19,
    text: 'Štruktúrované tréningové programy SurgeAI mi pomohli prekonať moje limity. Kombinácia silového a kardio tréningu bola presne to, čo som potrebovala!',
    result: 'Schudla 12 kg za 3 mesiace',
    avatar: 'SM',
  },
  {
    name: 'Michael K.',
    age: 22,
    text: 'V mojom veku by som nikdy nepomyslel, že budem v najlepšej forme môjho života. Tréningové programy SurgeAI mi pomohli budovať svaly a pritom zostať bez zranení.',
    result: 'Nabral 8 kg svalovej hmoty',
    avatar: 'MK',
  },
  {
    name: 'Elena V.',
    age: 27,
    text: 'Nutrition sekcia s makrami a sledovaním vody mi konečne dáva prehľad. Surge AI asistent mi každý deň poradí s tréningom.',
    result: 'Dosiahla denné ciele 30 dní v rade',
    avatar: 'EV',
  },
  {
    name: 'Tomáš R.',
    age: 31,
    text: 'Habit tracker a týždenný prehľad ma držia motivovaného. Aplikácia je prehľadná, moderná a naozaj funguje na mobile.',
    result: 'Zvýšil silu o 40 % za 6 mesiacov',
    avatar: 'TR',
  },
];

export default function ReviewsScreen({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="onboarding-screen flex flex-col bg-black safe-top safe-bottom">
      <div className="flex items-center px-4 pt-4">
        <button type="button" onClick={onBack} className="touch-manipulation p-2 text-white/60">
          <ArrowLeft size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 no-overscroll">
        <div className="mb-2 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-blue/20 text-2xl">
            🏋️
          </div>
        </div>
        <h2 className="mb-2 text-center text-2xl font-bold text-white">Skutočné výsledky</h2>
        <p className="mb-6 text-center text-sm text-white/40">
          Pozri, ako SurgeAI transformuje životy prostredníctvom fitness
        </p>

        <div className="space-y-4">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-2xl bg-accent-blue/10 p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-blue/30 text-xs font-bold text-white">
                  {r.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white">{r.name}</p>
                  <p className="text-xs text-white/40">{r.age} rokov</p>
                </div>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/80">&ldquo;{r.text}&rdquo;</p>
              <span className="inline-block rounded-full bg-accent-blue/20 px-3 py-1.5 text-xs font-medium text-accent-blue">
                {r.result}
              </span>
            </div>
          ))}
        </div>

        <GreenButton fullWidth pill onClick={onNext} className="mt-8">
          Pokračovať ďalej
        </GreenButton>
      </div>
    </div>
  );
}
