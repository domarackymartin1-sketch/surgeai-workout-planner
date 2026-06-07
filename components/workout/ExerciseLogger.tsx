'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Check } from 'lucide-react';
import type { SetLog } from '@/lib/types';

interface ExerciseLoggerProps {
  exerciseId: string;
  existingSets: SetLog[];
  previousSets?: SetLog[];
  onLogSet: (set: SetLog) => void;
  onSetComplete: () => void;
}

type RowValues = { weight: string; reps: string };

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
  const [rows, setRows] = useState<Record<number, RowValues>>({});

  const getSetData = useCallback(
    (setNumber: number) =>
      existingSets.find((s) => s.exerciseId === exerciseId && s.setNumber === setNumber),
    [existingSets, exerciseId]
  );

  const getPrevious = (setNumber: number) =>
    previousSets.find((s) => s.exerciseId === exerciseId && s.setNumber === setNumber);

  useEffect(() => {
    const init: Record<number, RowValues> = {};
    for (let i = 1; i <= rowCount; i++) {
      const data = existingSets.find(
        (s) => s.exerciseId === exerciseId && s.setNumber === i
      );
      init[i] = {
        weight: data?.weight ? String(data.weight) : '',
        reps: data?.reps ? String(data.reps) : '',
      };
    }
    setRows(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseId]);

  useEffect(() => {
    setRows((prev) => {
      const next = { ...prev };
      for (let i = 1; i <= rowCount; i++) {
        if (!next[i]) next[i] = { weight: '', reps: '' };
      }
      return next;
    });
  }, [rowCount]);

  const handleChange = (setNumber: number, field: 'weight' | 'reps', value: string) => {
    setRows((prev) => {
      const current = prev[setNumber] ?? { weight: '', reps: '' };
      const updated = { ...current, [field]: value };
      const weight = parseFloat(updated.weight) || 0;
      const reps = parseInt(updated.reps, 10) || 0;

      onLogSet({ exerciseId, setNumber, weight, reps });

      return { ...prev, [setNumber]: updated };
    });
  };

  const handleComplete = (setNumber: number) => {
    const row = rows[setNumber];
    const weight = parseFloat(row?.weight ?? '') || 0;
    const reps = parseInt(row?.reps ?? '', 10) || 0;
    if (weight > 0 && reps > 0) {
      onSetComplete();
    }
  };

  return (
    <div className="my-4 px-1">
      <div className="mb-2 grid grid-cols-[40px_1fr_1fr_40px] gap-2 px-1 text-xs text-text-muted">
        <span>Set</span>
        <span className="text-center">kg</span>
        <span className="text-center">Reps</span>
        <span className="text-center">✓</span>
      </div>
      {Array.from({ length: rowCount }, (_, i) => i + 1).map((setNum) => {
        const data = getSetData(setNum);
        const prev = getPrevious(setNum);
        const row = rows[setNum] ?? { weight: '', reps: '' };
        const isComplete = data && data.weight > 0 && data.reps > 0;

        return (
          <div
            key={setNum}
            className="mb-2 grid grid-cols-[40px_1fr_1fr_40px] items-center gap-2 rounded-lg bg-bg-card px-2 py-2"
          >
            <span className={`font-bold ${isComplete ? 'text-accent-green' : 'text-text-muted'}`}>
              {setNum}
            </span>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder={prev ? String(prev.weight) : '0'}
              value={row.weight}
              onChange={(e) => handleChange(setNum, 'weight', e.target.value.replace(/[^0-9.,]/g, ''))}
              className={`w-full min-h-[44px] rounded-lg border border-white/10 bg-bg-surface px-2 py-2 text-center text-base text-white outline-none focus:border-accent-green/50 ${isComplete ? 'text-accent-green' : ''}`}
            />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={prev ? String(prev.reps) : '0'}
              value={row.reps}
              onChange={(e) => handleChange(setNum, 'reps', e.target.value.replace(/[^0-9]/g, ''))}
              className={`w-full min-h-[44px] rounded-lg border border-white/10 bg-bg-surface px-2 py-2 text-center text-base text-white outline-none focus:border-accent-green/50 ${isComplete ? 'text-accent-green' : ''}`}
            />
            <button
              type="button"
              onClick={() => handleComplete(setNum)}
              className="touch-manipulation flex h-11 w-11 items-center justify-center"
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
