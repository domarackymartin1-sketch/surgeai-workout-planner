'use client';

interface MacroDotsProps {
  label: string;
  color: string;
  current: number;
  target: number;
}

export default function MacroDots({ label, color, current, target }: MacroDotsProps) {
  const pct = target > 0 ? Math.round((current / target) * 100) : 0;
  const totalDots = 20;
  const filled = Math.round((current / target) * totalDots);

  return (
    <div className="flex flex-1 flex-col items-center">
      <p className="text-sm font-semibold" style={{ color }}>{label}</p>
      <p className="mb-3 text-lg font-bold text-white">{pct}%</p>
      <div className="mb-3 grid grid-cols-5 gap-1.5">
        {Array.from({ length: totalDots }, (_, i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: i < filled ? color : 'rgba(255,255,255,0.12)' }}
          />
        ))}
      </div>
      <p className="text-xs text-white/40">
        <span className="font-semibold text-white">{Math.round(current)}g</span> / {target}g
      </p>
    </div>
  );
}
