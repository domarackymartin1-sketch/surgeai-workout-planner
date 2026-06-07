import type { SetLog, WorkoutLog } from './types';

export function formatDateISO(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function kgToLbs(kg: number): number {
  return +(kg * 2.20462).toFixed(1);
}

export function lbsToKg(lbs: number): number {
  return +(lbs / 2.20462).toFixed(1);
}

export function cmToFeetInches(cm: number): { ft: number; inches: number } {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { ft, inches };
}

export function feetInchesToCm(ft: number, inches: number): number {
  return Math.round((ft * 12 + inches) * 2.54);
}

export function calcAgeFromBirthDate(birthDate: string): number {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
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

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (!heightCm || !weightKg) return 0;
  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(1);
}

export function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Podváha', color: 'var(--accent-green)' };
  if (bmi < 25) return { label: 'Normálna', color: 'var(--accent-green)' };
  if (bmi < 30) return { label: 'Nadváha', color: '#FFB800' };
  return { label: 'Obezita', color: 'var(--danger)' };
}

export function getWeekRangeLabel(reference: Date = new Date()): string {
  const days = getWeekDays(reference);
  const start = days[0].toLocaleDateString('sk-SK', { day: 'numeric', month: 'short' });
  const end = days[6].toLocaleDateString('sk-SK', { day: 'numeric', month: 'short' });
  return `${start} – ${end}`;
}

export function getDayShort(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'narrow' });
}

export const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: 'Začiatočník',
  intermediate: 'Pokročilý',
  advanced: 'Expert',
};

export const FREQUENCY_LABELS: Record<string, string> = {
  '2-3': '2–3× týždenne',
  '4-5': '4–5× týždenne',
  '6+': '6+× týždenne',
};

export const CATEGORY_LABELS: Record<string, string> = {
  hybrid: 'Hybrid',
  gym: 'Posilňovňa',
  cardio: 'Kardio',
  recovery: 'Regenerácia',
  hiit: 'HIIT',
  yoga: 'Jóga',
};

export const HABIT_LABELS: Record<string, string> = {
  water: 'Voda 2L',
  sleep: '8h spánok',
  stretching: 'Strečing',
  steps: '10k krokov',
  meditation: 'Meditácia',
  protein: 'Bielkoviny',
};
