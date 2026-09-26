import React, { useState } from 'react';
import { Sparkles, Cpu, Zap, Activity } from 'lucide-react';
import { AuraLogo } from '../common/AuraLogo';

interface AuraOrbProps {
  onStartChat?: () => void;
}

export const AuraOrb: React.FC<AuraOrbProps> = ({ onStartChat }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 15;
    const y = (e.clientY - rect.top - rect.height / 2) / 15;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center p-8 sm:p-12 select-none group"
    >
      {/* Outer Radial Glow */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-600/25 to-purple-600/20 blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-110" />

      {/* Dynamic 3D Transform Container */}
      <div
        className="relative z-10 flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg) scale(${
            isHovered ? 1.04 : 1
          })`,
        }}
      >
        {/* Orbital Resonance Rings */}
        <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-indigo-500/20 animate-[spin_20s_linear_infinite] pointer-events-none" />
        <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-cyan-400/15 animate-[spin_28s_linear_infinite_reverse] pointer-events-none" />

        {/* Central 3D Sculptural Emblem */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.01] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <AuraLogo size="hero" showText={false} animated={true} />
        </div>

        {/* Floating Holographic Telemetry Badges */}
        <div className="absolute -top-4 -right-2 sm:-right-8 px-3.5 py-1.5 rounded-full bg-[#0E0E12]/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2 shadow-lg backdrop-blur-md animate-bounce duration-1000">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>v3.8 Neural Stream</span>
        </div>

        <div className="absolute -bottom-3 -left-2 sm:-left-8 px-3.5 py-1.5 rounded-full bg-[#0E0E12]/90 border border-indigo-500/30 text-indigo-300 text-xs font-mono flex items-center gap-2 shadow-lg backdrop-blur-md">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>Latency: ~18ms</span>
        </div>
      </div>

      {/* Floating Status Indicator */}
      <div className="relative z-10 mt-8 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#15151B]/80 border border-white/10 text-xs text-[#9A9AA3] backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-medium text-[#F5F5F7]">AURA is online</span>
        <span className="text-[#9A9AA3]/60">•</span>
        <span className="text-cyan-400/90 font-mono">100% Operational</span>
      </div>
    </div>
  );
};
