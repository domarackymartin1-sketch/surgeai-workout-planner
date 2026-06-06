'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import RestTimer from '@/components/workout/RestTimer';
import RPESelector from '@/components/workout/RPESelector';
import ExerciseLogger from '@/components/workout/ExerciseLogger';
import MuscleMap from '@/components/workout/MuscleMap';
import GreenButton from '@/components/ui/GreenButton';
import { useStore } from '@/lib/store';
import { getExerciseById } from '@/lib/exercises';
import type { SetLog } from '@/lib/types';

export default function FocusModePage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;

  const plans = useStore((s) => s.plans);
  const activeWorkout = useStore((s) => s.activeWorkout);
  const startWorkout = useStore((s) => s.startWorkout);
  const updateActiveWorkout = useStore((s) => s.updateActiveWorkout);
  const addSet = useStore((s) => s.addSet);
  const finishWorkout = useStore((s) => s.finishWorkout);
  const workoutLogs = useStore((s) => s.workoutLogs);

  const [rpe, setRpe] = useState(7);
  const [timerKey, setTimerKey] = useState(0);
  const [autoStartTimer, setAutoStartTimer] = useState(false);

  const plan = plans.find((p) => p.id === planId);

  useEffect(() => {
    if (!activeWorkout || activeWorkout.planId !== planId) {
      startWorkout(planId);
    }
  }, [planId, activeWorkout, startWorkout]);

  if (!plan || !activeWorkout) {
    return <div className="flex min-h-dvh items-center justify-center bg-black">Načítavam...</div>;
  }

  const exerciseIndex = activeWorkout.currentExerciseIndex;
  const currentPlanExercise = plan.exercises[exerciseIndex];
  const exercise = getExerciseById(currentPlanExercise?.exerciseId ?? '');
  const isLast = exerciseIndex >= plan.exercises.length - 1;
  const isFirst = exerciseIndex === 0;

  const previousSets: SetLog[] = workoutLogs
    .flatMap((l) => l.sets)
    .filter((s) => s.exerciseId === currentPlanExercise?.exerciseId);

  const handleLogSet = (set: SetLog) => {
    addSet({ ...set, rpe });
  };

  const handleSetComplete = () => {
    setAutoStartTimer(false);
    setTimeout(() => {
      setTimerKey((k) => k + 1);
      setAutoStartTimer(true);
    }, 50);
  };

  const goNext = () => {
    if (!isLast) {
      updateActiveWorkout({ currentExerciseIndex: exerciseIndex + 1 });
      setAutoStartTimer(false);
    }
  };

  const goPrev = () => {
    if (!isFirst) {
      updateActiveWorkout({ currentExerciseIndex: exerciseIndex - 1 });
      setAutoStartTimer(false);
    }
  };

  const handleFinish = () => {
    finishWorkout('💪');
    router.push('/workout');
  };

  const activeMuscles = exercise
    ? [exercise.primaryMuscle, ...exercise.secondaryMuscles]
    : plan.muscleGroups;

  return (
    <motion.main
      className="flex min-h-dvh flex-col bg-black px-4 pb-8 pt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
        <span>{plan.name}</span>
        <span>{exerciseIndex + 1} / {plan.exercises.length}</span>
      </div>

      <h1 className="mb-6 text-center font-display text-3xl font-bold">
        {exercise?.name ?? 'Cvik'}
      </h1>

      <RestTimer
        key={timerKey}
        defaultSeconds={activeWorkout.restSeconds}
        autoStart={autoStartTimer}
        onSecondsChange={(s) => updateActiveWorkout({ restSeconds: s })}
      />

      <RPESelector value={rpe} onChange={setRpe} />

      <ExerciseLogger
        exerciseId={currentPlanExercise.exerciseId}
        existingSets={activeWorkout.sets}
        previousSets={previousSets}
        onLogSet={handleLogSet}
        onSetComplete={handleSetComplete}
      />

      <MuscleMap activeMuscles={activeMuscles} />

      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
        <button
          type="button"
          onClick={goPrev}
          disabled={isFirst}
          className="touch-manipulation flex min-h-[44px] items-center gap-1 text-sm text-text-muted disabled:opacity-30"
        >
          <ChevronLeft size={18} /> Predchádzajúci
        </button>
        {!isLast ? (
          <button
            type="button"
            onClick={goNext}
            className="touch-manipulation flex min-h-[44px] items-center gap-1 text-sm text-accent-green"
          >
            Ďalší <ChevronRight size={18} />
          </button>
        ) : (
          <GreenButton onClick={handleFinish}>
            <span className="flex items-center gap-2">
              <Check size={18} /> DOKONČIŤ TRÉNING
            </span>
          </GreenButton>
        )}
      </div>
    </motion.main>
  );
}
