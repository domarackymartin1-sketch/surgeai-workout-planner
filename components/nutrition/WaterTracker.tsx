'use client';

import { useState } from 'react';
import { Droplets, Trash2, Plus } from 'lucide-react';
import RulerPicker from '@/components/ui/RulerPicker';
import GreenButton from '@/components/ui/GreenButton';
import { useStore } from '@/lib/store';
import type { WaterEntry } from '@/lib/types';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function WaterTracker({
  date,
  entries,
  dailyTarget,
}: {
  date: string;
  entries: WaterEntry[];
  dailyTarget: number;
}) {
  const addWaterEntry = useStore((s) => s.addWaterEntry);
  const removeWaterEntry = useStore((s) => s.removeWaterEntry);
  const [amountMl, setAmountMl] = useState(250);
  const [hour, setHour] = useState(new Date().getHours());
  const [minute, setMinute] = useState(0);
  const [showAdd, setShowAdd] = useState(false);

  const totalMl = entries.reduce((s, e) => s + e.amountMl, 0);
  const pct = Math.min((totalMl / dailyTarget) * 100, 100);

  const handleAdd = () => {
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    addWaterEntry(amountMl, time, date);
    setShowAdd(false);
  };

  return (
    <section className="mb-8">
      <h2 className="section-title flex items-center justify-center gap-2">
        <Droplets size={18} className="text-accent-blue" /> Voda
      </h2>

      <div className="glass-card mx-auto max-w-sm p-5">
        <div className="mb-4 text-center">
          <p className="text-3xl font-bold text-accent-blue">{totalMl} ml</p>
          <p className="text-xs text-white/40">z {dailyTarget} ml cieľa</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-accent-blue transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {!showAdd ? (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="touch-manipulation flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-white/20 py-3 text-sm text-white/50"
          >
            <Plus size={16} /> Pridať vodu
          </button>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-center text-xs text-white/40">Množstvo</p>
              <RulerPicker
                min={50}
                max={1000}
                step={50}
                value={amountMl}
                onChange={setAmountMl}
                formatValue={(v) => String(v)}
                unit="ml"
              />
            </div>

            <div>
              <p className="mb-2 text-center text-xs text-white/40">Čas</p>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <p className="mb-1 text-[10px] text-white/30">Hodina</p>
                  <div className="hide-scrollbar flex h-24 w-16 flex-col overflow-y-auto rounded-xl bg-bg-surface">
                    {HOURS.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setHour(h)}
                        className={`py-2 text-sm ${hour === h ? 'font-bold text-accent-blue' : 'text-white/40'}`}
                      >
                        {String(h).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="self-center text-2xl text-white/30">:</span>
                <div className="text-center">
                  <p className="mb-1 text-[10px] text-white/30">Minúta</p>
                  <div className="hide-scrollbar flex h-24 w-16 flex-col overflow-y-auto rounded-xl bg-bg-surface">
                    {[0, 15, 30, 45].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMinute(m)}
                        className={`py-2 text-sm ${minute === m ? 'font-bold text-accent-blue' : 'text-white/40'}`}
                      >
                        {String(m).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="flex-1 rounded-full border border-white/20 py-3 text-sm text-white/50"
              >
                Zrušiť
              </button>
              <GreenButton onClick={handleAdd} className="flex-1">
                Pridať
              </GreenButton>
            </div>
          </div>
        )}

        {entries.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
            {entries.map((e) => (
              <div key={e.id} className="flex items-center justify-between text-sm">
                <span className="text-white/70">
                  {e.time} – <span className="font-medium text-accent-blue">{e.amountMl} ml</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeWaterEntry(date, e.id)}
                  className="p-1 text-white/30"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
