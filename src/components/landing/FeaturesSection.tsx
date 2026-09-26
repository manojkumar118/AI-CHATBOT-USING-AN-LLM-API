import React from 'react';
import { MessageSquare, Database, Zap, Image, Code2, ShieldCheck } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  tag: string;
  accentColor: string;
}

const FEATURES: FeatureCardProps[] = [
  {
    icon: MessageSquare,
    title: 'Intelligent Conversations',
    description: 'Natural conversations powered by modern state-of-the-art LLM architectures with exceptional nuance and depth.',
    tag: 'Core Intelligence',
    accentColor: 'from-cyan-500/20 to-indigo-500/20 text-cyan-400',
  },
  {
    icon: Database,
    title: 'Persistent Memory',
    description: 'AURA remembers conversation context and previous statements to provide coherent, progressively tailored responses.',
    tag: 'Contextual Recall',
    accentColor: 'from-indigo-500/20 to-purple-500/20 text-indigo-400',
  },
  {
    icon: Zap,
    title: 'Streaming Responses',
    description: 'Words materialize smoothly token-by-token in real time. Never freeze the interface waiting for completions.',
    tag: 'Sub-30ms Latency',
    accentColor: 'from-amber-500/20 to-orange-500/20 text-amber-400',
  },
  {
    icon: Image,
    title: 'Multimodal Ready',
    description: 'Prepared architecture for high-resolution images, PDF documents, and system telemetry analysis.',
    tag: 'Vision & OCR',
    accentColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
  },
  {
    icon: Code2,
    title: 'Developer Friendly',
    description: 'Beautiful code rendering with syntax highlighting, language headers, line numbers, and instant one-click copy.',
    tag: 'Syntax Highlighting',
    accentColor: 'from-blue-500/20 to-indigo-500/20 text-blue-400',
  },
  {
    icon: ShieldCheck,
    title: 'Private by Design',
    description: 'Server-side API proxy isolation. Provider credentials and API keys are never exposed to client-side bundles.',
    tag: 'Zero Client Leak',
    accentColor: 'from-violet-500/20 to-pink-500/20 text-violet-400',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3">
          Architecture & Capabilities
        </h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F7] tracking-tight">
          Engineered for depth, speed, and discretion.
        </p>
        <p className="mt-4 text-[#9A9AA3] text-sm sm:text-base">
          Built with an uncompromising standard for performance, aesthetics, and user trust.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="group relative p-8 rounded-2xl bg-[#0E0E12] border border-white/5 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              {/* Subtle Card Glow on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="flex items-center justify-between mb-5">
                <div className={`p-3 rounded-xl bg-gradient-to-tr ${feat.accentColor} border border-white/10`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 text-[#9A9AA3] border border-white/5">
                  {feat.tag}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {feat.title}
              </h3>
              <p className="text-sm text-[#9A9AA3] leading-relaxed">
                {feat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
