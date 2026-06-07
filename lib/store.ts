'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ActiveWorkout,
  FoodItem,
  HabitId,
  HabitLog,
  NutritionLog,
  OnboardingData,
  PR,
  SetLog,
  StepsData,
  UserProfile,
  WeeklyDayPlan,
  WorkoutCategory,
  WorkoutLog,
  WorkoutPlan,
} from './types';
import type { ChatMessage } from './aiCoach';
import { DEFAULT_PLANS, getExerciseById } from './exercises';
import { calculateBMI, calculateVolume, formatDateISO, generateId } from './utils';

interface AppState {
  profile: UserProfile | null;
  plans: WorkoutPlan[];
  workoutLogs: WorkoutLog[];
  nutritionLogs: NutritionLog[];
  prs: PR[];
  stepsHistory: StepsData[];
  habitLogs: HabitLog[];
  weeklySchedule: WeeklyDayPlan[];
  activeWorkout: ActiveWorkout | null;
  weekOffset: number;
  nutritionWeekOffset: number;
  nutritionSelectedDate: string;
  homeSelectedDate: string;
  aiChatMessages: ChatMessage[];

  saveOnboarding: (data: OnboardingData) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setWeekOffset: (offset: number) => void;
  setNutritionWeekOffset: (offset: number) => void;
  setNutritionSelectedDate: (date: string) => void;
  setHomeSelectedDate: (date: string) => void;
  addAiMessage: (message: ChatMessage) => void;
  clearAiChat: () => void;

  addPlan: (plan: Omit<WorkoutPlan, 'id'>) => void;
  updatePlan: (id: string, plan: Partial<WorkoutPlan>) => void;
  deletePlan: (id: string) => void;

  startWorkout: (planId: string) => void;
  updateActiveWorkout: (updates: Partial<ActiveWorkout>) => void;
  addSet: (set: SetLog) => void;
  finishWorkout: (mood?: string) => void;
  cancelWorkout: () => void;

