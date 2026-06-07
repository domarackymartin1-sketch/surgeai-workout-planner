'use client';

import { useState, useMemo } from 'react';
import { Settings, Flame, QrCode, Trash2 } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import NutritionWeekStrip from '@/components/nutrition/NutritionWeekStrip';
import MacroDots from '@/components/nutrition/MacroDots';
import GreenButton from '@/components/ui/GreenButton';
import { useStore } from '@/lib/store';
import { formatDateISO } from '@/lib/utils';

function CalorieArc({ consumed, goal }: { consumed: number; goal: number }) {
  const size = 220;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const progress = Math.min(consumed / goal, 1);
  const offset = circ * (1 - progress);
  const remaining = Math.max(goal - consumed, 0);

  return (
    <section className="mb-8 text-center">
      <h2 className="mb-6 text-left text-lg font-bold text-white">Denný cieľ</h2>
      <div className="relative mx-auto flex max-w-sm items-center justify-center">
        <p className="absolute left-0 text-center">
          <span className="block text-2xl font-bold text-white">{remaining}</span>
          <span className="text-xs text-white/40">Zostáva</span>
        </p>
        <div className="relative">
          <div className="absolute inset-0 m-auto h-40 w-40 rounded-full bg-accent-green/20 blur-3xl" />
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,255,102,0.15)" strokeWidth={stroke} />
            <circle
              cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke="url(#calGrad)" strokeWidth={stroke} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={offset}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00CC52" />
                <stop offset="100%" stopColor="#00FF66" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white">{consumed}</span>
            <span className="text-sm text-white/50">Kcal</span>
          </div>
        </div>
        <p className="absolute right-0 text-center">
          <span className="block text-2xl font-bold text-white">{goal}</span>
          <span className="text-xs text-white/40">Cieľ</span>
        </p>
      </div>
    </section>
  );
}

export default function NutritionPage() {
  const profile = useStore((s) => s.profile);
  const nutritionSelectedDate = useStore((s) => s.nutritionSelectedDate);
  const getNutritionForDate = useStore((s) => s.getNutritionForDate);
  const addFood = useStore((s) => s.addFood);
  const removeFood = useStore((s) => s.removeFood);
  const [foodName, setFoodName] = useState('');
  const [foodKcal, setFoodKcal] = useState('');

  const selectedLog = getNutritionForDate(nutritionSelectedDate);
  const goal = profile?.dailyKcalTarget ?? 2500;
  const today = formatDateISO();
  const isToday = nutritionSelectedDate === today;

  const dateLabel = isToday
    ? 'Dnes'
    : new Date(nutritionSelectedDate).toLocaleDateString('sk-SK', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });

  const macros = useMemo(() => {
    const protein = selectedLog.items.reduce((s, i) => s + (i.protein ?? i.kcal * 0.3 / 4), 0);
    const carbs = selectedLog.items.reduce((s, i) => s + (i.carbs ?? i.kcal * 0.45 / 4), 0);
    const fat = selectedLog.items.reduce((s, i) => s + (i.fat ?? i.kcal * 0.25 / 9), 0);
    const proteinTarget = Math.round((goal * 0.3) / 4);
    const carbsTarget = Math.round((goal * 0.45) / 4);
    const fatTarget = Math.round((goal * 0.25) / 9);
    return { protein, carbs, fat, proteinTarget, carbsTarget, fatTarget };
  }, [selectedLog.items, goal]);

  const handleAdd = () => {
    if (!foodName.trim() || !foodKcal) return;
    const kcal = Number(foodKcal);
    addFood({
      name: foodName.trim(),
      kcal,
      protein: Math.round((kcal * 0.3) / 4),
      carbs: Math.round((kcal * 0.45) / 4),
      fat: Math.round((kcal * 0.25) / 9),
    }, nutritionSelectedDate);
    setFoodName('');
    setFoodKcal('');
  };

  return (
    <div className="gradient-mesh min-h-dvh">
      <main className="page-container">
        <PageTransition>
          <header className="mb-6 flex items-center justify-between">
            <button type="button" className="glass flex h-10 w-10 items-center justify-center rounded-xl text-white/50">
              <Settings size={18} />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">Nutrition</h1>
              <span className="rounded-md bg-accent-green px-1.5 py-0.5 text-[10px] font-bold text-black">PRO</span>
            </div>
            <div className="flex gap-2">
              <button type="button" className="glass flex h-10 w-10 items-center justify-center rounded-xl text-white/50">
                <Flame size={18} />
              </button>
              <button type="button" className="glass flex h-10 w-10 items-center justify-center rounded-xl text-white/50">
                <QrCode size={18} />
              </button>
            </div>
          </header>

          <NutritionWeekStrip />
          <p className="mb-4 text-center text-sm text-white/50">
            {isToday ? (
              <span className="font-semibold text-accent-green">● Dnes</span>
            ) : (
              <span className="capitalize">{dateLabel}</span>
            )}
          </p>

          <CalorieArc consumed={selectedLog.totalKcal} goal={goal} />

          <section className="mb-8">
            <div className="glass-card mx-auto max-w-sm p-5">
              <div className="flex justify-between gap-4">
                <MacroDots label="Bielkoviny" color="#4A9EFF" current={macros.protein} target={macros.proteinTarget} />
                <MacroDots label="Sacharidy" color="#FF8C42" current={macros.carbs} target={macros.carbsTarget} />
                <MacroDots label="Tuky" color="#00FF66" current={macros.fat} target={macros.fatTarget} />
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-white">
              Pridať jedlo {isToday ? '' : `– ${dateLabel}`}
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Názov jedla"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="glass-card flex-1 px-4 py-3 text-sm outline-none"
              />
              <input
                type="number"
                placeholder="kcal"
                value={foodKcal}
                onChange={(e) => setFoodKcal(e.target.value)}
                className="glass-card w-20 px-3 py-3 text-sm outline-none"
              />
            </div>
            <GreenButton fullWidth pill onClick={handleAdd} className="mt-3">
              + Pridať
            </GreenButton>

            <div className="mt-4 space-y-2">
              {selectedLog.items.length === 0 ? (
                <p className="py-6 text-center text-sm text-white/30">Žiadne jedlá v tento deň</p>
              ) : (
                selectedLog.items.map((item) => (
                  <div key={item.id} className="glass-card flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-white/40">{item.kcal} kcal</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFood(selectedLog.date, item.id)}
                      className="touch-manipulation p-2 text-white/40"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </PageTransition>
      </main>
    </div>
  );
}
