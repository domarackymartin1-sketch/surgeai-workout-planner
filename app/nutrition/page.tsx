'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import RingProgress from '@/components/ui/RingProgress';
import GreenButton from '@/components/ui/GreenButton';
import { useStore } from '@/lib/store';
import { formatDateISO } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function NutritionPage() {
  const profile = useStore((s) => s.profile);
  const getTodayNutrition = useStore((s) => s.getTodayNutrition);
  const addFood = useStore((s) => s.addFood);
  const removeFood = useStore((s) => s.removeFood);
  const nutritionLogs = useStore((s) => s.nutritionLogs);
  const [foodName, setFoodName] = useState('');
  const [foodKcal, setFoodKcal] = useState('');

  const today = getTodayNutrition();
  const target = profile?.dailyKcalTarget ?? 2500;
  const progress = today.totalKcal / target;
  const overLimit = today.totalKcal > target;

  const historyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = formatDateISO(d);
    const log = nutritionLogs.find((l) => l.date === dateStr);
    return {
      day: d.toLocaleDateString('sk-SK', { weekday: 'short' }),
      kcal: log?.totalKcal ?? 0,
    };
  });

  const handleAdd = () => {
    if (!foodName.trim() || !foodKcal) return;
    addFood({
      name: foodName.trim(),
      kcal: Number(foodKcal),
      protein: 0,
      carbs: 0,
      fat: 0,
    });
    setFoodName('');
    setFoodKcal('');
  };

  return (
    <div className="gradient-mesh min-h-dvh">
    <main className="page-container">
      <PageTransition>
        <h1 className="mb-6 font-display text-2xl font-bold">Nutrition</h1>

        <section className="mb-8 flex flex-col items-center">
          <RingProgress
            progress={Math.min(progress, 1)}
            size={180}
            strokeWidth={10}
            color={overLimit ? 'var(--danger)' : 'var(--accent-green)'}
          >
            <div className="text-center">
              <p className="font-display text-2xl font-bold">{today.totalKcal}</p>
              <p className="text-xs text-text-muted">/ {target} kcal</p>
            </div>
          </RingProgress>

          <div className="mt-6 w-full space-y-3">
            {['Bielkoviny', 'Sacharidy', 'Tuky'].map((macro, i) => {
              const values = [30, 45, 25];
              const val = values[i];
              return (
                <div key={macro}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-text-muted">{macro}</span>
                    <span>{val}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-accent-olive">
                    <div
                      className="h-full rounded-full bg-accent-green transition-all duration-1000"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 font-display text-lg font-bold">Pridať jedlo</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Názov jedla"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="flex-1 rounded-btn bg-bg-card px-4 py-3 text-sm outline-none"
            />
            <input
              type="number"
              placeholder="kcal"
              value={foodKcal}
              onChange={(e) => setFoodKcal(e.target.value)}
              className="w-20 rounded-btn bg-bg-card px-3 py-3 text-sm outline-none"
            />
          </div>
          <GreenButton fullWidth onClick={handleAdd} className="mt-3">
            + Pridať
          </GreenButton>

          <div className="mt-4 space-y-2">
            {today.items.map((item) => (
              <div key={item.id} className="card-surface flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-text-muted">{item.kcal} kcal</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFood(today.date, item.id)}
                  className="touch-manipulation p-2 text-text-muted"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-lg font-bold">História</h2>
          <div className="card-surface p-4">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={historyData}>
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--text-dim)', borderRadius: 8 }}
                  itemStyle={{ color: 'var(--accent-green)' }}
                />
                <Bar dataKey="kcal" fill="var(--accent-green)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </PageTransition>
    </main>
    </div>
  );
}
