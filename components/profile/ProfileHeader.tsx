'use client';

import { useRef, useState } from 'react';
import { Plus, Pencil, Check, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getInitials } from '@/lib/utils';

export default function ProfileHeader() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const fileRef = useRef<HTMLInputElement>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  if (!profile) return null;

  const startEditName = () => {
    setNameDraft(profile.name);
    setEditingName(true);
  };

  const saveName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed) updateProfile({ name: trimmed });
    setEditingName(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateProfile({ avatarUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

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
        <div className="relative shrink-0">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-20 w-20 rounded-full border-2 border-white/20 object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-bg-card text-2xl font-bold text-accent-green">
              {getInitials(profile.name)}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent-green text-black"
            aria-label="Zmeniť fotku"
          >
            <Plus size={14} strokeWidth={3} />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="min-w-0 flex-1 rounded-lg bg-white/10 px-3 py-2 text-xl font-bold text-white outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveName();
                  if (e.key === 'Escape') setEditingName(false);
                }}
              />
              <button type="button" onClick={saveName} className="p-2 text-accent-green">
                <Check size={18} />
              </button>
              <button type="button" onClick={() => setEditingName(false)} className="p-2 text-white/50">
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={startEditName}
              className="group flex items-center gap-2 text-left"
            >
              <h1 className="truncate text-3xl font-bold text-white">{profile.name}</h1>
              <Pencil size={16} className="shrink-0 text-white/30 group-hover:text-accent-green" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
