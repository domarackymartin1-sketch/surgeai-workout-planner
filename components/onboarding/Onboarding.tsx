'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import GreenButton from '@/components/ui/GreenButton';
import { useStore } from '@/lib/store';
import type { UserGoal } from '@/lib/types';
import { GOAL_LABELS } from '@/lib/utils';

const GYM_IMAGE =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80&auto=format&fit=crop';

function useScrollLock(active: boolean) {
  useEffect(() => {
    if (active) {
      document.documentElement.classList.add('onboarding-lock');
    } else {
      document.documentElement.classList.remove('onboarding-lock');
    }
    return () => document.documentElement.classList.remove('onboarding-lock');
  }, [active]);
}

function OnboardingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex h-dvh w-full flex-col overflow-hidden overscroll-none bg-black">
      {children}
    </div>
  );
}

function LandingScreen({
  onStart,
  onLogin,
}: {
  onStart: () => void;
  onLogin: () => void;
}) {
  return (
    <OnboardingShell>
      <div className="relative h-full w-full">
        <Image
          src={GYM_IMAGE}
          alt="Fitness"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="landing-overlay absolute inset-0" />

        <div className="relative flex h-full flex-col px-6 pb-10 pt-14">
          <Logo size="lg" />

          <div className="mt-auto">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-3 font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-white"
            >
              Silnejší
              <br />
              každý deň.
              <br />
              <span className="text-accent-green">Lepšie ty.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8 max-w-[280px] text-[15px] leading-relaxed text-white/60"
            >
              Pridaj sa k SurgeAI a odomkni svoj skutočný potenciál.
            </motion.p>

            <motion.button
              type="button"
              onClick={onStart}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.97 }}
              className="touch-manipulation neon-glow flex w-full items-center justify-center gap-3 rounded-full bg-accent-green py-4 font-display text-base font-bold text-black"
            >
              Začať
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/20">
                <ArrowRight size={16} />
              </span>
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-5 text-center text-sm text-white/50"
            >
              Už máš účet?{' '}
              <button
                type="button"
                onClick={onLogin}
                className="touch-manipulation font-semibold text-white underline underline-offset-2"
              >
                Prihlásiť sa
              </button>
            </motion.p>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}

function QuestionScreen({
  step,
  total,
  children,
}: {
  step: number;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <OnboardingShell>
      <div className="gradient-mesh flex h-full flex-col px-6 pb-8 pt-14">
        <Logo size="md" />
        <div className="mb-8 mt-6 flex gap-1.5">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i < step ? 'bg-accent-green' : i === step ? 'bg-accent-green/50' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
        <div className="flex flex-1 flex-col justify-center overflow-hidden">
          {children}
        </div>
      </div>
    </OnboardingShell>
  );
}

function NameScreen({ onNext }: { onNext: (name: string) => void }) {
  const [name, setName] = useState('');

  return (
    <QuestionScreen step={0} total={3}>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
      >
        <h2 className="mb-2 font-display text-3xl font-bold">Ako sa voláš?</h2>
        <p className="mb-8 text-sm text-text-muted">Personalizujeme tvoj tréningový plán.</p>
        <div className="glass-card mb-8 px-4 py-1">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tvoje meno"
            className="w-full bg-transparent py-4 text-xl text-text-primary outline-none placeholder:text-text-muted"
            autoFocus
          />
        </div>
        <GreenButton
          onClick={() => name.trim() && onNext(name.trim())}
          disabled={!name.trim()}
          fullWidth
          pill
        >
          Pokračovať <ChevronRight size={18} />
        </GreenButton>
      </motion.div>
    </QuestionScreen>
  );
}

function GoalScreen({ onNext }: { onNext: (goal: UserGoal) => void }) {
  const [selected, setSelected] = useState<UserGoal | null>(null);
  const goals: UserGoal[] = ['muscle', 'loss', 'maintain', 'strength'];

  return (
    <QuestionScreen step={1} total={3}>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="mb-2 font-display text-3xl font-bold">Čo je tvoj hlavný cieľ?</h2>
        <p className="mb-6 text-sm text-text-muted">Vyber jednu možnosť.</p>
        <div className="mb-8 flex flex-col gap-3">
          {goals.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => setSelected(goal)}
              className={`
                touch-manipulation rounded-2xl p-4 text-left font-medium transition-all duration-200
                ${selected === goal
                  ? 'glass-pill-active text-accent-green'
                  : 'glass-card text-text-primary hover:bg-white/5'}
              `}
            >
              {GOAL_LABELS[goal]}
            </button>
          ))}
        </div>
        <GreenButton onClick={() => selected && onNext(selected)} disabled={!selected} fullWidth pill>
          Pokračovať <ChevronRight size={18} />
        </GreenButton>
      </motion.div>
    </QuestionScreen>
  );
}

function KcalScreen({ onFinish }: { onFinish: (kcal: number) => void }) {
  const [kcal, setKcal] = useState(2500);

  return (
    <QuestionScreen step={2} total={3}>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="mb-2 font-display text-3xl font-bold">
          Denný kalorický cieľ
        </h2>
        <p className="mb-8 text-sm text-text-muted">Koľko kcal chceš denne skonzumovať?</p>
        <div className="glass-card mb-8 px-4 py-2 text-center">
          <input
            type="number"
            value={kcal}
            onChange={(e) => setKcal(Number(e.target.value))}
            className="w-full bg-transparent py-4 text-center font-display text-4xl font-bold text-accent-green outline-none"
          />
          <span className="text-sm text-text-muted">kcal / deň</span>
        </div>
        <GreenButton fullWidth pill onClick={() => onFinish(kcal)}>
          Začať trénovať ⚡
        </GreenButton>
      </motion.div>
    </QuestionScreen>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<UserGoal>('muscle');

  useScrollLock(true);

  const handleFinish = (kcal: number) => {
    setProfile({ name, goal, dailyKcalTarget: kcal });
    completeOnboarding();
    document.documentElement.classList.remove('onboarding-lock');
    router.push('/');
  };

  const handleLogin = () => {
    if (profile?.onboardingComplete) {
      document.documentElement.classList.remove('onboarding-lock');
      router.push('/');
    } else if (profile?.name) {
      setName(profile.name);
      setGoal(profile.goal);
      setStep(3);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {step === 0 && (
        <motion.div key="landing" exit={{ opacity: 0 }}>
          <LandingScreen onStart={() => setStep(1)} onLogin={handleLogin} />
        </motion.div>
      )}
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
      {step === 3 && <KcalScreen key="kcal" onFinish={handleFinish} />}
    </AnimatePresence>
  );
}
