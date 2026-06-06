'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import GreenButton from '@/components/ui/GreenButton';
import { useStore } from '@/lib/store';
import type { UserGoal } from '@/lib/types';
import { GOAL_LABELS } from '@/lib/utils';

const LOGO = 'SurgeAI';

function SplashScreen({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onNext, 2000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <motion.div
      className="flex min-h-dvh flex-col items-center justify-center bg-bg-primary px-6"
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="mb-4 flex"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {LOGO.split('').map((letter, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { color: 'var(--text-dim)' },
              visible: { color: 'var(--accent-green)' },
            }}
            className="font-display text-5xl font-bold"
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
      <p className="text-sm text-text-muted">Your intelligent workout companion</p>
    </motion.div>
  );
}

function NameScreen({ onNext }: { onNext: (name: string) => void }) {
  const [name, setName] = useState('');

  return (
    <motion.div
      className="flex min-h-dvh flex-col justify-center bg-bg-primary px-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <h2 className="mb-8 font-display text-3xl font-bold">Ako sa voláš?</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tvoje meno"
        className="mb-8 border-b-2 border-accent-green bg-transparent py-3 text-xl text-text-primary outline-none placeholder:text-text-muted"
        autoFocus
      />
      <GreenButton
        onClick={() => name.trim() && onNext(name.trim())}
        disabled={!name.trim()}
      >
        Pokračovať →
      </GreenButton>
    </motion.div>
  );
}

function GoalScreen({
  onNext,
}: {
  onNext: (goal: UserGoal) => void;
}) {
  const [selected, setSelected] = useState<UserGoal | null>(null);
  const goals: UserGoal[] = ['muscle', 'loss', 'maintain', 'strength'];

  return (
    <motion.div
      className="flex min-h-dvh flex-col justify-center bg-bg-primary px-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <h2 className="mb-8 font-display text-3xl font-bold">Čo je tvoj hlavný cieľ?</h2>
      <div className="mb-8 flex flex-col gap-3">
        {goals.map((goal) => (
          <button
            key={goal}
            type="button"
            onClick={() => setSelected(goal)}
            className={`
              touch-manipulation rounded-card border-2 p-4 text-left font-medium transition-colors
              ${selected === goal
                ? 'border-accent-green bg-accent-green/10 text-accent-green'
                : 'border-text-dim bg-bg-card text-text-primary'}
            `}
          >
            {GOAL_LABELS[goal]}
          </button>
        ))}
      </div>
      <GreenButton onClick={() => selected && onNext(selected)} disabled={!selected}>
        Pokračovať →
      </GreenButton>
    </motion.div>
  );
}

function KcalScreen({ onFinish }: { onFinish: (kcal: number) => void }) {
  const [kcal, setKcal] = useState(2500);

  return (
    <motion.div
      className="flex min-h-dvh flex-col justify-center bg-bg-primary px-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <h2 className="mb-8 font-display text-3xl font-bold">
        Koľko kcal chceš denne skonzumovať?
      </h2>
      <input
        type="number"
        value={kcal}
        onChange={(e) => setKcal(Number(e.target.value))}
        className="mb-8 border-b-2 border-accent-green bg-transparent py-3 text-3xl font-bold text-accent-green outline-none"
      />
      <GreenButton fullWidth onClick={() => onFinish(kcal)}>
        Začať trénovať ⚡
      </GreenButton>
    </motion.div>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<UserGoal>('muscle');

  const handleFinish = (kcal: number) => {
    setProfile({ name, goal, dailyKcalTarget: kcal });
    completeOnboarding();
    router.push('/');
  };

  return (
    <AnimatePresence mode="wait">
      {step === 0 && <SplashScreen key="splash" onNext={() => setStep(1)} />}
      {step === 1 && (
        <NameScreen
          key="name"
          onNext={(n) => {
            setName(n);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <GoalScreen
          key="goal"
          onNext={(g) => {
            setGoal(g);
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
        <KcalScreen key="kcal" onFinish={handleFinish} />
      )}
    </AnimatePresence>
  );
}
