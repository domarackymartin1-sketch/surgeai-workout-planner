'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, Check } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import GreenButton from '@/components/ui/GreenButton';
import { useStore } from '@/lib/store';
import type {
  ExperienceLevel,
  HabitId,
  OnboardingData,
  UserGoal,
  WorkoutCategory,
  WorkoutFrequency,
} from '@/lib/types';
import {
  GOAL_LABELS,
  EXPERIENCE_LABELS,
  FREQUENCY_LABELS,
  CATEGORY_LABELS,
  HABIT_LABELS,
  calculateBMI,
  getBMICategory,
} from '@/lib/utils';

const TOTAL_QUESTIONS = 8;

function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add('onboarding-lock');
    return () => document.documentElement.classList.remove('onboarding-lock');
  }, [active]);
}

function OnboardingShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`onboarding-screen flex flex-col bg-black safe-top safe-bottom ${className}`}>
      {children}
    </div>
  );
}

function LandingScreen({ onStart, onLogin }: { onStart: () => void; onLogin: () => void }) {
  return (
    <OnboardingShell>
      <div className="landing-bg relative flex h-full w-full flex-col">
        <div className="landing-overlay absolute inset-0" />
        <div className="relative flex h-full flex-col px-6 pb-10 pt-6">
          <Logo size="lg" />
          <div className="mt-auto">
            <h1 className="mb-3 font-display text-[2.25rem] font-bold leading-[1.08] tracking-tight text-white sm:text-[2.6rem]">
              Silnejší
              <br />
              každý deň.
              <br />
              <span className="text-accent-green">Lepšie ty.</span>
            </h1>
            <p className="mb-8 max-w-[300px] text-[15px] leading-relaxed text-white/60">
              Pridaj sa k SurgeAI a odomkni svoj skutočný potenciál.
            </p>
            <button
              type="button"
              onClick={onStart}
              className="touch-manipulation neon-glow flex w-full items-center justify-center gap-3 rounded-full bg-accent-green py-4 font-display text-base font-bold text-black"
            >
              Začať
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/20">
                <ArrowRight size={16} />
              </span>
            </button>
            <p className="mt-5 text-center text-sm text-white/50">
              Už máš účet?{' '}
              <button type="button" onClick={onLogin} className="touch-manipulation font-semibold text-white underline underline-offset-2">
                Prihlásiť sa
              </button>
            </p>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}

function QuestionScreen({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
}) {
  return (
    <OnboardingShell className="gradient-mesh">
      <div className="flex h-full flex-col overflow-hidden px-6 pb-8 pt-6">
        <Logo size="md" />
        <div className="mb-6 mt-5 flex items-center gap-3">
          <div className="flex flex-1 gap-1">
            {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < step ? 'bg-accent-green' : i === step ? 'bg-accent-green/50' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-white/40">{step + 1}/{TOTAL_QUESTIONS}</span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden">
          {children}
        </div>
      </div>
    </OnboardingShell>
  );
}

function SelectCard({
  selected,
  onClick,
  children,
  multi,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`touch-manipulation flex items-center justify-between rounded-2xl p-4 text-left font-medium transition-all ${
        selected ? 'glass-pill-active text-accent-green' : 'glass-card text-text-primary'
      }`}
    >
      <span>{children}</span>
      {multi && selected && <Check size={18} className="text-accent-green" />}
    </button>
  );
}

interface OnboardingFlowProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  step: number;
  setStep: (s: number) => void;
  onFinish: () => void;
}

