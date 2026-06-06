'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

interface VolumeChartProps {
  data: { week: string; volume: number }[];
}

export default function VolumeChart({ data }: VolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid stroke="var(--text-dim)" strokeDasharray="3 3" />
        <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--text-dim)', borderRadius: 8 }}
          itemStyle={{ color: 'var(--accent-green)' }}
        />
        <Bar dataKey="volume" fill="var(--accent-green)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
