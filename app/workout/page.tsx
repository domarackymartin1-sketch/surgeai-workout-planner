'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Play, Pencil, ChevronDown, ChevronUp, Search } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import PlanEditorSheet from '@/components/workout/PlanEditorSheet';
import { useStore } from '@/lib/store';
import { EXERCISE_LIBRARY, MUSCLE_GROUPS } from '@/lib/exercises';
import { formatVolume, formatDuration } from '@/lib/utils';
import type { WorkoutPlan } from '@/lib/types';

type Tab = 'plans' | 'history' | 'library';

export default function WorkoutPage() {
  const router = useRouter();
  const plans = useStore((s) => s.plans);
  const workoutLogs = useStore((s) => s.workoutLogs);
  const startWorkout = useStore((s) => s.startWorkout);
  const addPlan = useStore((s) => s.addPlan);
  const updatePlan = useStore((s) => s.updatePlan);
  const [tab, setTab] = useState<Tab>('plans');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('');
  const [editorPlan, setEditorPlan] = useState<WorkoutPlan | 'new' | null>(null);

  const filteredExercises = EXERCISE_LIBRARY.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchMuscle = !muscleFilter || e.primaryMuscle === muscleFilter;
    return matchSearch && matchMuscle;
  });

  const handleSavePlan = (data: Omit<WorkoutPlan, 'id'>) => {
    if (editorPlan && editorPlan !== 'new') {
      updatePlan(editorPlan.id, data);
    } else {
      addPlan(data);
    }
    setEditorPlan(null);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'plans', label: 'Plány' },
    { id: 'history', label: 'História' },
    { id: 'library', label: 'Knižnica cvikov' },
  ];

  return (
    <div className="gradient-mesh app-screen">
      <main className="page-container">
        <PageTransition>
          <h1 className="page-title">Workout</h1>

          <div className="glass-card mb-6 flex gap-1 p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`
                  touch-manipulation flex-1 rounded-btn py-2.5 text-xs font-semibold transition-colors
                  ${tab === t.id ? 'bg-accent-green text-black' : 'text-text-muted'}
                `}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'plans' && (
            <div className="space-y-3">
              {plans.map((plan) => (
                <div key={plan.id} className="card-surface p-4">
                  <h3 className="font-display text-lg font-bold">{plan.name}</h3>
                  <p className="mb-3 text-sm text-text-muted">
                    {plan.muscleGroups.join(' · ')} · {plan.exercises.length} cvikov · {formatDuration(plan.estimatedMinutes)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditorPlan(plan)}
                      className="touch-manipulation flex flex-1 items-center justify-center gap-1 rounded-btn border border-text-dim py-2.5 text-sm text-text-muted"
                    >
                      <Pencil size={14} /> Upraviť
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        startWorkout(plan.id);
                        router.push(`/workout/${plan.id}`);
                      }}
                      className="touch-manipulation flex flex-1 items-center justify-center gap-1 rounded-btn bg-accent-green py-2.5 text-sm font-bold text-black"
                    >
                      <Play size={14} /> Štart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'history' && (
            <div className="space-y-3">
              {workoutLogs.length === 0 ? (
                <p className="py-8 text-center text-sm text-text-muted">Zatiaľ žiadne tréningy</p>
              ) : (
                workoutLogs.map((log) => (
                  <div key={log.id} className="card-surface overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                      className="touch-manipulation flex w-full items-center justify-between p-4 text-left"
                    >
                      <div>
                        <p className="font-display font-bold">{log.planName}</p>
                        <p className="text-xs text-text-muted">
                          {new Date(log.date).toLocaleDateString('sk-SK')} · {formatVolume(log.totalVolume)} · {formatDuration(log.duration)} · {log.mood}
                        </p>
                      </div>
                      {expandedLog === log.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {expandedLog === log.id && (
                      <div className="border-t border-text-dim px-4 py-3">
                        {log.sets.map((s, i) => (
                          <p key={i} className="text-sm text-text-muted">
                            Set {s.setNumber}: {s.weight} kg × {s.reps} reps
                            {s.rpe ? ` · RPE ${s.rpe}` : ''}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'library' && (
            <div>
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Hľadať cvik..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-card bg-bg-card py-3 pl-10 pr-4 text-sm outline-none placeholder:text-text-muted"
                />
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMuscleFilter('')}
                  className={`touch-manipulation rounded-full px-3 py-1 text-xs ${!muscleFilter ? 'bg-accent-green text-black' : 'bg-bg-card text-text-muted'}`}
                >
                  Všetko
                </button>
                {MUSCLE_GROUPS.map((mg) => (
                  <button
                    key={mg}
                    type="button"
                    onClick={() => setMuscleFilter(mg)}
                    className={`touch-manipulation rounded-full px-3 py-1 text-xs ${muscleFilter === mg ? 'bg-accent-green text-black' : 'bg-bg-card text-text-muted'}`}
                  >
                    {mg}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {filteredExercises.map((ex) => (
                  <div key={ex.id} className="card-surface flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{ex.name}</p>
                      <div className="mt-1 flex gap-2">
                        <span className="rounded-full bg-accent-green/10 px-2 py-0.5 text-xs text-accent-green">
                          {ex.primaryMuscle}
                        </span>
                        {ex.secondaryMuscles.map((sm) => (
                          <span key={sm} className="rounded-full bg-bg-surface px-2 py-0.5 text-xs text-text-muted">
                            {sm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </PageTransition>

        {tab === 'plans' && (
          <button
            type="button"
            onClick={() => setEditorPlan('new')}
            className="neon-glow fixed bottom-28 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent-green text-black shadow-lg"
            aria-label="Nový plán"
          >
            <Plus size={24} />
          </button>
        )}

        {editorPlan && (
          <PlanEditorSheet
            plan={editorPlan === 'new' ? undefined : editorPlan}
            onClose={() => setEditorPlan(null)}
            onSave={handleSavePlan}
          />
        )}
      </main>
    </div>
  );
}
