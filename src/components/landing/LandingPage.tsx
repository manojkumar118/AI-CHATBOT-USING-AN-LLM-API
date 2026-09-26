import React from 'react';
import { Navbar } from './Navbar';
import { CosmicParticleCanvas } from './CosmicParticleCanvas';
import { AuraOrb } from './AuraOrb';
import { HeroChatPreview } from './HeroChatPreview';
import { FeaturesSection } from './FeaturesSection';
import { FeatureShowcase } from './FeatureShowcase';
import { Footer } from './Footer';
import { ArrowRight, Sparkles, Shield, Cpu, Zap, Lock, Database } from 'lucide-react';

interface LandingPageProps {
  onStartChat: () => void;
  onOpenSecurity: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartChat,
  onOpenSecurity,
  theme,
  onToggleTheme,
}) => {
  const scrollToExplore = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#070709] text-[#F5F5F7] overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* Background Interactive Particle Nebula */}
      <CosmicParticleCanvas intensity="vibrant" />

      {/* Navigation Bar */}
      <Navbar
        onStartChat={onStartChat}
        onOpenSecurity={onOpenSecurity}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-[#F5F5F7] backdrop-blur-md mb-8 hover:border-indigo-500/40 transition-colors shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-medium">Introducing AURA AI v3.8</span>
          <span className="text-[#9A9AA3]">•</span>
          <span className="text-cyan-400 font-mono text-xs">Real-Time LLM Streaming</span>
        </div>

        {/* Main Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight max-w-5xl leading-[1.08]">
          Intelligence that{' '}
          <span className="aura-text-gradient">moves with you.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-6 text-lg sm:text-xl text-[#9A9AA3] max-w-2xl leading-relaxed font-normal">
          Meet <span className="text-white font-medium">AURA AI</span> — a next-generation conversational intelligence platform designed to help you think, create, learn, and build faster.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onStartChat}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Chatting</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={scrollToExplore}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#15151B]/80 hover:bg-[#15151B] border border-white/10 hover:border-white/20 text-[#F5F5F7] font-semibold text-base transition-all backdrop-blur-md cursor-pointer"
          >
            <span>Explore AURA</span>
          </button>
        </div>

        {/* Central 3D Sculptural Visualizer */}
        <div className="mt-12 w-full max-w-3xl">
          <AuraOrb onStartChat={onStartChat} />
        </div>

        {/* Interactive Live Chat Preview */}
        <div id="experience" className="mt-16 w-full max-w-4xl">
          <div className="mb-4 text-xs font-mono uppercase tracking-widest text-[#9A9AA3]">
            Interactive Real-Time Terminal
          </div>
          <HeroChatPreview onLaunchApp={onStartChat} />
        </div>
      </section>

      {/* Features Grid Section */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* 5-Stage Interactive Cognitive Pipeline */}
      <div id="intelligence">
        <FeatureShowcase onLaunchApp={onStartChat} />
      </div>

      {/* Security & Architecture Deep Dive */}
      <section id="architecture" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="rounded-3xl bg-gradient-to-b from-[#0E0E12] to-[#070709] border border-white/10 p-8 sm:p-14 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero Client-Key Exposure Architecture</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Enterprise security meets consumer elegance.
              </h3>

              <p className="text-[#9A9AA3] text-base leading-relaxed">
                Unlike generic browser-based chat wrappers that leak API keys into client network tabs, AURA routes every conversation through an isolated server-side proxy with strict payload verification and rate protection.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span>Server-Side Isolation</span>
                  </div>
                  <p className="text-xs text-[#9A9AA3]">
                    Your LLM credentials stay securely protected in the backend environment.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <span>Isolated Conversations</span>
                  </div>
                  <p className="text-xs text-[#9A9AA3]">
                    Zero cross-talk between user sessions with client-encrypted persistence.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenSecurity}
                  className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Read our Security & Privacy Architecture</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-[#070709] border border-white/10 p-6 space-y-4 font-mono text-xs text-[#9A9AA3]">
                <div className="flex items-center justify-between pb-3 border-b border-white/5 text-white/90">
                  <span>Data Flow Architecture</span>
                  <span className="text-emerald-400">ENCRYPTED</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-white/5 flex items-center justify-between text-white">
                    <span>1. Client Browser</span>
                    <span className="text-[10px] text-cyan-400">TLS 1.3</span>
                  </div>
                  <div className="text-center text-indigo-400 text-sm">↓ POST /api/chat</div>
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-between">
                    <span>2. AURA Server Gateway</span>
                    <span className="text-[10px] text-emerald-400">Validated</span>
                  </div>
                  <div className="text-center text-indigo-400 text-sm">↓ Stream SSE</div>
                  <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center justify-between">
                    <span>3. Gemini 3.8 Engine</span>
                    <span className="text-[10px] text-cyan-400">Sub-30ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onStartChat={onStartChat} onOpenSecurity={onOpenSecurity} />
    </div>
  );
};
