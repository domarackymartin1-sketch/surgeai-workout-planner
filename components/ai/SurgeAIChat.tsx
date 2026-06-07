'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Trash2, Sparkles, ChevronLeft } from 'lucide-react';
import { useStore } from '@/lib/store';
import { generateCoachReply, getWelcomeMessage } from '@/lib/aiCoach';
import { generateId } from '@/lib/utils';
import type { ChatMessage } from '@/lib/aiCoach';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('sk-SK', { hour: 'numeric', minute: '2-digit' });
}

function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ));
  });
}

export default function SurgeAIChat() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const aiChatMessages = useStore((s) => s.aiChatMessages);
  const addAiMessage = useStore((s) => s.addAiMessage);
  const clearAiChat = useStore((s) => s.clearAiChat);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = aiChatMessages.length > 0 ? aiChatMessages : [getWelcomeMessage()];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, typing]);

  const send = () => {
    const text = input.trim();
    if (!text || typing) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    addAiMessage(userMsg);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: generateCoachReply(text, profile),
        timestamp: new Date().toISOString(),
      };
      addAiMessage(reply);
      setTyping(false);
    }, 600 + Math.random() * 400);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-black">
      <header className="safe-top border-b border-white/10 px-5 pb-4 pt-4">
        <div className="mx-auto flex max-w-lg items-start justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-3 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/60"
            aria-label="Späť"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-accent-green" />
              <h1 className="text-xl font-bold text-white">Surge AI</h1>
            </div>
            <p className="mt-0.5 text-sm text-white/40">Tvoj osobný tréningový asistent</p>
          </div>
          <button
            type="button"
            onClick={clearAiChat}
            className="flex flex-col items-center gap-0.5 text-white/40"
          >
            <Trash2 size={18} />
            <span className="text-[10px]">Vymazať</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-lg space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-white/90 text-black'
                    : 'bg-bg-card text-white/90'
                }`}
              >
                <div className="text-sm leading-relaxed">{renderContent(msg.content)}</div>
                <p
                  className={`mt-1.5 text-right text-[10px] ${
                    msg.role === 'user' ? 'text-black/40' : 'text-white/30'
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-bg-card px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="safe-bottom border-t border-white/10 bg-black px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Správa pre Surge AI..."
            className="flex-1 rounded-full bg-bg-card px-5 py-3.5 text-sm text-white outline-none placeholder:text-white/30"
          />
          <button
            type="button"
            onClick={send}
            disabled={!input.trim() || typing}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
