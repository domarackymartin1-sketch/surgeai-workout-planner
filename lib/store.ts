'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ActiveWorkout,
  FoodItem,
  NutritionLog,
  PR,
  SetLog,
  StepsData,
  UserGoal,
  UserProfile,
  WorkoutLog,
  WorkoutPlan,
} from './types';
import { DEFAULT_PLANS, getExerciseById } from './exercises';
import { calculateVolume, formatDateISO, generateId } from './utils';

interface AppState {
  profile: UserProfile | null;
  plans: WorkoutPlan[];
  workoutLogs: WorkoutLog[];
  nutritionLogs: NutritionLog[];
  prs: PR[];
  stepsHistory: StepsData[];
  activeWorkout: ActiveWorkout | null;

  setProfile: (profile: Partial<UserProfile> & { name: string; goal: UserGoal; dailyKcalTarget: number }) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  addPlan: (plan: Omit<WorkoutPlan, 'id'>) => void;
  updatePlan: (id: string, plan: Partial<WorkoutPlan>) => void;
  deletePlan: (id: string) => void;

  startWorkout: (planId: string) => void;
  updateActiveWorkout: (updates: Partial<ActiveWorkout>) => void;
  addSet: (set: SetLog) => void;
  finishWorkout: (mood?: string) => void;
  cancelWorkout: () => void;

  addFood: (item: Omit<FoodItem, 'id'>) => void;
  removeFood: (date: string, itemId: string) => void;
  getTodayNutrition: () => NutritionLog;

  addWeight: (weight: number) => void;
  addBodyMeasurement: (measurement: { chest?: number; waist?: number; hips?: number; biceps?: number }) => void;

  getTodaySteps: () => StepsData;
  getStepsForWeek: () => StepsData[];
}

function generateMockSteps(date: string, seed: number): StepsData {
  const steps = 2000 + (seed * 1373) % 8000;
  const distanceKm = +(steps * 0.00075).toFixed(2);
  const kcal = +(steps * 0.04).toFixed(1);
  return { date, steps, distanceKm, kcal };
}

