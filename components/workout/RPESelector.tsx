'use client';

interface RPESelectorProps {
  value: number;
  onChange: (rpe: number) => void;
}

export default function RPESelector({ value, onChange }: RPESelectorProps) {
  return (
    <div className="my-6">
      <p className="mb-3 text-center text-sm text-text-muted">RPE (záťaž 1–10)</p>
      <div className="flex justify-between gap-1 px-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((rpe) => (
          <button
            key={rpe}
            type="button"
            onClick={() => onChange(rpe)}
            className="touch-manipulation flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1"
          >
            <span
              className={`h-3 w-3 rounded-full transition-colors ${
                rpe <= value ? 'bg-accent-green' : 'bg-accent-olive'
              }`}
            />
            <span className={`text-[10px] ${rpe === value ? 'text-accent-green font-bold' : 'text-text-muted'}`}>
              {rpe}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
