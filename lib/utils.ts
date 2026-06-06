import type { SetLog, WorkoutLog } from './types';

export function formatDateISO(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function getWeekDays(reference: Date = new Date()): Date[] {
  const day = reference.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(reference);
  monday.setDate(reference.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function getDayLabel(date: Date): string {
  return date.toLocaleDateString('sk-SK', { weekday: 'short' }).replace('.', '');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateVolume(sets: SetLog[]): number {
  return sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
}

export function formatVolume(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
  return `${Math.round(kg)} kg`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getVolumeChangePercent(
  currentWeek: number,
  previousWeek: number
): number {
  if (previousWeek === 0) return currentWeek > 0 ? 100 : 0;
  return Math.round(((currentWeek - previousWeek) / previousWeek) * 100);
}

export function getWorkoutDates(logs: WorkoutLog[]): Set<string> {
  return new Set(logs.map((l) => l.date));
}

export function getTodayVolume(logs: WorkoutLog[], date: string): number {
  return logs
    .filter((l) => l.date === date)
    .reduce((sum, l) => sum + l.totalVolume, 0);
}

export function getWeekVolume(logs: WorkoutLog[], weekOffset = 0): number {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset - weekOffset * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return logs
    .filter((l) => {
      const d = new Date(l.date);
      return d >= monday && d <= sunday;
    })
    .reduce((sum, l) => sum + l.totalVolume, 0);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const GOAL_LABELS: Record<string, string> = {
  muscle: 'Nabrať svalovú hmotu',
  loss: 'Schudnúť',
  maintain: 'Udržiavať kondíciu',
  strength: 'Zvýšiť silu',
};

export const MOOD_EMOJIS = ['😤', '💪', '🔥', '😊', '😴'];
