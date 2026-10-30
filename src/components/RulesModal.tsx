import React from 'react';
import { X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative z-20 w-full max-w-lg p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Rules & Game Modes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Everything you need to master each variant
            </p>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Classic */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              <span>Classic 3x3</span>
            </div>
            <p>
              The eternal duel. Two players alternate turns placing their marks. The first to connect three in any row, column, or diagonal claims victory. If all 9 squares are filled without three-in-a-row, it ends in a tie.
            </p>
          </div>

          {/* Infinite Mode */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950 dark:text-indigo-200 text-sm">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Infinite Mode (Disappearing 3-Tokens)</span>
            </div>
            <p className="text-slate-700 dark:text-indigo-100">
              Never get stuck in a boring draw! Each player has a maximum of <strong className="font-semibold">3 active tokens</strong> on the board at any time. When placing your 4th token, your oldest (1st) token fades out and disappears!
            </p>
            <p className="text-slate-500 dark:text-indigo-300 text-[11px]">
              Tip: Keep an eye on the &quot;1st&quot; badge indicating which token is scheduled to vanish on your upcoming turn.
            </p>
          </div>

          {/* 4x4 Grid */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              <span>4x4 Grid Challenge</span>
            </div>
            <p>
              A 16-cell board where players must align <strong className="font-semibold">4 tokens</strong> in a row. Demands longer tactical foresight and deeper positional control.
            </p>
          </div>

          {/* AI Difficulty */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-200 text-sm">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>AI Opponent Personalities</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-amber-100">
              <li><strong>Easy AI:</strong> Relaxed, casual play with playful oversights.</li>
              <li><strong>Medium AI:</strong> Tactical bot that seizes quick wins and attempts blocks.</li>
              <li><strong>Master AI:</strong> Mathematically infallible Minimax algorithm with full search tree. It cannot be defeated in classic 3x3 — your challenge is to force a draw!</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            Got it, Let&apos;s Play!
          </button>
        </div>
      </div>
    </div>
  );
};
