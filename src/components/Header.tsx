import React from 'react';
import { Moon, Sun, RotateCcw } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenRules: () => void;
  onResetStats: () => void;
  onSelectInfinite: () => void;
  onSelectClassic: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  onOpenRules,
  onResetStats,
  onSelectInfinite,
  onSelectClassic,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md">
      {/* Zone 1: Brand wordmark (single line text element) */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectClassic();
        }}
        className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
      >
        <span className="text-indigo-600 dark:text-indigo-400">Tic Tac Toe</span> Tactics
      </a>

      {/* Zone 2: 4 clean single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
        <button
          onClick={onSelectClassic}
          className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Classic
        </button>
        <button
          onClick={onSelectInfinite}
          className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Infinite Mode
        </button>
        <button
          onClick={onOpenRules}
          className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Game Rules
        </button>
        <button
          onClick={onResetStats}
          className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer text-xs"
        >
          Reset Scores
        </button>
      </nav>

      {/* Zone 3: 1 primary action / theme control */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => {
            soundFX.playClick();
            onToggleTheme();
          }}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
      </div>
    </header>
  );
};
