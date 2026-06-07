'use client';

import { useRef, useEffect, useCallback } from 'react';

interface RulerPickerProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  formatValue: (v: number) => string;
  unit: string;
}

const TICK_WIDTH = 12;

export default function RulerPicker({
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
  unit,
}: RulerPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const count = Math.round((max - min) / step) + 1;

  const scrollToValue = useCallback(
    (v: number, smooth = false) => {
      const el = scrollRef.current;
      if (!el) return;
      const index = Math.round((v - min) / step);
      const x = index * TICK_WIDTH;
      el.scrollTo({ left: x, behavior: smooth ? 'smooth' : 'auto' });
    },
    [min, step]
  );

  useEffect(() => {
    scrollToValue(value, false);
  }, [value, scrollToValue]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / TICK_WIDTH);
    const clamped = Math.max(0, Math.min(count - 1, index));
    const newVal = +(min + clamped * step).toFixed(step < 1 ? 1 : 0);
    if (newVal !== value) onChange(newVal);
  };

  return (
    <div className="relative w-full">
      <p className="mb-6 text-center">
        <span className="text-5xl font-bold text-white">{formatValue(value)}</span>
        <span className="ml-2 text-xl text-white/40">{unit}</span>
      </p>

      <div className="relative h-20">
        <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-full w-0.5 -translate-x-1/2 bg-white" />
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="hide-scrollbar flex h-full overflow-x-auto px-[50%]"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {Array.from({ length: count }, (_, i) => {
            const v = min + i * step;
            const isMajor = step >= 1 ? v % (step * 10) === 0 || v % 10 === 0 : Math.round(v * 10) % 10 === 0;
            return (
              <div
                key={i}
                className="flex shrink-0 flex-col items-center justify-end"
                style={{ width: TICK_WIDTH, scrollSnapAlign: 'center' }}
              >
                <div
                  className={`w-px bg-white/30 ${isMajor ? 'h-10' : 'h-5'}`}
                />
                {isMajor && (
                  <span className="mt-1 text-[9px] text-white/40">
                    {step < 1 ? v.toFixed(1) : Math.round(v)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
