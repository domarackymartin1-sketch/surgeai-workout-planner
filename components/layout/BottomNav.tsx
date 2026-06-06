'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, Apple, BarChart3 } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/workout', label: 'Workout', icon: Dumbbell },
  { href: '/nutrition', label: 'Nutrition', icon: Apple },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith('/workout/') && pathname !== '/workout') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1E1E1E] bg-[#0A0A0A] safe-bottom">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="touch-manipulation flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5"
            >
              <Icon
                size={22}
                className={active ? 'text-accent-green' : 'text-text-muted'}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span
                className={`text-[10px] font-medium ${active ? 'text-accent-green' : 'text-text-muted'}`}
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
