import React, { useState } from 'react';
import { GameVariant, MoveRecord, SymbolTheme } from '../types';
import { SymbolIcon } from './SymbolIcon';
import { ChevronLeft, ChevronRight, X, RotateCcw } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface MoveHistoryModalProps {
  moves: MoveRecord[];
  variant: GameVariant;
  theme: SymbolTheme;
  playerXName: string;
  playerOName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const MoveHistoryModal: React.FC<MoveHistoryModalProps> = ({
  moves,
  variant,
  theme,
  playerXName,
  playerOName,
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(moves.length > 0 ? moves.length - 1 : 0);

  if (!isOpen || moves.length === 0) return null;

  const currentMove = moves[currentStep] || moves[moves.length - 1];
  const boardAtStep = currentMove.boardState;
  const is4x4 = variant === 'grid4';
  const gridSize = is4x4 ? 4 : 3;

  const handlePrev = () => {
    if (currentStep > 0) {
      soundFX.playClick();
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < moves.length - 1) {
      soundFX.playClick();
      setCurrentStep(currentStep + 1);
    }
  };

  const handleResetToStart = () => {
    soundFX.playClick();
    setCurrentStep(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative z-20 w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Move-by-Move Replay
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Step {currentStep + 1} of {moves.length}
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

        {/* Step description */}
        <div className="text-center text-xs font-semibold py-1 px-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
          {currentMove.player === 'X' ? playerXName : playerOName} played{' '}
          <span className="font-bold">{currentMove.player}</span> at Row{' '}
          {Math.floor(currentMove.index / gridSize) + 1}, Col{' '}
          {(currentMove.index % gridSize) + 1}
          {currentMove.fadedIndex !== undefined && currentMove.fadedIndex !== null && (
            <span className="text-rose-500 ml-1 font-normal">
              (Oldest token at position {currentMove.fadedIndex + 1} vanished)
            </span>
          )}
        </div>

        {/* Mini Preview Board */}
        <div className="w-64 h-64 mx-auto p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div
            className={`grid ${
              is4x4 ? 'grid-cols-4 grid-rows-4 gap-1.5' : 'grid-cols-3 grid-rows-3 gap-2'
            } w-full h-full`}
          >
            {boardAtStep.map((cell, idx) => {
              const isLatestMove = idx === currentMove.index;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-center rounded-xl border transition-all ${
                    isLatestMove
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-400/50'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  {cell && (
                    <SymbolIcon
                      player={cell}
                      theme={theme}
                      className="w-3/5 h-3/5 object-contain"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handleResetToStart}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
            title="Start from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                currentStep > 0
                  ? 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'opacity-40 cursor-not-allowed border-transparent text-slate-400'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === moves.length - 1}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                currentStep < moves.length - 1
                  ? 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'opacity-40 cursor-not-allowed border-transparent text-slate-400'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
