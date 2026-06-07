'use client';

import { Plus } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getInitials } from '@/lib/utils';

export default function ProfileHeader() {
  const profile = useStore((s) => s.profile);
  if (!profile) return null;

  return (
    <div className="relative -mx-4 mb-4 overflow-hidden rounded-b-3xl">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />

      <div className="relative flex items-center gap-4 px-5 pb-8 pt-6">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-bg-card text-2xl font-bold text-accent-green">
            {getInitials(profile.name)}
          </div>
          <button
            type="button"
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent-green text-black"
          >
            <Plus size={14} strokeWidth={3} />
          </button>
        </div>
        <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
      </div>
    </div>
  );
}