function OnboardingFlow({ data, setData, step, setStep, onFinish }: OnboardingFlowProps) {
  const update = <K extends keyof OnboardingData>(key: K, val: OnboardingData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const next = () => setStep(step + 1);

  if (step === 1) {
    return (
      <QuestionScreen step={0}>
        <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">Ako sa voláš?</h2>
        <p className="mb-6 text-sm text-white/45">Personalizujeme tvoju fitness cestu.</p>
        <div className="glass-card mb-6 px-4">
          <input
            type="text"
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Tvoje meno"
            className="w-full bg-transparent py-4 text-xl outline-none placeholder:text-white/30"
          />
        </div>
        <GreenButton onClick={() => data.name.trim() && next()} disabled={!data.name.trim()} fullWidth pill>
          Pokračovať <ChevronRight size={18} />
        </GreenButton>
      </QuestionScreen>
    );
  }

  if (step === 2) {
    const goals: UserGoal[] = ['muscle', 'loss', 'maintain', 'strength'];
    return (
      <QuestionScreen step={1}>
        <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">Tvoj hlavný cieľ?</h2>
        <p className="mb-5 text-sm text-white/45">Čo chceš dosiahnuť?</p>
        <div className="mb-6 flex max-h-[50vh] flex-col gap-2.5 overflow-y-auto hide-scrollbar">
          {goals.map((g) => (
            <SelectCard key={g} selected={data.goal === g} onClick={() => update('goal', g)}>
              {GOAL_LABELS[g]}
            </SelectCard>
          ))}
        </div>
        <GreenButton onClick={next} fullWidth pill>Pokračovať <ChevronRight size={18} /></GreenButton>
      </QuestionScreen>
    );
  }

  if (step === 3) {
    const levels: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced'];
    return (
      <QuestionScreen step={2}>
        <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">Tvoja úroveň?</h2>
        <p className="mb-5 text-sm text-white/45">Ako dlho cvičíš?</p>
        <div className="mb-6 flex flex-col gap-2.5">
          {levels.map((l) => (
            <SelectCard key={l} selected={data.experienceLevel === l} onClick={() => update('experienceLevel', l)}>
              {EXPERIENCE_LABELS[l]}
            </SelectCard>
          ))}
        </div>
        <GreenButton onClick={next} fullWidth pill>Pokračovať <ChevronRight size={18} /></GreenButton>
      </QuestionScreen>
    );
  }

  if (step === 4) {
    const freqs: WorkoutFrequency[] = ['2-3', '4-5', '6+'];
    return (
      <QuestionScreen step={3}>
        <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">Ako často cvičíš?</h2>
        <p className="mb-5 text-sm text-white/45">Nastavíme ti týždenný plán.</p>
        <div className="mb-6 flex flex-col gap-2.5">
          {freqs.map((f) => (
            <SelectCard key={f} selected={data.workoutFrequency === f} onClick={() => update('workoutFrequency', f)}>
              {FREQUENCY_LABELS[f]}
            </SelectCard>
          ))}
        </div>
        <GreenButton onClick={next} fullWidth pill>Pokračovať <ChevronRight size={18} /></GreenButton>
      </QuestionScreen>
    );
  }

  if (step === 5) {
    const cats: WorkoutCategory[] = ['gym', 'cardio', 'hybrid', 'hiit', 'yoga', 'recovery'];
    const toggle = (c: WorkoutCategory) => {
      const has = data.categories.includes(c);
      update('categories', has ? data.categories.filter((x) => x !== c) : [...data.categories, c]);
    };
    return (
      <QuestionScreen step={4}>
        <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">Vyber kategórie</h2>
        <p className="mb-5 text-sm text-white/45">Môžeš vybrať viac možností.</p>
        <div className="mb-6 grid grid-cols-2 gap-2.5">
          {cats.map((c) => (
            <SelectCard key={c} selected={data.categories.includes(c)} onClick={() => toggle(c)} multi>
              {CATEGORY_LABELS[c]}
            </SelectCard>
          ))}
        </div>
        <GreenButton onClick={next} disabled={data.categories.length === 0} fullWidth pill>
          Pokračovať <ChevronRight size={18} />
        </GreenButton>
      </QuestionScreen>
    );
  }

  if (step === 6) {
    const bmi = calculateBMI(data.weightKg, data.heightCm);
    const cat = getBMICategory(bmi);
    return (
      <QuestionScreen step={5}>
        <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">Tvoje miery</h2>
        <p className="mb-5 text-sm text-white/45">Pre BMI kalkulačku a personalizáciu.</p>
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="glass-card px-4 py-3">
            <label className="text-xs text-white/40">Výška (cm)</label>
            <input
              type="number"
              value={data.heightCm || ''}
              onChange={(e) => update('heightCm', Number(e.target.value))}
              className="w-full bg-transparent py-2 text-2xl font-bold text-accent-green outline-none"
              placeholder="175"
            />
          </div>
          <div className="glass-card px-4 py-3">
            <label className="text-xs text-white/40">Váha (kg)</label>
            <input
              type="number"
              value={data.weightKg || ''}
              onChange={(e) => update('weightKg', Number(e.target.value))}
              className="w-full bg-transparent py-2 text-2xl font-bold text-accent-green outline-none"
              placeholder="75"
            />
          </div>
        </div>
        {bmi > 0 && (
          <div className="glass-card mb-6 p-4 text-center">
            <p className="text-xs text-white/40">Tvoje BMI</p>
            <p className="font-display text-4xl font-bold" style={{ color: cat.color }}>{bmi}</p>
            <p className="text-sm" style={{ color: cat.color }}>{cat.label}</p>
          </div>
        )}
        <GreenButton onClick={next} disabled={!data.heightCm || !data.weightKg} fullWidth pill>
          Pokračovať <ChevronRight size={18} />
        </GreenButton>
      </QuestionScreen>
    );
  }

  if (step === 7) {
    const habits: HabitId[] = ['water', 'sleep', 'stretching', 'steps', 'meditation', 'protein'];
    const toggle = (h: HabitId) => {
      const has = data.habits.includes(h);
      update('habits', has ? data.habits.filter((x) => x !== h) : [...data.habits, h]);
    };
    return (
      <QuestionScreen step={6}>
        <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">Denné návyky</h2>
        <p className="mb-5 text-sm text-white/45">Čo chceš sledovať každý deň?</p>
        <div className="mb-6 grid grid-cols-2 gap-2.5">
          {habits.map((h) => (
            <SelectCard key={h} selected={data.habits.includes(h)} onClick={() => toggle(h)} multi>
              {HABIT_LABELS[h]}
            </SelectCard>
          ))}
        </div>
        <GreenButton onClick={next} disabled={data.habits.length === 0} fullWidth pill>
          Pokračovať <ChevronRight size={18} />
        </GreenButton>
      </QuestionScreen>
    );
  }

  if (step === 8) {
    return (
      <QuestionScreen step={7}>
        <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">Kalorický cieľ</h2>
        <p className="mb-6 text-sm text-white/45">Denný príjem kalórií.</p>
        <div className="glass-card mb-6 px-4 py-4 text-center">
          <input
            type="number"
            value={data.dailyKcalTarget}
            onChange={(e) => update('dailyKcalTarget', Number(e.target.value))}
            className="w-full bg-transparent text-center font-display text-4xl font-bold text-accent-green outline-none"
          />
          <span className="text-sm text-white/40">kcal / deň</span>
        </div>
        <GreenButton fullWidth pill onClick={onFinish}>
          Začať trénovať ⚡
        </GreenButton>
      </QuestionScreen>
    );
  }

  return null;
}

const defaultData: OnboardingData = {
  name: '',
  goal: 'muscle',
  experienceLevel: 'beginner',
  workoutFrequency: '4-5',
  categories: [],
  heightCm: 0,
  weightKg: 0,
  habits: [],
  dailyKcalTarget: 2500,
};

export default function Onboarding() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const saveOnboarding = useStore((s) => s.saveOnboarding);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [mounted, setMounted] = useState(false);

  useScrollLock(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFinish = () => {
    saveOnboarding(data);
    completeOnboarding();
    document.documentElement.classList.remove('onboarding-lock');
    router.replace('/');
  };

  const handleLogin = () => {
    if (profile?.onboardingComplete) {
      document.documentElement.classList.remove('onboarding-lock');
      router.replace('/');
    }
  };

  const content = (
    <AnimatePresence mode="wait">
      {step === 0 && (
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LandingScreen onStart={() => setStep(1)} onLogin={handleLogin} />
        </motion.div>
      )}
      {step >= 1 && step <= 8 && (
        <motion.div key={`step-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <OnboardingFlow data={data} setData={setData} step={step} setStep={setStep} onFinish={handleFinish} />
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
