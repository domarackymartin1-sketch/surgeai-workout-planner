'use client';

import { useState, useMemo } from 'react';
import { Settings, Flame, QrCode, Trash2, X } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import NutritionWeekStrip from '@/components/nutrition/NutritionWeekStrip';
import MacroDots from '@/components/nutrition/MacroDots';
import GreenButton from '@/components/ui/GreenButton';
import { useStore } from '@/lib/store';
import { formatDateISO } from '@/lib/utils';
import type { MealType } from '@/lib/types';

const MEAL_OPTIONS: { id: MealType; label: string }[] = [
  { id: 'breakfast', label: 'Raňajky' },
  { id: 'snack', label: 'Desiata' },
  { id: 'lunch', label: 'Obed' },
  { id: 'afternoon', label: 'Olovrant' },
  { id: 'dinner', label: 'Večera' },
];

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
      <h2 className="section-title">Denný cieľ</h2>
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
  const updateNutritionTargets = useStore((s) => s.updateNutritionTargets);
  const [foodName, setFoodName] = useState('');
  const [foodKcal, setFoodKcal] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [showSettings, setShowSettings] = useState(false);
  const [proteinGoal, setProteinGoal] = useState('');
  const [kcalGoal, setKcalGoal] = useState('');

  const selectedLog = getNutritionForDate(nutritionSelectedDate);
  const goal = profile?.dailyKcalTarget ?? 2500;
  const proteinTarget = profile?.dailyProteinTarget ?? Math.round((goal * 0.3) / 4);
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
    const carbsTarget = Math.round((goal * 0.45) / 4);
    const fatTarget = Math.round((goal * 0.25) / 9);
    return { protein, carbs, fat, proteinTarget, carbsTarget, fatTarget };
  }, [selectedLog.items, goal, proteinTarget]);

  const itemsByMeal = useMemo(() => {
    const grouped: Record<MealType, typeof selectedLog.items> = {
      breakfast: [],
      snack: [],
      lunch: [],
      afternoon: [],
      dinner: [],
    };
    selectedLog.items.forEach((item) => {
      grouped[item.mealType ?? 'lunch'].push(item);
    });
    return grouped;
  }, [selectedLog]);

  const handleAdd = () => {
    if (!foodName.trim() || !foodKcal) return;
    const kcal = Number(foodKcal);
    addFood(
      {
        name: foodName.trim(),
        kcal,
        mealType,
        protein: Math.round((kcal * 0.3) / 4),
        carbs: Math.round((kcal * 0.45) / 4),
        fat: Math.round((kcal * 0.25) / 9),
      },
      nutritionSelectedDate
    );
    setFoodName('');
    setFoodKcal('');
  };

  const openSettings = () => {
    setProteinGoal(String(proteinTarget));
    setKcalGoal(String(goal));
    setShowSettings(true);
  };

  const saveSettings = () => {
    const p = Number(proteinGoal);
    const k = Number(kcalGoal);
    updateNutritionTargets({
      ...(p > 0 && { dailyProteinTarget: p }),
      ...(k > 0 && { dailyKcalTarget: k }),
    });
    setShowSettings(false);
  };

  return (
    <div className="gradient-mesh app-screen">
      <main className="page-container">
        <PageTransition>
          <header className="mb-6 grid grid-cols-[44px_1fr_88px] items-center gap-2 px-1 pt-1">
            <button
              type="button"
              onClick={openSettings}
              className="glass flex h-10 w-10 items-center justify-center rounded-xl text-white/50"
              aria-label="Nastavenia"
            >
              <Settings size={18} />
            </button>
            <div className="flex items-center justify-center gap-2">
              <h1 className="page-title mb-0 text-xl">Nutrition</h1>
              <span className="rounded-md bg-accent-green px-1.5 py-0.5 text-[10px] font-bold text-black">PRO</span>
            </div>
            <div className="flex justify-end gap-2">
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
              <button
                type="button"
                onClick={openSettings}
                className="mt-4 w-full text-center text-xs text-accent-green underline"
              >
                Upraviť denné ciele
              </button>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="section-title">
              Pridať jedlo {isToday ? '' : `– ${dateLabel}`}
            </h2>

            <div className="mb-3 flex flex-wrap justify-center gap-1.5">
              {MEAL_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMealType(m.id)}
                  className={`touch-manipulation rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    mealType === m.id
                      ? 'bg-accent-green text-black'
                      : 'bg-bg-card text-text-muted'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Názov jedla"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="glass-card flex-1 px-4 py-3 text-sm outline-none"
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="kcal"
                value={foodKcal}
                onChange={(e) => setFoodKcal(e.target.value.replace(/[^0-9]/g, ''))}
                className="glass-card w-20 px-3 py-3 text-sm outline-none"
              />
            </div>
            <GreenButton fullWidth pill onClick={handleAdd} className="mt-3">
              + Pridať
            </GreenButton>

            <div className="mt-6 space-y-5">
              {selectedLog.items.length === 0 ? (
                <p className="py-6 text-center text-sm text-white/30">Žiadne jedlá v tento deň</p>
              ) : (
                MEAL_OPTIONS.map((meal) => {
                  const items = itemsByMeal[meal.id];
                  if (items.length === 0) return null;
                  const mealKcal = items.reduce((s, i) => s + i.kcal, 0);
                  return (
                    <div key={meal.id}>
                      <div className="mb-2 flex items-center justify-between px-1">
                        <h3 className="text-sm font-semibold text-white/70">{meal.label}</h3>
                        <span className="text-xs text-white/40">{mealKcal} kcal</span>
                      </div>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="glass-card flex items-center justify-between p-4">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-white/40">{item.kcal} kcal</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFood(selectedLog.date, item.id)}
                              className="touch-manipulation rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-danger"
                              aria-label="Vymazať"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </PageTransition>
      </main>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5">
          <div className="w-full max-w-sm rounded-card bg-bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold">Denné ciele</h3>
              <button type="button" onClick={() => setShowSettings(false)} className="p-1 text-white/50">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-text-muted">Kalórie (kcal)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={kcalGoal}
                  onChange={(e) => setKcalGoal(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full rounded-btn bg-bg-surface px-4 py-3 text-lg font-bold outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-muted">Bielkoviny (g)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={proteinGoal}
                  onChange={(e) => setProteinGoal(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full rounded-btn bg-bg-surface px-4 py-3 text-lg font-bold text-accent-blue outline-none"
                />
              </div>
            </div>
            <GreenButton fullWidth pill onClick={saveSettings} className="mt-6">
              Uložiť ciele
            </GreenButton>
          </div>
        </div>
      )}
    </div>
  );
}
