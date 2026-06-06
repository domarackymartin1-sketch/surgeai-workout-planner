import type { Exercise } from './types';

export const EXERCISE_LIBRARY: Exercise[] = [
  { id: 'bench-press', name: 'Bench Press', primaryMuscle: 'Hrudník', secondaryMuscles: ['Triceps', 'Predné ramená'] },
  { id: 'incline-db-press', name: 'Incline DB Press', primaryMuscle: 'Hrudník', secondaryMuscles: ['Triceps', 'Predné ramená'] },
  { id: 'cable-fly', name: 'Cable Fly', primaryMuscle: 'Hrudník', secondaryMuscles: ['Predné ramená'] },
  { id: 'ohp', name: 'Overhead Press', primaryMuscle: 'Ramená', secondaryMuscles: ['Triceps', 'Trapéz'] },
  { id: 'lateral-raise', name: 'Lateral Raise', primaryMuscle: 'Ramená', secondaryMuscles: [] },
  { id: 'face-pull', name: 'Face Pull', primaryMuscle: 'Zadné ramená', secondaryMuscles: ['Trapéz'] },
  { id: 'pull-up', name: 'Pull Up', primaryMuscle: 'Chrbát', secondaryMuscles: ['Biceps'] },
  { id: 'barbell-row', name: 'Barbell Row', primaryMuscle: 'Chrbát', secondaryMuscles: ['Biceps', 'Trapéz'] },
  { id: 'lat-pulldown', name: 'Lat Pulldown', primaryMuscle: 'Chrbát', secondaryMuscles: ['Biceps'] },
  { id: 'deadlift', name: 'Deadlift', primaryMuscle: 'Hamstringy', secondaryMuscles: ['Chrbát', 'Gluteus'] },
  { id: 'squat', name: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Gluteus', 'Hamstringy'] },
  { id: 'leg-press', name: 'Leg Press', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Gluteus'] },
  { id: 'leg-curl', name: 'Leg Curl', primaryMuscle: 'Hamstringy', secondaryMuscles: [] },
  { id: 'leg-extension', name: 'Leg Extension', primaryMuscle: 'Quadriceps', secondaryMuscles: [] },
  { id: 'barbell-curl', name: 'Barbell Curl', primaryMuscle: 'Biceps', secondaryMuscles: ['Predlaktie'] },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', primaryMuscle: 'Triceps', secondaryMuscles: [] },
  { id: 'skull-crusher', name: 'Skull Crusher', primaryMuscle: 'Triceps', secondaryMuscles: [] },
  { id: 'calf-raise', name: 'Calf Raise', primaryMuscle: 'Lýtka', secondaryMuscles: [] },
  { id: 'plank', name: 'Plank', primaryMuscle: 'Core', secondaryMuscles: [] },
  { id: 'crunch', name: 'Crunch', primaryMuscle: 'Core', secondaryMuscles: [] },
];

export const MUSCLE_GROUPS = [
  'Hrudník', 'Ramená', 'Chrbát', 'Biceps', 'Triceps',
  'Quadriceps', 'Hamstringy', 'Gluteus', 'Core', 'Lýtka',
];

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISE_LIBRARY.find((e) => e.id === id);
}

export const DEFAULT_PLANS = [
  {
    id: 'push-day',
    name: 'Push Day – Hrudník / Ramená',
    muscleGroups: ['Hrudník', 'Ramená', 'Triceps'],
    estimatedMinutes: 60,
    exercises: [
      { exerciseId: 'bench-press', sets: 4, targetReps: 8 },
      { exerciseId: 'incline-db-press', sets: 3, targetReps: 10 },
      { exerciseId: 'ohp', sets: 3, targetReps: 8 },
      { exerciseId: 'lateral-raise', sets: 3, targetReps: 12 },
      { exerciseId: 'tricep-pushdown', sets: 3, targetReps: 12 },
    ],
  },
  {
    id: 'pull-day',
    name: 'Pull Day – Chrbát / Biceps',
    muscleGroups: ['Chrbát', 'Biceps', 'Zadné ramená'],
    estimatedMinutes: 55,
    exercises: [
      { exerciseId: 'deadlift', sets: 4, targetReps: 5 },
      { exerciseId: 'pull-up', sets: 3, targetReps: 8 },
      { exerciseId: 'barbell-row', sets: 3, targetReps: 10 },
      { exerciseId: 'face-pull', sets: 3, targetReps: 15 },
      { exerciseId: 'barbell-curl', sets: 3, targetReps: 10 },
    ],
  },
  {
    id: 'leg-day',
    name: 'Leg Day – Nohy',
    muscleGroups: ['Quadriceps', 'Hamstringy', 'Gluteus'],
    estimatedMinutes: 65,
    exercises: [
      { exerciseId: 'squat', sets: 4, targetReps: 6 },
      { exerciseId: 'leg-press', sets: 3, targetReps: 12 },
      { exerciseId: 'leg-curl', sets: 3, targetReps: 12 },
      { exerciseId: 'leg-extension', sets: 3, targetReps: 12 },
      { exerciseId: 'calf-raise', sets: 4, targetReps: 15 },
    ],
  },
];
