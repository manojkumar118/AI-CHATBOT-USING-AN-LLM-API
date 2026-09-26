import React from 'react';

interface AuraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'icon';
  animated?: boolean;
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AuraLogo: React.FC<AuraLogoProps> = ({
  size = 'md',
  animated = true,
  showText = true,
  showTagline = false,
  className = '',
  onClick,
}) => {
  // Dimensions mapping
  const iconSizes = {
    icon: 24,
    sm: 28,
    md: 36,
    lg: 48,
    xl: 64,
    hero: 120,
  };

  const dim = iconSizes[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''} ${className}`}
    >
      {/* 3D Glassmorphic Emblem */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: dim, height: dim }}
      >
        {/* Ambient Back Glow */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/25 via-indigo-600/30 to-purple-600/25 blur-xl pointer-events-none ${
            animated ? 'animate-pulse' : ''
          }`}
        />

        <svg
          viewBox="0 0 120 120"
          className="w-full h-full relative z-10 drop-shadow-[0_4px_16px_rgba(99,102,241,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Primary Aura Gradient */}
            <linearGradient id="auraGlyphGrad" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="45%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>

            {/* Inner Sheen Gradient */}
            <linearGradient id="auraSheenGrad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#818CF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
            </linearGradient>

            {/* Orbit Ring Gradient */}
            <linearGradient id="auraOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="1" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.8" />
            </linearGradient>

            {/* Filter for glowing satellite */}
            <filter id="satelliteGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Orbit Ring Arc (Behind the letter A) */}
          <ellipse
            cx="60"
            cy="62"
            rx="46"
            ry="16"
            stroke="url(#auraOrbitGrad)"
            strokeWidth="3.2"
            strokeDasharray="140 160"
            strokeDashoffset="12"
            fill="none"
            transform="rotate(-24 60 62)"
            opacity="0.65"
          />

          {/* Left Wing of 'A' with 3D Depth */}
          <path
            d="M 60 22 C 54 22 40 46 32 76 C 29 88 34 94 42 94 C 47 94 52 86 56 78 L 60 68 Z"
            fill="url(#auraGlyphGrad)"
            opacity="0.95"
          />

          {/* Right Wing of 'A' wrapping over */}
          <path
            d="M 60 22 C 66 22 78 44 86 70 C 91 85 86 94 78 94 C 72 94 67 86 64 78 L 60 68 Z"
            fill="url(#auraGlyphGrad)"
            opacity="0.95"
          />

          {/* Center Smooth Apex Arch */}
          <path
            d="M 44 68 C 52 58 68 58 76 68 C 68 76 52 76 44 68 Z"
            fill="url(#auraGlyphGrad)"
            opacity="0.85"
          />

          {/* Specular 3D Highlight Curvature */}
          <path
            d="M 58 24 C 54 36 44 58 38 78 C 42 74 54 44 58 24 Z"
            fill="url(#auraSheenGrad)"
          />

          {/* Foreground Orbit Ring Arc (Crossing in front of the letter A) */}
          <ellipse
            cx="60"
            cy="62"
            rx="46"
            ry="16"
            stroke="url(#auraOrbitGrad)"
            strokeWidth="3.4"
            strokeDasharray="130 160"
            strokeDashoffset="155"
            fill="none"
            transform="rotate(-24 60 62)"
            opacity="0.95"
          />

          {/* Orbiting Satellite Particle with Glow */}
          <g transform="rotate(-24 60 62)">
            <circle
              cx="98"
              cy="58"
              r="5.5"
              fill="#E0F2FE"
              filter="url(#satelliteGlow)"
            />
            <circle
              cx="98"
              cy="58"
              r="3.5"
              fill="#38BDF8"
            />
          </g>
        </svg>
      </div>

      {/* Typography: AURA AI */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-bold tracking-wider leading-none">
            <span
              className={`text-[#F5F5F7] tracking-[0.16em] uppercase ${
                size === 'sm' ? 'text-base font-extrabold' : size === 'lg' ? 'text-2xl font-black' : size === 'hero' ? 'text-4xl sm:text-5xl font-black' : 'text-lg font-black'
              }`}
            >
              AURA
            </span>
            <span
              className={`aura-text-gradient font-black tracking-widest ${
                size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : size === 'hero' ? 'text-4xl sm:text-5xl' : 'text-lg'
              }`}
            >
              AI
            </span>
          </div>
          {showTagline && (
            <span className="text-[11px] sm:text-xs text-[#9A9AA3] font-normal tracking-wide mt-1">
              Intelligence that moves with you.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
