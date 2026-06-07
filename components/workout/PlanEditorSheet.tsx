'use client';

import { useState, useMemo } from 'react';
import { X, Plus, Trash2, Search } from 'lucide-react';
import GreenButton from '@/components/ui/GreenButton';
import { EXERCISE_LIBRARY, MUSCLE_GROUPS, getExerciseById } from '@/lib/exercises';
import type { PlanExercise, WorkoutPlan } from '@/lib/types';

interface PlanEditorSheetProps {
  plan?: WorkoutPlan;
  onClose: () => void;
  onSave: (data: Omit<WorkoutPlan, 'id'>) => void;
}

export default function PlanEditorSheet({ plan, onClose, onSave }: PlanEditorSheetProps) {
  const [name, setName] = useState(plan?.name ?? '');
  const [muscleGroups, setMuscleGroups] = useState<string[]>(plan?.muscleGroups ?? []);
  const [exercises, setExercises] = useState<PlanExercise[]>(plan?.exercises ?? []);
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('');

  const filteredExercises = useMemo(
    () =>
      EXERCISE_LIBRARY.filter((e) => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
        const matchMuscle = !muscleFilter || e.primaryMuscle === muscleFilter;
        return matchSearch && matchMuscle;
      }),
    [search, muscleFilter]
  );

  const toggleMuscle = (mg: string) => {
    setMuscleGroups((prev) =>
      prev.includes(mg) ? prev.filter((m) => m !== mg) : [...prev, mg]
    );
  };

  const addExercise = (exerciseId: string) => {
    if (exercises.some((e) => e.exerciseId === exerciseId)) return;
    setExercises((prev) => [...prev, { exerciseId, sets: 3, targetReps: 10 }]);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((e) => e.exerciseId !== exerciseId));
  };

  const updateExercise = (exerciseId: string, field: 'sets' | 'targetReps', value: number) => {
    setExercises((prev) =>
      prev.map((e) => (e.exerciseId === exerciseId ? { ...e, [field]: value } : e))
    );
  };

  const handleSave = () => {
    if (!name.trim() || exercises.length === 0) return;
    const estimatedMinutes = Math.max(exercises.length * 12, 30);
    onSave({
      name: name.trim(),
      muscleGroups: muscleGroups.length > 0 ? muscleGroups : ['Vlastný'],
      exercises,
      estimatedMinutes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85">
      <div className="mx-auto w-full max-w-lg px-4 pb-36 pt-8">
        <div className="rounded-card bg-bg-card">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h3 className="font-display text-lg font-bold">
              {plan ? 'Upraviť plán' : 'Nový plán'}
            </h3>
            <button type="button" onClick={onClose} className="touch-manipulation p-2 text-white/50">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5 px-5 py-4">
            <div>
              <label className="mb-1 block text-xs text-text-muted">Názov plánu</label>
              <input
                type="text"
                placeholder="Názov plánu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-btn bg-bg-surface px-4 py-3 text-sm outline-none"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-text-muted">Zameranie (svalové skupiny)</label>
              <div className="flex flex-wrap gap-2">
                {MUSCLE_GROUPS.map((mg) => (
                  <button
                    key={mg}
                    type="button"
                    onClick={() => toggleMuscle(mg)}
                    className={`touch-manipulation rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      muscleGroups.includes(mg)
                        ? 'bg-accent-green text-black'
                        : 'bg-bg-surface text-text-muted'
                    }`}
                  >
                    {mg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs text-text-muted">
                Cviky v pláne ({exercises.length})
              </label>
              {exercises.length === 0 ? (
                <p className="rounded-lg border border-dashed border-text-dim py-4 text-center text-sm text-text-muted">
                  Pridaj cviky z knižnice nižšie
                </p>
              ) : (
                <div className="space-y-2">
                  {exercises.map((pe) => {
                    const ex = getExerciseById(pe.exerciseId);
                    return (
                      <div
                        key={pe.exerciseId}
                        className="flex items-center gap-2 rounded-lg bg-bg-surface p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{ex?.name ?? pe.exerciseId}</p>
                          <div className="mt-1 flex gap-2">
                            <label className="flex items-center gap-1 text-xs text-text-muted">
                              Série
                              <input
                                type="number"
                                min={1}
                                max={10}
                                value={pe.sets}
                                onChange={(e) =>
                                  updateExercise(pe.exerciseId, 'sets', Number(e.target.value) || 1)
                                }
                                className="w-10 rounded bg-bg-card px-1 py-0.5 text-center text-white outline-none"
                              />
                            </label>
                            <label className="flex items-center gap-1 text-xs text-text-muted">
                              Reps
                              <input
                                type="number"
                                min={1}
                                max={30}
                                value={pe.targetReps}
                                onChange={(e) =>
                                  updateExercise(
                                    pe.exerciseId,
                                    'targetReps',
                                    Number(e.target.value) || 1
                                  )
                                }
                                className="w-10 rounded bg-bg-card px-1 py-0.5 text-center text-white outline-none"
                              />
                            </label>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExercise(pe.exerciseId)}
                          className="touch-manipulation p-2 text-white/40"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs text-text-muted">Knižnica cvikov</label>
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Hľadať cvik..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-btn bg-bg-surface py-2.5 pl-9 pr-3 text-sm outline-none"
                />
              </div>
              <div className="mb-3 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setMuscleFilter('')}
                  className={`touch-manipulation rounded-full px-2.5 py-1 text-[11px] ${
                    !muscleFilter ? 'bg-accent-green text-black' : 'bg-bg-surface text-text-muted'
                  }`}
                >
                  Všetko
                </button>
                {MUSCLE_GROUPS.map((mg) => (
                  <button
                    key={mg}
                    type="button"
                    onClick={() => setMuscleFilter(mg)}
                    className={`touch-manipulation rounded-full px-2.5 py-1 text-[11px] ${
                      muscleFilter === mg ? 'bg-accent-green text-black' : 'bg-bg-surface text-text-muted'
                    }`}
                  >
                    {mg}
                  </button>
                ))}
              </div>
              <div className="space-y-1.5">
                {filteredExercises.map((ex) => {
                  const added = exercises.some((e) => e.exerciseId === ex.id);
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => addExercise(ex.id)}
                      disabled={added}
                      className={`touch-manipulation flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ${
                        added ? 'bg-accent-green/10 text-accent-green' : 'bg-bg-surface hover:bg-white/5'
                      }`}
                    >
                      <span>{ex.name}</span>
                      {added ? (
                        <span className="text-xs">Pridané</span>
                      ) : (
                        <Plus size={16} className="text-text-muted" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="touch-manipulation flex-1 rounded-btn border border-text-dim py-3 text-sm text-text-muted"
              >
                Zrušiť
              </button>
              <GreenButton
                onClick={handleSave}
                disabled={!name.trim() || exercises.length === 0}
                className="flex-1"
              >
                {plan ? 'Uložiť' : 'Vytvoriť'}
              </GreenButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
