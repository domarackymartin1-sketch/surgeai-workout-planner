'use client';

import { useStore } from '@/lib/store';
import { calculateFitnessScore } from '@/lib/fitnessScore';

function RadarChart({ metrics, labels }: {
  metrics: ReturnType<typeof calculateFitnessScore>['metrics'];
  labels: ReturnType<typeof calculateFitnessScore>['labels'];
}) {
  const size = 280;
  const center = size / 2;
  const maxR = 95;
  const levels = 5;
  const keys = labels.map((l) => l.key);
  const angleStep = (2 * Math.PI) / keys.length;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 10) * maxR;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const dataPoints = keys.map((key, i) => getPoint(i, metrics[key]));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  const labelKeys: Record<string, string> = {
    consistency: 'Consistency',
    endurance: 'Endurance',
    strength: 'Strength',
    habits: 'Habits',
    progress: 'Progress',
    volume: 'Volume',
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[300px]">
      {Array.from({ length: levels }, (_, lvl) => {
        const r = ((lvl + 1) / levels) * maxR;
        const pts = keys.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
        });
        return (
          <polygon
            key={lvl}
            points={pts.join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        );
      })}

      {keys.map((_, i) => {
        const outer = getPoint(i, 10);
        return (
          <line key={i} x1={center} y1={center} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        );
      })}

      <path d={dataPath} fill="rgba(0,255,102,0.25)" stroke="var(--accent-green)" strokeWidth="2.5" />

      {keys.map((key, i) => {
        const labelPos = getPoint(i, 11.8);
        const val = metrics[key];
        return (
          <g key={key}>
            <text x={labelPos.x} y={labelPos.y - 5} textAnchor="middle" className="fill-white/45 text-[8px] font-medium">
              {labelKeys[key] ?? labels[i].label}
            </text>
            <text x={labelPos.x} y={labelPos.y + 7} textAnchor="middle" className="fill-white text-[10px] font-bold">
              {val}/10
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function FitnessScore({ compact = false }: { compact?: boolean }) {
  const workoutLogs = useStore((s) => s.workoutLogs);
  const habitLogs = useStore((s) => s.habitLogs);
  const prs = useStore((s) => s.prs);
  const profile = useStore((s) => s.profile);

  const { totalScore, metrics, labels } = calculateFitnessScore(
    workoutLogs,
    habitLogs,
    prs,
    profile
  );

  return (
    <div className="text-center">
      <p className="score-title mb-1 text-base font-bold text-accent-green">Fitness Score</p>
      <p className={`mb-4 font-bold tracking-tight text-white ${compact ? 'text-4xl' : 'text-5xl'}`}>
        {totalScore}
      </p>
      <RadarChart metrics={metrics} labels={labels} />
    </div>
  );
}
