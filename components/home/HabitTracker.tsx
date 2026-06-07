'use client';

import { Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { HabitId } from '@/lib/types';
import { HABIT_LABELS } from '@/lib/utils';

const HABIT_EMOJI: Record<HabitId, string> = {
  water: '💧',
  sleep: '😴',
  stretching: '🧘',
  steps: '👟',
  meditation: '🧠',
  protein: '🥩',
};

export default function HabitTracker() {
  const profile = useStore((s) => s.profile);
  const toggleHabit = useStore((s) => s.toggleHabit);
  const getTodayHabits = useStore((s) => s.getTodayHabits);
  const completed = getTodayHabits();
  const habits = profile?.habits ?? [];

  if (habits.length === 0) return null;

  const doneCount = habits.filter((h) => completed.includes(h)).length;

  return (
    <section className="mb-6 text-center">
      <div className="mb-3 flex items-center justify-center gap-2">
        <h2 className="text-base font-bold text-white/90">Denné návyky</h2>
        <span className="text-xs text-accent-green">{doneCount}/{habits.length}</span>
      </div>
      <div className="glass-card mx-auto max-w-sm p-4">
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent-green transition-all duration-500"
            style={{ width: `${(doneCount / habits.length) * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {habits.map((habit) => {
            const done = completed.includes(habit);
            return (
              <button
                key={habit}
                type="button"
                onClick={() => toggleHabit(habit)}
                className={`touch-manipulation flex items-center gap-2 rounded-xl p-3 text-left transition-all ${
                  done ? 'glass-pill-active' : 'bg-white/5'
                }`}
              >
                <span className="text-lg">{HABIT_EMOJI[habit]}</span>
                <span className={`flex-1 text-sm font-medium ${done ? 'text-accent-green' : 'text-white/70'}`}>
                  {HABIT_LABELS[habit]}
                </span>
                {done && <Check size={16} className="text-accent-green" />}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
