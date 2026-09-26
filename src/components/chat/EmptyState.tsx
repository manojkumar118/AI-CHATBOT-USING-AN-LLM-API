import React from 'react';
import { AuraLogo } from '../common/AuraLogo';
import { Sparkles, Code2, Lightbulb, PenTool, Compass, HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  onSelectPrompt: (promptText: string) => void;
}

const SUGGESTIONS = [
  {
    icon: HelpCircle,
    label: 'Explain something',
    prompt: 'Explain how transformers utilize self-attention mechanisms in intuitive terms.',
    gradient: 'from-cyan-500/20 to-indigo-500/20 text-cyan-400',
  },
  {
    icon: Code2,
    label: 'Help me code',
    prompt: 'Build a production-ready debounce and throttle hook in TypeScript with unit test cases.',
    gradient: 'from-indigo-500/20 to-purple-500/20 text-indigo-400',
  },
  {
    icon: Lightbulb,
    label: 'Analyze an idea',
    prompt: 'Analyze the trade-offs of using WebAssembly vs Web Workers for client-side cryptographic hashing.',
    gradient: 'from-purple-500/20 to-pink-500/20 text-purple-400',
  },
  {
    icon: PenTool,
    label: 'Write something',
    prompt: 'Draft an executive launch memo announcing a zero-latency real-time voice interface product.',
    gradient: 'from-amber-500/20 to-orange-500/20 text-amber-400',
  },
  {
    icon: Compass,
    label: 'Brainstorm with me',
    prompt: 'Brainstorm 5 innovative UX paradigms for interacting with autonomous coding agents in 2026.',
    gradient: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
  },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 max-w-4xl mx-auto text-center select-none">
      {/* Central Glowing 3D Emblem */}
      <div className="mb-6 transform hover:scale-105 transition-transform duration-500 cursor-pointer">
        <AuraLogo size="xl" showText={false} animated={true} />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AURA
        </span>
        <span className="aura-text-gradient text-2xl sm:text-3xl font-extrabold tracking-widest">
          AI
        </span>
      </div>

      <h2 className="text-lg sm:text-xl text-[#9A9AA3] font-normal mb-8 max-w-md">
        How can I help you think, build, or create today?
      </h2>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl">
        {SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="group text-left p-4 rounded-2xl bg-[#0E0E12] border border-white/5 hover:border-indigo-500/40 hover:bg-white/[0.03] transition-all duration-200 flex flex-col justify-between shadow-sm cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.label}
                </span>
                <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${item.gradient} border border-white/10`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-xs text-[#9A9AA3] line-clamp-2 leading-relaxed">
                "{item.prompt}"
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
