import React from 'react';
import { Player, SymbolTheme } from '../types';

interface SymbolIconProps {
  player: Player;
  theme?: SymbolTheme;
  className?: string;
  isWinning?: boolean;
  isFading?: boolean; // For Infinite mode: warning that this piece will vanish next!
}

export const SymbolIcon: React.FC<SymbolIconProps> = ({
  player,
  theme = 'classic',
  className = 'w-12 h-12',
  isWinning = false,
  isFading = false,
}) => {
  const fadingClass = isFading ? 'opacity-40 animate-pulse' : 'opacity-100';

  if (theme === 'neon') {
    if (player === 'X') {
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${className} ${fadingClass} transition-all duration-200 ${
            isWinning ? 'drop-shadow-[0_0_16px_rgba(6,182,212,0.95)] scale-110' : 'drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]'
          }`}
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M20 20 L80 80 M80 20 L20 80"
            stroke="#06B6D4"
            strokeWidth="14"
            strokeLinecap="round"
          />
        </svg>
      );
    }
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${className} ${fadingClass} transition-all duration-200 ${
          isWinning ? 'drop-shadow-[0_0_16px_rgba(245,158,11,0.95)] scale-110' : 'drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]'
        }`}
        fill="none"
        stroke="currentColor"
      >
        <circle
          cx="50"
          cy="50"
          r="32"
          stroke="#F59E0B"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (theme === 'celestial') {
    if (player === 'X') {
      // Golden Sunburst
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${className} ${fadingClass} transition-all duration-200 ${
            isWinning ? 'drop-shadow-[0_0_18px_rgba(234,179,8,0.9)] scale-110' : ''
          }`}
          fill="none"
        >
          <circle cx="50" cy="50" r="22" fill="#EAB308" />
          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="50"
              y1="16"
              x2="50"
              y2="8"
              stroke="#FACC15"
              strokeWidth="6"
              strokeLinecap="round"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </svg>
      );
    }
    // Silver Crescent Moon
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${className} ${fadingClass} transition-all duration-200 ${
          isWinning ? 'drop-shadow-[0_0_18px_rgba(168,85,247,0.9)] scale-110' : ''
        }`}
        fill="none"
      >
        <path
          d="M65 20 A 35 35 0 1 0 80 75 A 32 32 0 1 1 65 20 Z"
          fill="#A855F7"
        />
      </svg>
    );
  }

  if (theme === 'cyber') {
    if (player === 'X') {
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${className} ${fadingClass} transition-all duration-200 ${
            isWinning ? 'scale-110' : ''
          }`}
          fill="none"
        >
          <path
            d="M20 20 L35 20 L80 65 L80 80 L65 80 L20 35 Z"
            fill="#3B82F6"
          />
          <path
            d="M80 20 L65 20 L20 65 L20 80 L35 80 L80 35 Z"
            fill="#3B82F6"
          />
        </svg>
      );
    }
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${className} ${fadingClass} transition-all duration-200 ${
          isWinning ? 'scale-110' : ''
        }`}
        fill="none"
      >
        <polygon
          points="50,15 80,32 80,68 50,85 20,68 20,32"
          stroke="#10B981"
          strokeWidth="12"
          fill="none"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Classic Clean Geometric Theme
  if (player === 'X') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${className} ${fadingClass} text-indigo-600 dark:text-indigo-400 transition-all duration-200 ${
          isWinning ? 'scale-110 filter drop-shadow(0 4px 12px rgba(79, 70, 229, 0.5))' : ''
        }`}
        fill="none"
        stroke="currentColor"
      >
        <line
          x1="22"
          y1="22"
          x2="78"
          y2="78"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <line
          x1="78"
          y1="22"
          x2="22"
          y2="78"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} ${fadingClass} text-rose-500 dark:text-rose-400 transition-all duration-200 ${
        isWinning ? 'scale-110 filter drop-shadow(0 4px 12px rgba(244, 63, 94, 0.5))' : ''
      }`}
      fill="none"
      stroke="currentColor"
    >
      <circle
        cx="50"
        cy="50"
        r="28"
        strokeWidth="14"
        strokeLinecap="round"
      />
    </svg>
  );
};
