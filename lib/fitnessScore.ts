import type { HabitLog, PR, UserProfile, WorkoutLog } from './types';
import { formatDateISO, getWeekDays } from './utils';

export interface FitnessMetrics {
  consistency: number;
  endurance: number;
  strength: number;
  habits: number;
  progress: number;
  volume: number;
}

export interface FitnessScoreResult {
  totalScore: number;
  metrics: FitnessMetrics;
  labels: { key: keyof FitnessMetrics; label: string }[];
}

const METRIC_LABELS: { key: keyof FitnessMetrics; label: string }[] = [
  { key: 'consistency', label: 'Konzistencia' },
  { key: 'endurance', label: 'Výdrž' },
  { key: 'strength', label: 'Sila' },
  { key: 'habits', label: 'Návyky' },
  { key: 'progress', label: 'Pokrok' },
  { key: 'volume', label: 'Objem' },
];

function clamp(val: number, max = 10): number {
  return Math.min(max, Math.max(0, +val.toFixed(1)));
}

function getTargetWorkoutsPerWeek(freq?: string): number {
  if (freq === '2-3') return 3;
  if (freq === '6+') return 6;
  return 4;
}

export function calculateFitnessScore(
  workoutLogs: WorkoutLog[],
  habitLogs: HabitLog[],
  prs: PR[],
  profile: UserProfile | null
): FitnessScoreResult {
  const today = formatDateISO();
  const weekDays = getWeekDays().map(formatDateISO);
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  const monthStart = formatDateISO(monthAgo);

  const weekLogs = workoutLogs.filter((l) => weekDays.includes(l.date));
  const monthLogs = workoutLogs.filter((l) => l.date >= monthStart);
  const uniqueWorkoutDays = new Set(monthLogs.map((l) => l.date)).size;

  const targetPerWeek = getTargetWorkoutsPerWeek(profile?.workoutFrequency);
  const targetMonth = targetPerWeek * 4;
  const consistency = targetMonth > 0 ? clamp((uniqueWorkoutDays / targetMonth) * 10) : 0;

  const totalMinutes = monthLogs.reduce((s, l) => s + l.duration, 0);
  const endurance = clamp((totalMinutes / 600) * 10);

  const prScore = prs.length > 0 ? clamp(prs.length * 1.5) : 0;
  const avgVolume = monthLogs.length > 0
    ? monthLogs.reduce((s, l) => s + l.totalVolume, 0) / monthLogs.length
    : 0;
  const strength = clamp(prScore * 0.6 + (avgVolume / 3000) * 4);

  const habitIds = profile?.habits ?? [];
  let habits = 0;
  if (habitIds.length > 0) {
    const recentHabits = habitLogs.filter((l) => l.date >= monthStart);
    const totalPossible = habitIds.length * Math.max(recentHabits.length, 1);
    const completed = recentHabits.reduce((s, l) => s + l.completed.length, 0);
    habits = clamp((completed / totalPossible) * 10);
  }

  const weightEntries = profile?.weight ?? [];
  let progress = 0;
  if (weightEntries.length >= 2) {
    const sorted = [...weightEntries].sort((a, b) => a.date.localeCompare(b.date));
    const diff = sorted[sorted.length - 1].weight - sorted[0].weight;
    const goal = profile?.goal;
    if (goal === 'loss' && diff < 0) progress = clamp(Math.abs(diff) * 2);
    else if (goal === 'muscle' && diff > 0) progress = clamp(diff * 2);
    else progress = clamp(monthLogs.length);
  } else if (monthLogs.length > 0) {
    progress = clamp(monthLogs.length * 0.8);
  }

  const totalVolume = monthLogs.reduce((s, l) => s + l.totalVolume, 0);
  const volume = clamp((totalVolume / 50000) * 10);

  const metrics: FitnessMetrics = {
    consistency,
    endurance,
    strength,
    habits,
    progress,
    volume,
  };

  const avg = Object.values(metrics).reduce((a, b) => a + b, 0) / 6;
  const totalScore = Math.round(avg * 41.43);

  return { totalScore, metrics, labels: METRIC_LABELS };
}
