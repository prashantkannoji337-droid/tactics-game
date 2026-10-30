import React from 'react';
import { AiSpeed, BackgroundStyle, GameMode, GameVariant, SymbolTheme } from '../types';
import { RotateCcw, Volume2, VolumeX, Sparkles, HelpCircle, History, Zap, Palette } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface GameControlsProps {
  gameMode: GameMode;
  variant: GameVariant;
  symbolTheme: SymbolTheme;
  bgStyle: BackgroundStyle;
  aiSpeed: AiSpeed;
  soundEnabled: boolean;
  hasMoves: boolean;
  onSelectMode: (mode: GameMode) => void;
  onSelectVariant: (variant: GameVariant) => void;
  onSelectTheme: (theme: SymbolTheme) => void;
  onSelectBgStyle: (style: BackgroundStyle) => void;
  onSelectAiSpeed: (speed: AiSpeed) => void;
  onToggleSound: () => void;
  onNewRound: () => void;
  onOpenRules: () => void;
  onOpenHistory: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  variant,
  symbolTheme,
  bgStyle,
  aiSpeed,
  soundEnabled,
  hasMoves,
  onSelectMode,
  onSelectVariant,
  onSelectTheme,
  onSelectBgStyle,
  onSelectAiSpeed,
  onToggleSound,
  onNewRound,
  onOpenRules,
  onOpenHistory,
}) => {
  return (
    <div className="w-full max-w-[540px] mx-auto space-y-4">
      {/* Primary Mode Selector */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Opponent
          </span>
          <div className="flex items-center gap-3">
            {gameMode !== 'pvp' && (
              <div className="flex items-center gap-1.5 bg-slate-200/50 dark:bg-slate-800/50 p-0.5 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 pl-1.5 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                  Speed:
                </span>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onSelectAiSpeed('instant');
                  }}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    aiSpeed === 'instant'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Instant AI move without delay"
                >
                  Instant ⚡
                </button>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onSelectAiSpeed('fast');
                  }}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    aiSpeed === 'fast'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Fast AI move (~60ms)"
                >
                  Fast
                </button>
              </div>
            )}
            <button
              onClick={onOpenRules}
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How to play</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl gap-1">
          <button
            onClick={() => {
              soundFX.playClick();
              onSelectMode('pvp');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              gameMode === 'pvp'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            2 Players
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              onSelectMode('ai-easy');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              gameMode === 'ai-easy'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Easy AI
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              onSelectMode('ai-medium');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              gameMode === 'ai-medium'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Medium AI
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              onSelectMode('ai-master');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              gameMode === 'ai-master'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs ring-1 ring-amber-500/50'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Master AI 🏆
          </button>
        </div>
      </div>

      {/* Customization Row: Variant & Skin Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Game Rules Variant */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
            Rules Variant
          </span>
          <div className="grid grid-cols-3 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl gap-1">
            <button
              onClick={() => {
                soundFX.playClick();
                onSelectVariant('classic');
              }}
              className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                variant === 'classic'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Classic
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                onSelectVariant('infinite');
              }}
              className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                variant === 'infinite'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="3 tokens maximum per player: 4th token replaces oldest"
            >
              Infinite ♾️
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                onSelectVariant('grid4');
              }}
              className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                variant === 'grid4'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              4x4 Grid
            </button>
          </div>
        </div>

        {/* Visual Skin Theme */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Skin Style</span>
            </span>
          </div>
          <div className="grid grid-cols-4 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl gap-1">
            {(['classic', 'neon', 'cyber', 'celestial'] as SymbolTheme[]).map((thm) => (
              <button
                key={thm}
                onClick={() => {
                  soundFX.playClick();
                  onSelectTheme(thm);
                }}
                className={`py-1.5 text-xs font-semibold capitalize rounded-lg transition-all cursor-pointer ${
                  symbolTheme === thm
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {thm === 'celestial' ? 'Sun/Moon' : thm}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Beautiful Background Ambience Presets */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Palette className="w-3 h-3 text-indigo-500" />
            <span>Background Scenery</span>
          </span>
        </div>
        <div className="grid grid-cols-4 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl gap-1">
          {[
            { id: 'aurora' as BackgroundStyle, label: 'Aurora 🌌' },
            { id: 'cyber' as BackgroundStyle, label: 'Cyber ⚡' },
            { id: 'casino' as BackgroundStyle, label: 'Velvet 🎲' },
            { id: 'minimal' as BackgroundStyle, label: 'Slate 🏛️' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                soundFX.playClick();
                onSelectBgStyle(preset.id);
              }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                bgStyle === preset.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>


      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundFX.playClick();
            }}
            className="flex items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Replay History */}
          <button
            onClick={onOpenHistory}
            disabled={!hasMoves}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              hasMoves
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                : 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
            title="Inspect move replay"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Move Replay</span>
          </button>
        </div>

        {/* New Round CTA Button */}
        <button
          onClick={() => {
            soundFX.playClick();
            onNewRound();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Round</span>
        </button>
      </div>
    </div>
  );
};