  addFood: (item: Omit<FoodItem, 'id'>, date?: string) => void;
  removeFood: (date: string, itemId: string) => void;
  addWaterEntry: (amountMl: number, time: string, date?: string) => void;
  removeWaterEntry: (date: string, entryId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateNutritionTargets: (targets: {
    dailyKcalTarget?: number;
    dailyProteinTarget?: number;
    dailyWaterTargetMl?: number;
  }) => void;
  getTodayNutrition: () => NutritionLog;
  getNutritionForDate: (date: string) => NutritionLog;

  addWeight: (weight: number) => void;
  updateBodyStats: (heightCm: number, weightKg: number) => void;
  addBodyMeasurement: (measurement: { chest?: number; waist?: number; hips?: number; biceps?: number }) => void;

  toggleHabit: (habitId: HabitId) => void;
  toggleHabitForDate: (habitId: HabitId, date: string) => void;
  getTodayHabits: () => HabitId[];
  getHabitsForDate: (date: string) => HabitId[];

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

function buildWeeklySchedule(categories: WorkoutCategory[]): WeeklyDayPlan[] {
  const defaults: WorkoutCategory[] = ['hybrid', 'gym', 'cardio', 'recovery', 'gym', 'cardio', 'recovery'];
  const primary = categories[0] ?? 'gym';
  return defaults.map((cat, i) => ({
    dayIndex: i,
    category: categories.includes(cat) ? cat : i % 2 === 0 ? primary : cat,
  }));
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
      habitLogs: [],
      weeklySchedule: buildWeeklySchedule(['gym', 'cardio', 'hybrid']),
      activeWorkout: null,
      weekOffset: 0,
      nutritionWeekOffset: 0,
      nutritionSelectedDate: formatDateISO(),
      homeSelectedDate: formatDateISO(),
      aiChatMessages: [],

      saveOnboarding: (data) => {
        const bmi = calculateBMI(data.weightKg, data.heightCm);
        set({
          profile: {
            name: data.name,
            gender: data.gender,
            birthDate: data.birthDate,
            age: data.age,
            goal: data.goal,
            dailyKcalTarget: data.dailyKcalTarget,
            dailyProteinTarget: Math.round((data.dailyKcalTarget * 0.3) / 4),
            dailyWaterTargetMl: 2500,
            experienceLevel: data.experienceLevel,
            workoutFrequency: data.workoutFrequency,
            categories: data.categories,
            heightCm: data.heightCm,
            weightKg: data.weightKg,
            bmi,
            habits: data.habits,
            weight: [{ date: formatDateISO(), weight: data.weightKg }],
            bodyMeasurements: [],
            onboardingComplete: false,
          },
          weeklySchedule: buildWeeklySchedule(data.categories),
        });
      },

      completeOnboarding: () =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, onboardingComplete: true }
            : null,
        })),

      resetOnboarding: () => set({ profile: null }),

      setWeekOffset: (offset) =>
        set({ weekOffset: Math.max(-8, Math.min(52, offset)) }),
      setNutritionWeekOffset: (offset) =>
        set({ nutritionWeekOffset: Math.max(-8, Math.min(52, offset)) }),
      setNutritionSelectedDate: (date) => set({ nutritionSelectedDate: date }),
      setHomeSelectedDate: (date) => set({ homeSelectedDate: date }),

      addAiMessage: (message) =>
        set((state) => ({
          aiChatMessages: [...state.aiChatMessages, message],
        })),

      clearAiChat: () => set({ aiChatMessages: [] }),

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

      addFood: (item, date) => {
        const targetDate = date ?? formatDateISO();
        set((state) => {
          const existing = state.nutritionLogs.find((l) => l.date === targetDate);
          const foodItem: FoodItem = { ...item, id: generateId() };
          if (existing) {
            const items = [...existing.items, foodItem];
            return {
              nutritionLogs: state.nutritionLogs.map((l) =>
                l.date === targetDate
                  ? { ...l, items, totalKcal: items.reduce((s, i) => s + i.kcal, 0) }
                  : l
              ),
            };
          }
          return {
            nutritionLogs: [
              ...state.nutritionLogs,
              { date: targetDate, items: [foodItem], totalKcal: foodItem.kcal },
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

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),

      updateNutritionTargets: (targets) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                ...(targets.dailyKcalTarget !== undefined && {
                  dailyKcalTarget: targets.dailyKcalTarget,
                }),
                ...(targets.dailyProteinTarget !== undefined && {
                  dailyProteinTarget: targets.dailyProteinTarget,
                }),
                ...(targets.dailyWaterTargetMl !== undefined && {
                  dailyWaterTargetMl: targets.dailyWaterTargetMl,
                }),
              }
            : null,
        })),

      addWaterEntry: (amountMl, time, date) => {
        const targetDate = date ?? formatDateISO();
        const entry = { id: generateId(), amountMl, time };
        set((state) => {
          const existing = state.nutritionLogs.find((l) => l.date === targetDate);
          if (existing) {
            const waterEntries = [...(existing.waterEntries ?? []), entry];
            return {
              nutritionLogs: state.nutritionLogs.map((l) =>
                l.date === targetDate ? { ...l, waterEntries } : l
              ),
            };
          }
          return {
            nutritionLogs: [
              ...state.nutritionLogs,
              { date: targetDate, items: [], totalKcal: 0, waterEntries: [entry] },
            ],
          };
        });
      },

      removeWaterEntry: (date, entryId) =>
        set((state) => ({
          nutritionLogs: state.nutritionLogs.map((l) => {
            if (l.date !== date) return l;
            return {
              ...l,
              waterEntries: (l.waterEntries ?? []).filter((e) => e.id !== entryId),
            };
          }),
        })),

      getTodayNutrition: () => {
        const today = formatDateISO();
        return get().getNutritionForDate(today);
      },

      getNutritionForDate: (date) => {
        const log = get().nutritionLogs.find((l) => l.date === date);
        return log ?? { date, items: [], totalKcal: 0, waterEntries: [] };
      },

      addWeight: (weight) =>
        set((state) => {
          if (!state.profile) return state;
          const entry = { date: formatDateISO(), weight };
          const existing = state.profile.weight.filter((w) => w.date !== entry.date);
          const bmi = calculateBMI(weight, state.profile.heightCm);
          return {
            profile: {
              ...state.profile,
              weightKg: weight,
              bmi,
              weight: [...existing, entry].sort((a, b) => a.date.localeCompare(b.date)),
            },
          };
        }),

      updateBodyStats: (heightCm, weightKg) =>
        set((state) => {
          const entry = { date: formatDateISO(), weight: weightKg };
          const bmi = calculateBMI(weightKg, heightCm);

          if (!state.profile) {
            return {
              profile: {
                name: 'Užívateľ',
                goal: 'maintain',
                dailyKcalTarget: 2500,
                dailyProteinTarget: 150,
                experienceLevel: 'beginner',
                workoutFrequency: '2-3',
                categories: ['gym'],
                heightCm,
                weightKg,
                bmi,
                habits: [],
                weight: [entry],
                bodyMeasurements: [],
                onboardingComplete: true,
              },
            };
          }

          const existing = state.profile.weight.filter((w) => w.date !== entry.date);
          return {
            profile: {
              ...state.profile,
              heightCm,
              weightKg,
              bmi,
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

      toggleHabit: (habitId) => {
        get().toggleHabitForDate(habitId, formatDateISO());
      },

      toggleHabitForDate: (habitId, date) => {
        set((state) => {
          const existing = state.habitLogs.find((l) => l.date === date);
          if (existing) {
            const completed = existing.completed.includes(habitId)
              ? existing.completed.filter((h) => h !== habitId)
              : [...existing.completed, habitId];
            return {
              habitLogs: state.habitLogs.map((l) =>
                l.date === date ? { ...l, completed } : l
              ),
            };
          }
          return {
            habitLogs: [...state.habitLogs, { date, completed: [habitId] }],
          };
        });
      },

      getTodayHabits: () => get().getHabitsForDate(formatDateISO()),

      getHabitsForDate: (date) =>
        get().habitLogs.find((l) => l.date === date)?.completed ?? [],

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
    {
      name: 'surgeai-store',
      version: 5,
      migrate: (persisted: unknown, version) => {
        const state = persisted as AppState;
        if (state?.profile && !('experienceLevel' in state.profile)) {
          state.profile = null;
        }
        if (state && state.nutritionWeekOffset === undefined) {
          state.nutritionWeekOffset = 0;
          state.nutritionSelectedDate = formatDateISO();
        }
        if (state?.profile && version < 4) {
          if (state.profile.dailyProteinTarget === undefined) {
            state.profile.dailyProteinTarget = Math.round(
              ((state.profile.dailyKcalTarget ?? 2500) * 0.3) / 4
            );
          }
          state.nutritionLogs?.forEach((log) => {
            log.items.forEach((item) => {
              if (!('mealType' in item) || !item.mealType) {
                (item as FoodItem).mealType = 'lunch';
              }
            });
          });
        }
        if (state && version < 5) {
          if (!state.homeSelectedDate) state.homeSelectedDate = formatDateISO();
          if (!state.aiChatMessages) state.aiChatMessages = [];
        }
        return state;
      },
    }
  )
);
