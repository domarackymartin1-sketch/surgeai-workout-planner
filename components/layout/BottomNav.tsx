'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, Sparkles, Apple, User } from 'lucide-react';
import { useStore } from '@/lib/store';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/workout', label: 'Workout', icon: Dumbbell },
  { href: '/ai', label: 'Surge AI', icon: Sparkles, accent: true },
  { href: '/nutrition', label: 'Nutrition', icon: Apple },
  { href: '/profile', label: 'Profile', icon: User },
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
  if (pathname.startsWith('/ai')) return null;

  return (
    <nav className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex justify-center px-3 pb-[max(12px,env(safe-area-inset-bottom))]">
      <div className="glass-nav pointer-events-auto flex h-[68px] w-full max-w-md items-center justify-around rounded-[28px] px-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, accent }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="touch-manipulation flex min-h-[52px] min-w-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl transition-all duration-200"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                  active ? 'glass-pill-active' : ''
                } ${accent && !active ? 'text-white/60' : ''}`}
              >
                <Icon
                  size={accent ? 18 : 20}
                  className={active ? 'text-accent-green' : accent ? 'text-white/60' : 'text-white/45'}
                  strokeWidth={active ? 2.5 : 1.5}
                />
              </div>
              <span
                className={`max-w-[56px] truncate text-[8px] font-semibold tracking-wide ${
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
