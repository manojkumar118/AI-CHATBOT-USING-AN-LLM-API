import React, { useState } from 'react';
import { MessageSquare, Brain, Sparkles, LineChart, Code2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FeatureTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  points: string[];
  codeSnippet: string;
  language: string;
}

const TABS: FeatureTab[] = [
  {
    id: 'ask',
    label: '1. Ask',
    icon: MessageSquare,
    title: 'Natural Conversational Intelligence',
    description: 'Ask complex queries across mathematics, literature, research, and technical domains with conversational continuity and zero context degradation.',
    points: [
      'Multi-turn context retention',
      'Adaptive tone and precision matching',
      'Real-time streaming generation',
    ],
    codeSnippet: `// Example multi-turn conversational query
const response = await aura.chat({
  prompt: "Explain how attention heads compute similarity weights",
  depth: "mathematical_rigor",
  stream: true,
});`,
    language: 'typescript',
  },
  {
    id: 'understand',
    label: '2. Understand',
    icon: Brain,
    title: 'Multimodal Semantic Synthesis',
    description: 'Provide screenshots, architectural diagrams, PDF documents, or datasets. AURA deconstructs inputs and extracts underlying insights.',
    points: [
      'Visual OCR and document inspection',
      'Chart and telemetry graph parsing',
      'Holistic context integration',
    ],
    codeSnippet: `// Multimodal document inspection
const analysis = await aura.vision.inspect({
  document: "system_architecture_diagram.png",
  query: "Identify potential bottlenecks in the event bus",
});`,
    language: 'typescript',
  },
  {
    id: 'create',
    label: '3. Create',
    icon: Sparkles,
    title: 'Generative Ideation & Drafting',
    description: 'From executive strategic briefs to technical documentation and narrative synthesis, formulate high-impact written artifacts effortlessly.',
    points: [
      'Publication-grade editorial style',
      'Structured outlines and executive summaries',
      'Instant markdown formatting',
    ],
    codeSnippet: `// Content Generation Pipeline
const draft = await aura.generate({
  type: "executive_brief",
  topic: "Q3 Distributed Inference Latency Improvements",
  format: "markdown",
});`,
    language: 'typescript',
  },
  {
    id: 'analyze',
    label: '4. Analyze',
    icon: LineChart,
    title: 'Deep Reasoning & Data Diagnostics',
    description: 'Diagnose algorithms, profile SQL queries, uncover hidden regression patterns, and stress-test assumptions with verifiable steps.',
    points: [
      'Step-by-step chain of thought',
      'Asymptotic complexity evaluations (Big-O)',
      'Data modeling and schema verification',
    ],
    codeSnippet: `// Algorithmic optimization check
const audit = await aura.reasoning.audit({
  algorithm: "distributed_consensus_raft",
  safetyThreshold: 0.9999,
});`,
    language: 'typescript',
  },
  {
    id: 'build',
    label: '5. Build',
    icon: Code2,
    title: 'Full-Stack Developer Superpowers',
    description: 'Generate production-ready code with type safety, clean separation of concerns, modern design patterns, and zero hallucinatory imports.',
    points: [
      'TypeScript, Python, Rust, Go, SQL & CSS',
      'Unit test and integration scaffolding',
      'Inline syntax highlighting and copy utilities',
    ],
    codeSnippet: `// Scaffold scalable microservice
export function createRateLimiter(windowMs: number, max: number) {
  const hits = new Map<string, number[]>();
  return (ip: string): boolean => {
    const now = Date.now();
    const timestamps = (hits.get(ip) || []).filter(t => now - t < windowMs);
    if (timestamps.length >= max) return false;
    hits.set(ip, [...timestamps, now]);
    return true;
  };
}`,
    language: 'typescript',
  },
];

export const FeatureShowcase: React.FC<{ onLaunchApp?: () => void }> = ({ onLaunchApp }) => {
  const [activeTab, setActiveTab] = useState(0);
  const current = TABS[activeTab];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Cognitive Pipeline</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F5F7] tracking-tight">
          One intelligence.{' '}
          <span className="aura-text-gradient">Endless possibilities.</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#9A9AA3] leading-relaxed">
          Explore how AURA adapts smoothly across every phase of technical, creative, and strategic execution.
        </p>
      </div>

      {/* Tab Navigation Controls */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = idx === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                  : 'bg-[#15151B]/60 text-[#9A9AA3] border border-white/5 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-[#9A9AA3]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Showcase Card Container */}
      <div className="rounded-3xl bg-[#0E0E12] border border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-300">
        {/* Left: Content Details */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <span>Stage 0{activeTab + 1}</span>
              <span>/</span>
              <span>05</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {current.title}
            </h3>

            <p className="text-[#9A9AA3] leading-relaxed text-sm sm:text-base">
              {current.description}
            </p>

            <ul className="space-y-3 pt-2">
              {current.points.map((pt, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-[#F5F5F7]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 mt-8 border-t border-white/5 flex items-center gap-4">
            <button
              onClick={onLaunchApp}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#070709] hover:bg-neutral-200 text-sm font-semibold transition-all cursor-pointer shadow-md"
            >
              <span>Launch {current.label.split(' ')[1]} Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#9A9AA3]">Instant start • No waitlist</span>
          </div>
        </div>

        {/* Right: Interactive Code/Snippet Terminal */}
        <div className="lg:col-span-6 bg-[#070709] border-t lg:border-t-0 lg:border-l border-white/10 p-6 sm:p-8 flex flex-col justify-center">
          <div className="rounded-2xl bg-[#0E0E12] border border-white/5 overflow-hidden shadow-inner">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#15151B]/80 border-b border-white/5 text-xs text-[#9A9AA3] font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-white/70">aura_{current.id}.ts</span>
              </div>
              <span className="text-cyan-400">{current.language}</span>
            </div>
            <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-cyan-200/90 overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {current.codeSnippet}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
