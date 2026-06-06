'use client';

import { getExerciseById } from '@/lib/exercises';
import NeonBadge from '@/components/ui/NeonBadge';
import type { PR } from '@/lib/types';
import { formatDateISO } from '@/lib/utils';

interface PRTableProps {
  prs: PR[];
}

export default function PRTable({ prs }: PRTableProps) {
  const today = formatDateISO();

  if (prs.length === 0) {
    return <p className="py-4 text-center text-sm text-text-muted">Zatiaľ žiadne rekordy</p>;
  }

  return (
    <div className="overflow-hidden rounded-card bg-bg-card">
      <div className="grid grid-cols-[1fr_80px_80px] gap-2 border-b border-text-dim px-4 py-2 text-xs text-text-muted">
        <span>Cvik</span>
        <span>PR váha</span>
        <span>Dátum</span>
      </div>
      {prs.map((pr) => {
        const exercise = getExerciseById(pr.exerciseId);
        const isNew = pr.date === today;
        return (
          <div
            key={pr.exerciseId}
            className="grid grid-cols-[1fr_80px_80px] gap-2 border-b border-text-dim/50 px-4 py-3 text-sm last:border-0"
          >
            <div className="flex items-center gap-2">
              <span>{exercise?.name ?? pr.exerciseName}</span>
              {isNew && <NeonBadge>🏆 Nový!</NeonBadge>}
            </div>
            <span className="font-bold text-accent-green">{pr.weight} kg</span>
            <span className="text-text-muted">
              {new Date(pr.date).toLocaleDateString('sk-SK')}
            </span>
          </div>
        );
      })}
    </div>
  );
}
