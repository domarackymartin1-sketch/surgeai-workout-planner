export type UserGoal = 'muscle' | 'loss' | 'maintain' | 'strength';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type WorkoutFrequency = '2-3' | '4-5' | '6+';
export type WorkoutCategory = 'hybrid' | 'gym' | 'cardio' | 'recovery' | 'hiit' | 'yoga';
export type HabitId = 'water' | 'sleep' | 'stretching' | 'steps' | 'meditation' | 'protein';
export type MealType = 'breakfast' | 'snack' | 'lunch' | 'afternoon' | 'dinner';

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
}

export interface PlanExercise {
  exerciseId: string;
  sets: number;
  targetReps: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  muscleGroups: string[];
  exercises: PlanExercise[];
  estimatedMinutes: number;
}

export interface SetLog {
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number;
}

export interface WorkoutLog {
  id: string;
  planId: string;
  planName: string;
  date: string;
  sets: SetLog[];
  totalVolume: number;
  duration: number;
  rpe: number;
  mood?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  kcal: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  mealType: MealType;
}

export interface NutritionLog {
  date: string;
  items: FoodItem[];
  totalKcal: number;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface BodyMeasurement {
  date: string;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
}

export interface UserProfile {
  name: string;
  goal: UserGoal;
  dailyKcalTarget: number;
  dailyProteinTarget?: number;
  avatarUrl?: string;
  experienceLevel: ExperienceLevel;
  workoutFrequency: WorkoutFrequency;
  categories: WorkoutCategory[];
  heightCm: number;
  weightKg: number;
  bmi: number;
  habits: HabitId[];
  weight: WeightEntry[];
  bodyMeasurements: BodyMeasurement[];
  onboardingComplete: boolean;
}

export interface HabitLog {
  date: string;
  completed: HabitId[];
}

export interface WeeklyDayPlan {
  dayIndex: number;
  category: WorkoutCategory;
}

export interface PR {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

export interface StepsData {
  date: string;
  steps: number;
  distanceKm: number;
  kcal: number;
}

export interface ActiveWorkout {
  planId: string;
  planName: string;
  startedAt: string;
  currentExerciseIndex: number;
  sets: SetLog[];
  restSeconds: number;
}

export interface OnboardingData {
  name: string;
  goal: UserGoal;
  experienceLevel: ExperienceLevel;
  workoutFrequency: WorkoutFrequency;
  categories: WorkoutCategory[];
  heightCm: number;
  weightKg: number;
  habits: HabitId[];
  dailyKcalTarget: number;
}
