'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { formatTime } from '@/lib/utils';

const PRESETS = [30, 60, 90, 120];

interface RestTimerProps {
  defaultSeconds: number;
  autoStart?: boolean;
  onComplete?: () => void;
  onSecondsChange?: (seconds: number) => void;
}

export default function RestTimer({
  defaultSeconds,
  autoStart = false,
  onComplete,
  onSecondsChange,
}: RestTimerProps) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [remaining, setRemaining] = useState(defaultSeconds);
  const [running, setRunning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.1;
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // audio not available
    }
  }, []);

  useEffect(() => {
    if (autoStart) {
      setRemaining(seconds);
      setRunning(true);
    }
  }, [autoStart, seconds]);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      setRunning(false);
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      playBeep();
      onComplete?.();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [running, remaining, onComplete, playBeep]);

  const setPreset = (s: number) => {
    setSeconds(s);
    setRemaining(s);
    onSecondsChange?.(s);
    setRunning(false);
  };

  return (
    <div className="text-center">
      <p
        className={`font-display text-6xl font-bold text-accent-green ${running ? 'animate-pulse-glow rounded-2xl' : ''}`}
      >
        {formatTime(remaining)}
      </p>
      <p className="mb-4 mt-2 text-sm text-text-muted">Oddych</p>
      <div className="mb-4 flex justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPreset(p)}
            className={`
              touch-manipulation min-h-[44px] min-w-[44px] rounded-btn px-3 text-sm font-medium
              ${seconds === p ? 'bg-accent-green text-black' : 'bg-bg-card text-text-muted'}
            `}
          >
            {p}s
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          if (running) {
            setRunning(false);
          } else {
            setRemaining(seconds);
            setRunning(true);
          }
        }}
        className="touch-manipulation text-sm text-accent-green underline"
      >
        {running ? 'Pauza' : 'Spustiť timer'}
      </button>
    </div>
  );
}
