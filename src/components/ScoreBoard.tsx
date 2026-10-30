import React from 'react';
import { GameMode, GameStats, GameVariant, Player, SymbolTheme } from '../types';
import { SymbolIcon } from './SymbolIcon';
import { Bot, User, Flame } from 'lucide-react';

interface ScoreBoardProps {
  stats: GameStats;
  currentTurn: Player;
  gameMode: GameMode;
  variant: GameVariant;
  theme: SymbolTheme;
  isAiThinking: boolean;
  playerXName: string;
  playerOName: string;
  xTokensCount: number;
  oTokensCount: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  stats,
  currentTurn,
  gameMode,
  variant,
  theme,
  isAiThinking,
  playerXName,
  playerOName,
  xTokensCount,
  oTokensCount,
}) => {
  const isXTurn = currentTurn === 'X';
  const isOTurn = currentTurn === 'O';
  const isAgainstAi = gameMode !== 'pvp';

  return (
    <div className="w-full max-w-[540px] mx-auto space-y-3">
      {/* Turn Banner with Humanized Status */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border border-white/50 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isXTurn
                ? 'bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.6)]'
                : 'bg-rose-500 dark:bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
            }`}
          />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {isAiThinking
              ? `${playerOName} is calculating...`
              : isXTurn
              ? `${playerXName}'s Turn`
              : `${playerOName}'s Turn`}
          </span>
        </div>

        {/* Current Round & Streak Indicator */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          {stats.streak.count >= 2 && stats.streak.player && (
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>{stats.streak.count} Streak ({stats.streak.player})</span>
            </div>
          )}
          <span>Round {stats.totalGames + 1}</span>
        </div>
      </div>

      {/* Players vs Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 items-stretch">
        {/* Player X Card */}
        <div
          className={`flex flex-col items-center justify-between p-3 rounded-2xl backdrop-blur-md transition-all duration-200 ${
            isXTurn
              ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-2 border-indigo-500/80 dark:border-indigo-400/80 shadow-md scale-[1.02]'
              : 'bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 opacity-85'
          }`}
        >
          <div className="flex items-center gap-1.5 w-full justify-center">
            <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[80px]">
              {playerXName}
            </span>
          </div>

          <div className="my-1.5 flex items-center justify-center">
            <SymbolIcon player="X" theme={theme} className="w-7 h-7" />
          </div>

          <div className="text-center w-full">
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
              {stats.xWins}
            </div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {variant === 'infinite' ? `Tokens ${xTokensCount}/3` : 'Wins'}
            </div>
          </div>
        </div>

        {/* Ties & Total Count Card */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Ties
          </span>
          <div className="text-xl font-extrabold text-slate-700 dark:text-slate-300 font-mono-numbers my-1">
            {stats.draws}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            {stats.totalGames} played
          </span>
        </div>

        {/* Player O / AI Card */}
        <div
          className={`flex flex-col items-center justify-between p-3 rounded-2xl backdrop-blur-md transition-all duration-200 ${
            isOTurn
              ? 'bg-rose-50/90 dark:bg-rose-950/60 border-2 border-rose-500/80 dark:border-rose-400/80 shadow-md scale-[1.02]'
              : 'bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 opacity-85'
          }`}
        >
          <div className="flex items-center gap-1.5 w-full justify-center">
            {isAgainstAi ? (
              <Bot className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            ) : (
              <User className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            )}
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[80px]">
              {playerOName}
            </span>
          </div>

          <div className="my-1.5 flex items-center justify-center">
            <SymbolIcon player="O" theme={theme} className="w-7 h-7" />
          </div>

          <div className="text-center w-full">
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
              {stats.oWins}
            </div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {variant === 'infinite' ? `Tokens ${oTokensCount}/3` : 'Wins'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


