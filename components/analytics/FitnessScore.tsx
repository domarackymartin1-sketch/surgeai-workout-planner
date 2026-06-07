'use client';

import { useStore } from '@/lib/store';
import { calculateFitnessScore } from '@/lib/fitnessScore';

function RadarChart({ metrics, labels }: {
  metrics: ReturnType<typeof calculateFitnessScore>['metrics'];
  labels: ReturnType<typeof calculateFitnessScore>['labels'];
}) {
  const size = 260;
  const center = size / 2;
  const maxR = 100;
  const levels = 5;
  const keys = labels.map((l) => l.key);
  const angleStep = (2 * Math.PI) / keys.length;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 10) * maxR;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataPoints = keys.map((key, i) => getPoint(i, metrics[key]));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[280px]">
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
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        );
      })}

      {keys.map((_, i) => {
        const outer = getPoint(i, 10);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={outer.x}
            y2={outer.y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        );
      })}

      <path d={dataPath} fill="rgba(0,255,102,0.2)" stroke="var(--accent-green)" strokeWidth="2" />

      {keys.map((key, i) => {
        const labelPos = getPoint(i, 12.5);
        const val = metrics[key];
        return (
          <g key={key}>
            <text
              x={labelPos.x}
              y={labelPos.y - 6}
              textAnchor="middle"
              className="fill-white/50 text-[9px] font-medium"
            >
              {labels[i].label}
            </text>
            <text
              x={labelPos.x}
              y={labelPos.y + 6}
              textAnchor="middle"
              className="fill-white text-[10px] font-semibold"
            >
              {val}/10
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function FitnessScore() {
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
    <section className="mb-8 text-center">
      <h2 className="score-title mb-1 text-xl font-bold text-accent-green">Fitness Score</h2>
      <p className="mb-6 font-display text-5xl font-bold tracking-tight text-white">
        {totalScore}
      </p>
      <div className="glass-card mx-auto max-w-sm p-5">
        <RadarChart metrics={metrics} labels={labels} />
      </div>
      <h3 className="mt-8 text-left text-2xl font-bold text-white">Tvoje dáta</h3>
      <div className="mt-3 h-px bg-white/10" />
    </section>
  );
}