function initStepsHistory(): StepsData[] {
  const history: StepsData[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    history.push(generateMockSteps(formatDateISO(d), i));
  }
  return history;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      plans: DEFAULT_PLANS as WorkoutPlan[],
      workoutLogs: [],
      nutritionLogs: [],
      prs: [],
      stepsHistory: initStepsHistory(),
      activeWorkout: null,

      setProfile: (profile) =>
        set({
          profile: {
            name: profile.name,
            goal: profile.goal,
            dailyKcalTarget: profile.dailyKcalTarget,
            weight: profile.weight ?? [],
            bodyMeasurements: profile.bodyMeasurements ?? [],
            onboardingComplete: false,
          },
        }),

      completeOnboarding: () =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, onboardingComplete: true }
            : null,
        })),

      resetOnboarding: () => set({ profile: null }),

      addPlan: (plan) =>
        set((state) => ({
          plans: [...state.plans, { ...plan, id: generateId() }],
        })),

      updatePlan: (id, plan) =>
        set((state) => ({
          plans: state.plans.map((p) => (p.id === id ? { ...p, ...plan } : p)),
        })),

      deletePlan: (id) =>
        set((state) => ({
          plans: state.plans.filter((p) => p.id !== id),
        })),

      startWorkout: (planId) => {
        const plan = get().plans.find((p) => p.id === planId);
        if (!plan) return;
        set({
          activeWorkout: {
            planId,
            planName: plan.name,
            startedAt: new Date().toISOString(),
            currentExerciseIndex: 0,
            sets: [],
            restSeconds: 90,
          },
        });
      },

      updateActiveWorkout: (updates) =>
        set((state) => ({
          activeWorkout: state.activeWorkout
            ? { ...state.activeWorkout, ...updates }
            : null,
        })),

      addSet: (setLog) =>
        set((state) => {
          if (!state.activeWorkout) return state;
          const existing = state.activeWorkout.sets.filter(
            (s) => !(s.exerciseId === setLog.exerciseId && s.setNumber === setLog.setNumber)
          );
          return {
            activeWorkout: {
              ...state.activeWorkout,
              sets: [...existing, setLog],
            },
          };
        }),

      finishWorkout: (mood) => {
        const { activeWorkout, workoutLogs, prs, plans } = get();
        if (!activeWorkout) return;

        const started = new Date(activeWorkout.startedAt);
        const duration = Math.round((Date.now() - started.getTime()) / 60000);
        const totalVolume = calculateVolume(activeWorkout.sets);
        const avgRpe =
          activeWorkout.sets.filter((s) => s.rpe).length > 0
            ? activeWorkout.sets.reduce((sum, s) => sum + (s.rpe ?? 0), 0) /
              activeWorkout.sets.filter((s) => s.rpe).length
            : 7;

        const log: WorkoutLog = {
          id: generateId(),
          planId: activeWorkout.planId,
          planName: activeWorkout.planName,
          date: formatDateISO(),
          sets: activeWorkout.sets,
          totalVolume,
          duration: Math.max(duration, 1),
          rpe: Math.round(avgRpe),
          mood: mood ?? '💪',
        };

        const newPrs = [...prs];
        const exerciseMaxes = new Map<string, { weight: number; reps: number }>();
        activeWorkout.sets.forEach((s) => {
          const current = exerciseMaxes.get(s.exerciseId);
          if (!current || s.weight > current.weight) {
            exerciseMaxes.set(s.exerciseId, { weight: s.weight, reps: s.reps });
          }
        });

        exerciseMaxes.forEach((val, exerciseId) => {
          const existing = prs.find((p) => p.exerciseId === exerciseId);
          if (!existing || val.weight > existing.weight) {
            const plan = plans.find((p) => p.id === activeWorkout.planId);
            const exercise = plan?.exercises.find((e) => e.exerciseId === exerciseId);
            const idx = newPrs.findIndex((p) => p.exerciseId === exerciseId);
            const pr: PR = {
              exerciseId,
              exerciseName: getExerciseById(exerciseId)?.name ?? exerciseId,
              weight: val.weight,
              reps: val.reps,
              date: formatDateISO(),
            };
            if (idx >= 0) newPrs[idx] = pr;
            else newPrs.push(pr);
          }
        });

        set({
          workoutLogs: [log, ...workoutLogs],
          prs: newPrs,
          activeWorkout: null,
        });
      },

      cancelWorkout: () => set({ activeWorkout: null }),

      addFood: (item) => {
        const today = formatDateISO();
        set((state) => {
          const existing = state.nutritionLogs.find((l) => l.date === today);
          const foodItem: FoodItem = { ...item, id: generateId() };
          if (existing) {
            const items = [...existing.items, foodItem];
            return {
              nutritionLogs: state.nutritionLogs.map((l) =>
                l.date === today
                  ? { ...l, items, totalKcal: items.reduce((s, i) => s + i.kcal, 0) }
                  : l
              ),
            };
          }
          return {
            nutritionLogs: [
              ...state.nutritionLogs,
              { date: today, items: [foodItem], totalKcal: foodItem.kcal },
            ],
          };
        });
      },

      removeFood: (date, itemId) =>
        set((state) => ({
          nutritionLogs: state.nutritionLogs
            .map((l) => {
              if (l.date !== date) return l;
              const items = l.items.filter((i) => i.id !== itemId);
              return { ...l, items, totalKcal: items.reduce((s, i) => s + i.kcal, 0) };
            })
            .filter((l) => l.items.length > 0),
        })),

      getTodayNutrition: () => {
        const today = formatDateISO();
        const log = get().nutritionLogs.find((l) => l.date === today);
        return log ?? { date: today, items: [], totalKcal: 0 };
      },

      addWeight: (weight) =>
        set((state) => {
          if (!state.profile) return state;
          const entry = { date: formatDateISO(), weight };
          const existing = state.profile.weight.filter((w) => w.date !== entry.date);
          return {
            profile: {
              ...state.profile,
              weight: [...existing, entry].sort((a, b) => a.date.localeCompare(b.date)),
            },
          };
        }),

      addBodyMeasurement: (measurement) =>
        set((state) => {
          if (!state.profile) return state;
          const entry = { date: formatDateISO(), ...measurement };
          const existing = state.profile.bodyMeasurements.filter((m) => m.date !== entry.date);
          return {
            profile: {
              ...state.profile,
              bodyMeasurements: [...existing, entry],
            },
          };
        }),

      getTodaySteps: () => {
        const today = formatDateISO();
        const found = get().stepsHistory.find((s) => s.date === today);
        return found ?? generateMockSteps(today, 0);
      },

      getStepsForWeek: () => {
        const history = get().stepsHistory;
        const days: StepsData[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = formatDateISO(d);
          const found = history.find((s) => s.date === dateStr);
          days.push(found ?? generateMockSteps(dateStr, i));
        }
        return days;
      },
    }),
    { name: 'surgeai-store' }
  )
);
