'use client';

interface MuscleMapProps {
  activeMuscles: string[];
}

const MUSCLE_MAP: Record<string, { front?: string; back?: string }> = {
  Hrudník: { front: 'chest' },
  Ramená: { front: 'shoulders-front', back: 'shoulders-back' },
  'Zadné ramená': { back: 'shoulders-back' },
  Chrbát: { back: 'back' },
  Biceps: { front: 'biceps' },
  Triceps: { front: 'triceps', back: 'triceps-back' },
  Quadriceps: { front: 'quads' },
  Hamstringy: { back: 'hamstrings' },
  Gluteus: { back: 'glutes' },
  Core: { front: 'core' },
  Lýtka: { front: 'calves-front', back: 'calves-back' },
};

function MuscleRect({
  id,
  activeIds,
  ...props
}: { id: string; activeIds: Set<string> } & React.SVGProps<SVGRectElement>) {
  const active = activeIds.has(id);
  return (
    <rect
      {...props}
      fill={active ? 'var(--accent-green)' : 'var(--accent-olive)'}
      opacity={active ? 0.85 : 0.4}
    />
  );
}

export default function MuscleMap({ activeMuscles }: MuscleMapProps) {
  const activeIds = new Set<string>();
  activeMuscles.forEach((m) => {
    const mapping = MUSCLE_MAP[m];
    if (mapping?.front) activeIds.add(mapping.front);
    if (mapping?.back) activeIds.add(mapping.back);
  });

  return (
    <div className="my-4 flex justify-center gap-6">
      <svg viewBox="0 0 80 160" className="h-40 w-20">
        <ellipse cx="40" cy="14" rx="12" ry="14" fill="var(--bg-card)" />
        <MuscleRect id="shoulders-front" activeIds={activeIds} x="30" y="26" width="20" height="8" rx="2" />
        <MuscleRect id="chest" activeIds={activeIds} x="28" y="34" width="24" height="20" rx="4" />
        <MuscleRect id="core" activeIds={activeIds} x="34" y="54" width="12" height="16" rx="2" />
        <MuscleRect id="biceps" activeIds={activeIds} x="14" y="34" width="10" height="28" rx="3" />
        <MuscleRect id="biceps" activeIds={activeIds} x="56" y="34" width="10" height="28" rx="3" />
        <MuscleRect id="quads" activeIds={activeIds} x="26" y="70" width="12" height="36" rx="4" />
        <MuscleRect id="quads" activeIds={activeIds} x="42" y="70" width="12" height="36" rx="4" />
        <MuscleRect id="calves-front" activeIds={activeIds} x="28" y="108" width="10" height="24" rx="3" />
        <MuscleRect id="calves-front" activeIds={activeIds} x="42" y="108" width="10" height="24" rx="3" />
      </svg>
      <svg viewBox="0 0 80 160" className="h-40 w-20">
        <ellipse cx="40" cy="14" rx="12" ry="14" fill="var(--bg-card)" />
        <MuscleRect id="shoulders-back" activeIds={activeIds} x="28" y="26" width="24" height="10" rx="2" />
        <MuscleRect id="back" activeIds={activeIds} x="28" y="36" width="24" height="30" rx="4" />
        <MuscleRect id="triceps-back" activeIds={activeIds} x="14" y="36" width="10" height="24" rx="3" />
        <MuscleRect id="triceps-back" activeIds={activeIds} x="56" y="36" width="10" height="24" rx="3" />
        <MuscleRect id="glutes" activeIds={activeIds} x="28" y="68" width="24" height="14" rx="3" />
        <MuscleRect id="hamstrings" activeIds={activeIds} x="26" y="82" width="12" height="30" rx="4" />
        <MuscleRect id="hamstrings" activeIds={activeIds} x="42" y="82" width="12" height="30" rx="4" />
        <MuscleRect id="calves-back" activeIds={activeIds} x="28" y="114" width="10" height="22" rx="3" />
        <MuscleRect id="calves-back" activeIds={activeIds} x="42" y="114" width="10" height="22" rx="3" />
      </svg>
    </div>
  );
}
