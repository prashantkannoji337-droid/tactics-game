import React from 'react';
import { BackgroundStyle, Player, WinningState } from '../types';

interface BackgroundAmbianceProps {
  style: BackgroundStyle;
  currentTurn: Player;
  winningState: WinningState | null;
  darkMode: boolean;
}

export const BackgroundAmbiance: React.FC<BackgroundAmbianceProps> = ({
  style,
  currentTurn,
  winningState,
  darkMode,
}) => {
  // Determine dynamic central glow color based on game state
  const getGlowColor = () => {
    if (winningState) {
      if (winningState.winner === 'draw') return 'rgba(245, 158, 11, 0.15)'; // Amber
      return winningState.winner === 'X'
        ? 'rgba(99, 102, 241, 0.28)' // Indigo
        : 'rgba(244, 63, 94, 0.28)'; // Rose
    }
    return currentTurn === 'X'
      ? 'rgba(99, 102, 241, 0.18)'
      : 'rgba(244, 63, 94, 0.18)';
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Base Gradient Canvas per style */}
      {style === 'aurora' && (
        <div className="absolute inset-0 transition-colors duration-700 bg-slate-900 dark:bg-[#070913]">
          {/* Shimmering multi-layer aurora orbs */}
          <div
            className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full blur-[110px] animate-aurora opacity-70"
            style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, rgba(79, 70, 229, 0.1) 70%, transparent 100%)',
            }}
          />
          <div
            className="absolute top-[35%] -right-[15%] w-[50vw] h-[50vw] rounded-full blur-[120px] animate-float-slow opacity-60"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(139, 92, 246, 0.1) 65%, transparent 100%)',
            }}
          />
          <div
            className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[45vw] rounded-full blur-[130px] animate-float-reverse opacity-55"
            style={{
              background: 'radial-gradient(circle, rgba(20, 184, 166, 0.35) 0%, rgba(6, 182, 212, 0.1) 70%, transparent 100%)',
            }}
          />
          {/* Subtle celestial dust pattern */}
          <div
            className="absolute inset-0 opacity-[0.12] dark:opacity-[0.18]"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>
      )}

      {style === 'cyber' && (
        <div className="absolute inset-0 transition-colors duration-700 bg-[#080d1a] dark:bg-[#04060d]">
          {/* Neon Grid Overlay */}
          <div
            className="absolute inset-0 opacity-20 dark:opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(6, 182, 212, 0.25) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(6, 182, 212, 0.25) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
            }}
          />
          {/* Cyberpunk ambient rim lights */}
          <div
            className="absolute top-0 inset-x-0 h-96 blur-[120px] opacity-40"
            style={{
              background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.4) 0%, transparent 100%)',
            }}
          />
          <div
            className="absolute bottom-0 inset-x-0 h-96 blur-[130px] opacity-35"
            style={{
              background: 'linear-gradient(0deg, rgba(236, 72, 153, 0.35) 0%, transparent 100%)',
            }}
          />
        </div>
      )}

      {style === 'casino' && (
        <div className="absolute inset-0 transition-colors duration-700 bg-[#0c2419] dark:bg-[#06170f]">
          {/* Velvet felt texture mesh */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(52, 211, 153, 0.2) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />
          {/* Warm overhead table spotlight */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full blur-[140px] opacity-40"
            style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(5, 150, 105, 0.1) 70%, transparent 100%)',
            }}
          />
          {/* Subtle gold brass reflection on corners */}
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[90px] opacity-25"
            style={{ background: 'rgba(245, 158, 11, 0.35)' }}
          />
        </div>
      )}

      {style === 'minimal' && (
        <div className="absolute inset-0 transition-colors duration-700 bg-slate-100 dark:bg-slate-950">
          {/* Architectural micro-dot matrix */}
          <div
            className="absolute inset-0 opacity-[0.14] dark:opacity-[0.08]"
            style={{
              backgroundImage: `radial-gradient(circle, ${darkMode ? '#94A3B8' : '#64748B'} 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
          {/* Soft neutral vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: darkMode
                ? 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 0.9) 100%)'
                : 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.7) 0%, rgba(226, 232, 240, 0.8) 100%)',
            }}
          />
        </div>
      )}

      {/* 2. Floating Ambient Watermark Motifs (X and O icons drifting softly) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left drifting X */}
        <div className="absolute top-[8%] left-[6%] animate-float-slow opacity-[0.04] dark:opacity-[0.07]">
          <svg className="w-48 h-48 sm:w-64 sm:h-64 text-indigo-400" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <line x1="20" y1="20" x2="80" y2="80" strokeWidth="12" strokeLinecap="round" />
            <line x1="80" y1="20" x2="20" y2="80" strokeWidth="12" strokeLinecap="round" />
          </svg>
        </div>

        {/* Top-right drifting O */}
        <div className="absolute top-[12%] right-[8%] animate-float-reverse opacity-[0.04] dark:opacity-[0.07]">
          <svg className="w-52 h-52 sm:w-72 sm:h-72 text-rose-400" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <circle cx="50" cy="50" r="32" strokeWidth="12" strokeLinecap="round" />
          </svg>
        </div>

        {/* Bottom-left drifting O */}
        <div className="absolute bottom-[10%] left-[8%] animate-float-reverse opacity-[0.035] dark:opacity-[0.06]">
          <svg className="w-44 h-44 sm:w-60 sm:h-60 text-indigo-400" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <circle cx="50" cy="50" r="30" strokeWidth="10" strokeLinecap="round" />
          </svg>
        </div>

        {/* Bottom-right drifting X */}
        <div className="absolute bottom-[6%] right-[6%] animate-float-slow opacity-[0.04] dark:opacity-[0.07]">
          <svg className="w-48 h-48 sm:w-64 sm:h-64 text-rose-400" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <line x1="22" y1="22" x2="78" y2="78" strokeWidth="12" strokeLinecap="round" />
            <line x1="78" y1="22" x2="22" y2="78" strokeWidth="12" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 3. Central Reactive Backlight Glow (Glows behind the game board) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full blur-[80px] sm:blur-[100px] transition-all duration-500 ease-out"
        style={{
          background: getGlowColor(),
        }}
      />
    </div>
  );
};
