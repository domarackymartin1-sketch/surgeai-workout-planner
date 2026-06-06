'use client';

import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import type { SetLog } from '@/lib/types';

interface ExerciseLoggerProps {
  exerciseId: string;
  existingSets: SetLog[];
  previousSets?: SetLog[];
  onLogSet: (set: SetLog) => void;
  onSetComplete: () => void;
}

export default function ExerciseLogger({
  exerciseId,
  existingSets,
  previousSets = [],
  onLogSet,
  onSetComplete,
}: ExerciseLoggerProps) {
  const maxSet = Math.max(
    existingSets.filter((s) => s.exerciseId === exerciseId).length,
    3
  );
  const [rowCount, setRowCount] = useState(maxSet);

  const getSetData = (setNumber: number) =>
    existingSets.find((s) => s.exerciseId === exerciseId && s.setNumber === setNumber);

  const getPrevious = (setNumber: number) =>
    previousSets.find((s) => s.exerciseId === exerciseId && s.setNumber === setNumber);

  const handleChange = (setNumber: number, field: 'weight' | 'reps', value: string) => {
    const existing = getSetData(setNumber);
    const prev = getPrevious(setNumber);
    const weight = field === 'weight' ? Number(value) : (existing?.weight ?? prev?.weight ?? 0);
    const reps = field === 'reps' ? Number(value) : (existing?.reps ?? prev?.reps ?? 0);

    if (weight > 0 && reps > 0) {
      onLogSet({ exerciseId, setNumber, weight, reps });
    } else if (existing) {
      onLogSet({ exerciseId, setNumber, weight, reps });
    }
  };

  const handleComplete = (setNumber: number) => {
    const data = getSetData(setNumber);
    if (data && data.weight > 0 && data.reps > 0) {
      onSetComplete();
    }
  };

  return (
    <div className="my-4">
      <div className="mb-2 grid grid-cols-[40px_1fr_1fr_40px] gap-2 px-2 text-xs text-text-muted">
        <span>Set</span>
        <span className="text-center">kg</span>
        <span className="text-center">Reps</span>
        <span>✓</span>
      </div>
      {Array.from({ length: rowCount }, (_, i) => i + 1).map((setNum) => {
        const data = getSetData(setNum);
        const prev = getPrevious(setNum);
        const isComplete = data && data.weight > 0 && data.reps > 0;

        return (
          <div
            key={setNum}
            className="mb-2 grid grid-cols-[40px_1fr_1fr_40px] items-center gap-2 rounded-lg bg-bg-card px-2 py-2"
          >
            <span className={`font-display font-bold ${isComplete ? 'text-accent-green' : 'text-text-muted'}`}>
              {setNum}
            </span>
            <input
              type="number"
              inputMode="decimal"
              placeholder={prev ? String(prev.weight) : '—'}
              value={data?.weight || ''}
              onChange={(e) => handleChange(setNum, 'weight', e.target.value)}
              className={`touch-manipulation w-full rounded-lg bg-bg-surface px-2 py-2 text-center outline-none ${isComplete ? 'text-accent-green' : 'text-text-muted'}`}
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder={prev ? String(prev.reps) : '—'}
              value={data?.reps || ''}
              onChange={(e) => handleChange(setNum, 'reps', e.target.value)}
              className={`touch-manipulation w-full rounded-lg bg-bg-surface px-2 py-2 text-center outline-none ${isComplete ? 'text-accent-green' : 'text-text-muted'}`}
            />
            <button
              type="button"
              onClick={() => handleComplete(setNum)}
              className="touch-manipulation flex h-10 w-10 items-center justify-center"
            >
              {isComplete ? (
                <Check size={18} className="text-accent-green" />
              ) : (
                <span className="h-4 w-4 rounded-full border border-text-dim" />
              )}
            </button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => setRowCount((c) => c + 1)}
        className="touch-manipulation mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-text-dim py-3 text-sm text-text-muted"
      >
        <Plus size={16} /> Pridať sériu
      </button>
    </div>
  );
}
