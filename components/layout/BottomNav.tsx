'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, Apple, BarChart3 } from 'lucide-react';
import { useStore } from '@/lib/store';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/workout', label: 'Workout', icon: Dumbbell },
  { href: '/nutrition', label: 'Nutrition', icon: Apple },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function BottomNav() {
  const pathname = usePathname();
  const profile = useStore((s) => s.profile);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;
  if (!profile?.onboardingComplete) return null;
  if (pathname.startsWith('/workout/') && pathname !== '/workout') return null;

  return (
    <nav className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-[max(12px,env(safe-area-inset-bottom))]">
      <div className="glass-nav pointer-events-auto flex h-[68px] w-full max-w-sm items-center justify-around rounded-[28px] px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="touch-manipulation flex min-h-[52px] min-w-[52px] flex-col items-center justify-center gap-0.5 rounded-2xl transition-all duration-200"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                  active ? 'glass-pill-active' : ''
                }`}
              >
                <Icon
                  size={20}
                  className={active ? 'text-accent-green' : 'text-white/45'}
                  strokeWidth={active ? 2.5 : 1.5}
                />
              </div>
              <span
                className={`text-[9px] font-semibold tracking-wide ${
                  active ? 'text-accent-green' : 'text-white/40'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
