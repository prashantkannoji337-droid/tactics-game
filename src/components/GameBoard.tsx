import React from 'react';
import { CellValue, GameVariant, Player, SymbolTheme, WinningState } from '../types';
import { SymbolIcon } from './SymbolIcon';

interface GameBoardProps {
  board: CellValue[];
  variant: GameVariant;
  currentTurn: Player;
  winningState: WinningState | null;
  theme: SymbolTheme;
  isAiThinking: boolean;
  onCellClick: (index: number) => void;
  xQueue: number[];
  oQueue: number[];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  variant,
  currentTurn,
  winningState,
  theme,
  isAiThinking,
  onCellClick,
  xQueue,
  oQueue,
}) => {
  const is4x4 = variant === 'grid4';
  const gridSize = is4x4 ? 4 : 3;

  // In infinite mode, check if a cell is the oldest for X or O
  const oldestXIndex = variant === 'infinite' && xQueue.length >= 3 ? xQueue[0] : null;
  const oldestOIndex = variant === 'infinite' && oQueue.length >= 3 ? oQueue[0] : null;

  // Determine if a cell is on the winning line
  const isCellWinning = (index: number) => {
    return winningState?.winningLine?.includes(index) ?? false;
  };

  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto p-3 sm:p-4 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all z-10">
      {/* Board Grid */}
      <div
        className={`grid ${
          is4x4 ? 'grid-cols-4 grid-rows-4 gap-2.5' : 'grid-cols-3 grid-rows-3 gap-3'
        } w-full h-full`}
        role="grid"
        aria-label="Tic Tac Toe board"
      >
        {board.map((cellValue, index) => {
          const isWinning = isCellWinning(index);
          const isOldestX = index === oldestXIndex;
          const isOldestO = index === oldestOIndex;
          const isFading = (isOldestX && currentTurn === 'X') || (isOldestO && currentTurn === 'O');

          const row = Math.floor(index / gridSize) + 1;
          const col = (index % gridSize) + 1;

          return (
            <button
              key={index}
              onClick={() => onCellClick(index)}
              disabled={cellValue !== null || !!winningState || isAiThinking}
              role="gridcell"
              aria-label={`Row ${row}, Column ${col}, ${cellValue ? `Marked with ${cellValue}` : 'Empty'}`}
              className={`group relative flex items-center justify-center rounded-2xl font-semibold transition-all duration-150 select-none
                ${
                  cellValue === null && !winningState && !isAiThinking
                    ? 'cursor-pointer hover:bg-white dark:hover:bg-slate-800 active:scale-95 bg-white/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/70 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xs'
                    : 'cursor-default bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 shadow-xs'
                }
                ${
                  isWinning
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-500 shadow-[0_0_24px_rgba(245,158,11,0.4)] scale-[1.02] z-10'
                    : ''
                }

                ${
                  isFading
                    ? 'ring-2 ring-rose-400/60 dark:ring-rose-500/60'
                    : ''
                }
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
              `}
            >
              {/* Placed Symbol */}
              {cellValue && (
                <div className="w-3/5 h-3/5 flex items-center justify-center animate-pop-in">
                  <SymbolIcon
                    player={cellValue}
                    theme={theme}
                    isWinning={isWinning}
                    isFading={isFading}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Ghost preview on hover during player's turn */}
              {!cellValue && !winningState && !isAiThinking && (
                <div className="hidden group-hover:flex w-2/5 h-2/5 items-center justify-center opacity-25 pointer-events-none transition-opacity">
                  <SymbolIcon
                    player={currentTurn}
                    theme={theme}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Infinite mode badge warning for expiring piece */}
              {variant === 'infinite' && cellValue && (isOldestX || isOldestO) && (
                <span
                  className={`absolute top-1.5 right-1.5 text-[9px] font-mono px-1 py-0.5 rounded ${
                    isFading
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300 animate-pulse font-bold'
                      : 'bg-slate-200/80 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                  title="This token will disappear on the next move"
                >
                  1st
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Animated Strike-through Line for 3x3 */}
      {winningState && winningState.winner !== 'draw' && winningState.winningLine && !is4x4 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none p-3 sm:p-4 z-20"
          viewBox="0 0 300 300"
          fill="none"
        >
          {/* Coordinates calculation for 3x3 */}
          {(() => {
            const line = winningState.winningLine!;
            // Calculate center points of first and last cell
            const startCol = line[0] % 3;
            const startRow = Math.floor(line[0] / 3);
            const endCol = line[2] % 3;
            const endRow = Math.floor(line[2] / 3);

            const x1 = 50 + startCol * 100;
            const y1 = 50 + startRow * 100;
            const x2 = 50 + endCol * 100;
            const y2 = 50 + endRow * 100;

            // Extend the line slightly past the centers for full strike effect
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const pad = 24;
            const sx1 = x1 - (dx / len) * pad;
            const sy1 = y1 - (dy / len) * pad;
            const sx2 = x2 + (dx / len) * pad;
            const sy2 = y2 + (dy / len) * pad;

            return (
              <g>
                {/* Glow filter line */}
                <line
                  x1={sx1}
                  y1={sy1}
                  x2={sx2}
                  y2={sy2}
                  stroke={winningState.winner === 'X' ? '#6366F1' : '#F43F5E'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  className="opacity-40 blur-xs"
                />
                {/* Sharp main line */}
                <line
                  x1={sx1}
                  y1={sy1}
                  x2={sx2}
                  y2={sy2}
                  stroke={winningState.winner === 'X' ? '#4F46E5' : '#E11D48'}
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </g>
            );
          })()}
        </svg>
      )}

      {/* Dynamic Strike-through Line for 4x4 */}
      {winningState && winningState.winner !== 'draw' && winningState.winningLine && is4x4 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none p-3 sm:p-4 z-20"
          viewBox="0 0 400 400"
          fill="none"
        >
          {(() => {
            const line = winningState.winningLine!;
            const startCol = line[0] % 4;
            const startRow = Math.floor(line[0] / 4);
            const endCol = line[3] % 4;
            const endRow = Math.floor(line[3] / 4);

            const x1 = 50 + startCol * 100;
            const y1 = 50 + startRow * 100;
            const x2 = 50 + endCol * 100;
            const y2 = 50 + endRow * 100;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const pad = 24;
            const sx1 = x1 - (dx / len) * pad;
            const sy1 = y1 - (dy / len) * pad;
            const sx2 = x2 + (dx / len) * pad;
            const sy2 = y2 + (dy / len) * pad;

            return (
              <g>
                <line
                  x1={sx1}
                  y1={sy1}
                  x2={sx2}
                  y2={sy2}
                  stroke={winningState.winner === 'X' ? '#6366F1' : '#F43F5E'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="opacity-40 blur-xs"
                />
                <line
                  x1={sx1}
                  y1={sy1}
                  x2={sx2}
                  y2={sy2}
                  stroke={winningState.winner === 'X' ? '#4F46E5' : '#E11D48'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>
            );
          })()}
        </svg>
      )}
    </div>
  );
};
