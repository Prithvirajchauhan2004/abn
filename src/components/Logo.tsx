import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'light',
}) => {
  // Dimensions for SVG icon
  const iconDimensions = {
    sm: 'w-9 h-6',
    md: 'w-12 h-8',
    lg: 'w-16 h-11',
    xl: 'w-24 h-16',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* SVG rendering of the dual magenta-crimson oval swoosh logo */}
      <svg
        className={`${iconDimensions[size]} shrink-0 drop-shadow-sm`}
        viewBox="0 0 300 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Magenta / Pink Gradient */}
          <linearGradient id="abnPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="50%" stopColor="#E60067" />
            <stop offset="100%" stopColor="#C2185B" />
          </linearGradient>

          {/* Crimson Red Gradient */}
          <linearGradient id="abnRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          {/* Copper Metallic Text Gradient */}
          <linearGradient id="abnCopperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="40%" stopColor="#B45309" />
            <stop offset="80%" stopColor="#881337" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>
        </defs>

        {/* Outer White Glow Background Frame */}
        <ellipse cx="150" cy="100" rx="145" ry="92" fill="#FFFFFF" />

        {/* Left Magenta Crescent Swoosh */}
        <path
          d="M 140 12 C 70 12, 10 50, 10 100 C 10 150, 70 188, 140 188 C 175 188, 180 182, 160 178 C 100 166, 40 138, 40 100 C 40 62, 100 34, 160 22 C 180 18, 175 12, 140 12 Z"
          fill="url(#abnPinkGrad)"
        />

        {/* Right Crimson Red Crescent Swoosh */}
        <path
          d="M 160 188 C 230 188, 290 150, 290 100 C 290 50, 230 12, 160 12 C 125 12, 120 18, 140 22 C 200 34, 260 62, 260 100 C 260 138, 200 166, 140 178 C 120 182, 125 188, 160 188 Z"
          fill="url(#abnRedGrad)"
        />

        {/* Center Metallic Copper "ABN" Text */}
        <text
          x="150"
          y="118"
          textAnchor="middle"
          fill="url(#abnCopperGrad)"
          fontFamily="Times New Roman, Georgia, serif"
          fontWeight="bold"
          fontSize="72"
          letterSpacing="4"
        >
          ABN
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`${textSizes[size]} font-bold tracking-tight font-serif ${
                variant === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              ABN THERMOCARE
            </span>
            <span className="text-[10px] uppercase tracking-wider bg-rose-600 text-white font-extrabold px-1.5 py-0.5 rounded">
              SYSTEM
            </span>
          </div>
          <span className="text-[10px] text-rose-700 font-semibold tracking-wider uppercase mt-0.5">
            Thermal • Insulation • Utility Projects
          </span>
        </div>
      )}
    </div>
  );
};
