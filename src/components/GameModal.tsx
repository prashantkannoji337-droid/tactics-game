import React, { useEffect, useRef } from 'react';
import { GameMode, Player, SymbolTheme, WinningState } from '../types';
import { fireConfetti } from '../utils/confetti';
import { SymbolIcon } from './SymbolIcon';
import { Trophy, RefreshCw, Eye } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface GameModalProps {
  winningState: WinningState | null;
  playerXName: string;
  playerOName: string;
  gameMode: GameMode;
  theme: SymbolTheme;
  isOpen: boolean;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({
  winningState,
  playerXName,
  playerOName,
  theme,
  isOpen,
  onPlayAgain,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && winningState && winningState.winner !== 'draw') {
      const cleanup = fireConfetti(canvasRef.current);
      return () => {
        cleanup?.();
      };
    }
  }, [isOpen, winningState]);

  if (!isOpen || !winningState) return null;

  const isDraw = winningState.winner === 'draw';
  const winnerName = winningState.winner === 'X' ? playerXName : playerOName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      <div className="relative z-20 w-full max-w-sm p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-5 animate-scaleUp">
        {/* Header Icon */}
        <div className="flex justify-center">
          {isDraw ? (
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <span className="text-2xl font-black">½ - ½</span>
            </div>
          ) : (
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="absolute -bottom-2 -right-2 p-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                <SymbolIcon
                  player={winningState.winner as Player}
                  theme={theme}
                  className="w-5 h-5"
                />
              </div>
            </div>
          )}
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {isDraw ? 'Hard-Fought Draw!' : `${winnerName} Wins!`}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isDraw
              ? 'Both players matched each other step for step.'
              : `Masterful placement sealed the victory.`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => {
              soundFX.playClick();
              onPlayAgain();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Play Next Round</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Final Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};
