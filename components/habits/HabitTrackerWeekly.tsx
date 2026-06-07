'use client';

import { useState } from 'react';
import { CheckCircle2, Pencil, Plus, X, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { HabitId } from '@/lib/types';
import { formatDateISO, getWeekDays, HABIT_LABELS } from '@/lib/utils';

const HABIT_ICONS: Record<HabitId, string> = {
  water: '💧',
  sleep: '💤',
  stretching: '🤸',
  steps: '👟',
  meditation: '🧘',
  protein: '🥩',
};

const ALL_HABITS: HabitId[] = ['water', 'sleep', 'stretching', 'steps', 'meditation', 'protein'];
const DAY_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function getStreak(habitId: HabitId, habitLogs: { date: string; completed: HabitId[] }[]): number {
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const dateStr = formatDateISO(d);
    const log = habitLogs.find((l) => l.date === dateStr);
    if (log?.completed.includes(habitId)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else if (i === 0) {
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function HabitTrackerWeekly() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const habitLogs = useStore((s) => s.habitLogs);
  const weekOffset = useStore((s) => s.weekOffset);
  const toggleHabitForDate = useStore((s) => s.toggleHabitForDate);
  const habits = profile?.habits ?? [];
  const [selected, setSelected] = useState<HabitId | null>(habits[0] ?? null);
  const [showEditor, setShowEditor] = useState(false);
  const [draftHabits, setDraftHabits] = useState<HabitId[]>(habits);

  const ref = new Date();
  ref.setDate(ref.getDate() - weekOffset * 7);
  const weekDays = getWeekDays(ref);
  const weekDateStrs = weekDays.map(formatDateISO);

  if (habits.length === 0 && !showEditor) return null;

  const isCompleted = (habitId: HabitId, date: string) =>
    habitLogs.find((l) => l.date === date)?.completed.includes(habitId) ?? false;

  const weekCount = (habitId: HabitId) =>
    weekDateStrs.filter((d) => isCompleted(habitId, d)).length;

  const allTimeCount = (habitId: HabitId) =>
    habitLogs.filter((l) => l.completed.includes(habitId)).length;

  const activeHabit = selected ?? habits[0];

  const openEditor = () => {
    setDraftHabits(habits);
    setShowEditor(true);
  };

  const toggleDraft = (h: HabitId) => {
    setDraftHabits((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
    );
  };

  const saveHabits = () => {
    if (draftHabits.length > 0) {
      updateProfile({ habits: draftHabits });
      if (!draftHabits.includes(activeHabit!)) setSelected(draftHabits[0]);
    }
    setShowEditor(false);
  };

  return (
    <section className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-accent-green" />
          <h2 className="text-base font-bold text-white">Habit Tracker</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={openEditor}
            className="glass flex h-9 w-9 items-center justify-center rounded-xl text-white/50"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={openEditor}
            className="glass flex h-9 w-9 items-center justify-center rounded-xl text-white/50"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden p-4">
        <div className="mb-3 grid grid-cols-[40px_repeat(7,1fr)_32px] items-center gap-1 text-center text-[10px] text-white/35">
          <span />
          {DAY_HEADERS.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
          <span>📈</span>
        </div>

        {habits.map((habit) => {
          const isActive = habit === activeHabit;
          const done = weekCount(habit);
          return (
            <button
              key={habit}
              type="button"
              onClick={() => setSelected(habit)}
              className={`mb-2 grid w-full grid-cols-[40px_repeat(7,1fr)_32px] items-center gap-1 rounded-xl py-2 text-left transition-colors ${
                isActive ? 'bg-accent-green/5' : ''
              }`}
            >
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <span className="absolute -left-3 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-accent-green" />
                )}
                <span className="text-lg">{HABIT_ICONS[habit]}</span>
              </div>
              {weekDateStrs.map((dateStr) => {
                const doneDay = isCompleted(habit, dateStr);
                return (
                  <div
                    key={dateStr}
                    className="flex justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHabitForDate(habit, dateStr);
                    }}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                        doneDay
                          ? 'border-accent-green/30 bg-accent-green/25'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      {doneDay && <span className="h-2 w-2 rounded-sm bg-accent-green" />}
                    </span>
                  </div>
                );
              })}
              <span className="text-center text-[10px] text-white/40">{done}/7</span>
            </button>
          );
        })}
      </div>

      {activeHabit && (
        <div className="glass-card mt-4 p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">{HABIT_LABELS[activeHabit]}</h3>
            <span className="text-2xl">{HABIT_ICONS[activeHabit]}</span>
          </div>
          <div className="mb-5 grid grid-cols-3 gap-3">
            {[
              { val: weekCount(activeHabit), label: 'Tento týždeň' },
              { val: getStreak(activeHabit, habitLogs), label: 'Streak' },
              { val: allTimeCount(activeHabit), label: 'Celkovo' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/5 p-3 text-center">
                <p className="text-2xl font-bold text-white">{s.val}</p>
                <p className="mt-1 text-[10px] text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-4 pb-28">
          <div className="w-full max-w-lg rounded-card bg-bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Upraviť návyky</h3>
              <button type="button" onClick={() => setShowEditor(false)} className="p-1 text-white/50">
                <X size={20} />
              </button>
            </div>
            <p className="mb-4 text-sm text-white/40">Vyber denné návyky, ktoré chceš sledovať.</p>
            <div className="mb-6 grid grid-cols-2 gap-2">
              {ALL_HABITS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => toggleDraft(h)}
                  className={`flex items-center gap-2 rounded-xl p-3 text-left text-sm ${
                    draftHabits.includes(h) ? 'bg-accent-green/15 text-accent-green' : 'bg-bg-surface text-white/60'
                  }`}
                >
                  <span>{HABIT_ICONS[h]}</span>
                  {HABIT_LABELS[h]}
                  {draftHabits.includes(h) && <Check size={14} className="ml-auto" />}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={saveHabits}
              disabled={draftHabits.length === 0}
              className="w-full rounded-full bg-accent-green py-3 font-bold text-black disabled:opacity-50"
            >
              Uložiť návyky
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
