'use client';

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import type { WeightEntry } from '@/lib/types';

interface WeightChartProps {
  data: WeightEntry[];
}

export default function WeightChart({ data }: WeightChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-text-muted">
        Zatiaľ žiadne záznamy
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('sk-SK', { day: 'numeric', month: 'short' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={formatted}>
        <CartesianGrid stroke="var(--text-dim)" strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
        <Tooltip
          contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--text-dim)', borderRadius: 8 }}
          labelStyle={{ color: 'var(--text-muted)' }}
          itemStyle={{ color: 'var(--accent-green)' }}
        />
        <Line type="monotone" dataKey="weight" stroke="var(--accent-green)" strokeWidth={2} dot={{ fill: 'var(--accent-green)', r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
