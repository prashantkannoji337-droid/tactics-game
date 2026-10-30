/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AiSpeed,
  BackgroundStyle,
  CellValue,
  GameMode,
  GameStats,
  GameVariant,
  MoveRecord,
  Player,
  SymbolTheme,
  WinningState,
} from './types';
import { checkWinner, getBestMove } from './utils/ai';
import { soundFX } from './utils/audio';
import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { GameModal } from './components/GameModal';
import { MoveHistoryModal } from './components/MoveHistoryModal';
import { RulesModal } from './components/RulesModal';
import { BackgroundAmbiance } from './components/BackgroundAmbiance';

const STATS_STORAGE_KEY = 'ttt_tactics_stats_v1';
const THEME_STORAGE_KEY = 'ttt_tactics_theme_v1';
const SOUND_STORAGE_KEY = 'ttt_tactics_sound_v1';
const DARK_STORAGE_KEY = 'ttt_tactics_dark_v1';
const AI_SPEED_STORAGE_KEY = 'ttt_tactics_ai_speed_v1';
const BG_STYLE_STORAGE_KEY = 'ttt_tactics_bg_style_v1';

export default function App() {
  // Game Settings & Customization
  const [variant, setVariant] = useState<GameVariant>('classic');
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [bgStyle, setBgStyle] = useState<BackgroundStyle>(() => {
    return (localStorage.getItem(BG_STYLE_STORAGE_KEY) as BackgroundStyle) || 'aurora';
  });
  const [aiSpeed, setAiSpeed] = useState<AiSpeed>(() => {
    return (localStorage.getItem(AI_SPEED_STORAGE_KEY) as AiSpeed) || 'instant';
  });
  const [symbolTheme, setSymbolTheme] = useState<SymbolTheme>(() => {
    return (localStorage.getItem(THEME_STORAGE_KEY) as SymbolTheme) || 'classic';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(SOUND_STORAGE_KEY);
    return saved !== null ? saved === 'true' : true;
  });


  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(DARK_STORAGE_KEY);
    if (saved !== null) return saved === 'true';
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  // Modals
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Board State
  const boardSize = variant === 'grid4' ? 16 : 9;
  const [board, setBoard] = useState<CellValue[]>(() => Array(boardSize).fill(null));
  const [currentTurn, setCurrentTurn] = useState<Player>('X');
  const [winningState, setWinningState] = useState<WinningState | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Infinite Mode queues (tracks placed indices in order)
  const [xQueue, setXQueue] = useState<number[]>([]);
  const [oQueue, setOQueue] = useState<number[]>([]);

  // Move history for inspection replay
  const [moves, setMoves] = useState<MoveRecord[]>([]);

  // Scoreboard Stats
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      xWins: 0,
      oWins: 0,
      draws: 0,
      streak: { player: null, count: 0 },
      totalGames: 0,
    };
  });

  // Sync Dark Mode class with root documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(DARK_STORAGE_KEY, String(darkMode));
  }, [darkMode]);

  // Sync Background Style Setting
  useEffect(() => {
    localStorage.setItem(BG_STYLE_STORAGE_KEY, bgStyle);
  }, [bgStyle]);

  // Sync Audio Setting
  useEffect(() => {
    soundFX.setSoundEnabled(soundEnabled);
    localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
  }, [soundEnabled]);


  // Sync Theme Setting
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, symbolTheme);
  }, [symbolTheme]);

  // Save Stats
  const saveStats = useCallback((newStats: GameStats) => {
    setStats(newStats);
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
    } catch {
      // ignore
    }
  }, []);

  // Names for players
  const playerXName = 'Player X';
  const playerOName = useMemo(() => {
    switch (gameMode) {
      case 'ai-easy':
        return 'Easy Bot';
      case 'ai-medium':
        return 'Tactical Bot';
      case 'ai-master':
        return 'Master AI';
      default:
        return 'Player O';
    }
  }, [gameMode]);

  // Handle Game Reset / New Round
  const handleNewRound = useCallback(
    (newVariant: GameVariant = variant) => {
      const newSize = newVariant === 'grid4' ? 16 : 9;
      setBoard(Array(newSize).fill(null));
      setCurrentTurn('X');
      setWinningState(null);
      setXQueue([]);
      setOQueue([]);
      setMoves([]);
      setIsResultModalOpen(false);
      setIsAiThinking(false);
    },
    [variant]
  );

  // Switch Variant
  const handleSelectVariant = useCallback(
    (newVariant: GameVariant) => {
      setVariant(newVariant);
      handleNewRound(newVariant);
    },
    [handleNewRound]
  );

  // Switch Game Mode
  const handleSelectMode = useCallback(
    (newMode: GameMode) => {
      setGameMode(newMode);
      handleNewRound(variant);
    },
    [handleNewRound, variant]
  );

  // Reset all recorded stats
  const handleResetStats = useCallback(() => {
    const blankStats: GameStats = {
      xWins: 0,
      oWins: 0,
      draws: 0,
      streak: { player: null, count: 0 },
      totalGames: 0,
    };
    saveStats(blankStats);
  }, [saveStats]);

  // Execute Move
  const executeMove = useCallback(
    (index: number, playerToPlay: Player) => {
      if (board[index] !== null || winningState !== null) return;

      soundFX.playMove(playerToPlay);

      let newBoard = [...board];
      let fadedIdx: number | null = null;
      let newXQueue = [...xQueue];
      let newOQueue = [...oQueue];

      // Infinite Mode logic: 3 tokens max
      if (variant === 'infinite') {
        const activeQueue = playerToPlay === 'X' ? newXQueue : newOQueue;
        if (activeQueue.length >= 3) {
          fadedIdx = activeQueue.shift()!;
          newBoard[fadedIdx] = null;
          soundFX.playFadeWarning();
        }
        activeQueue.push(index);
        if (playerToPlay === 'X') {
          newXQueue = activeQueue;
        } else {
          newOQueue = activeQueue;
        }
      }

      newBoard[index] = playerToPlay;

      // Update queues and board
      setBoard(newBoard);
      setXQueue(newXQueue);
      setOQueue(newOQueue);

      // Record move history
      const moveRecord: MoveRecord = {
        player: playerToPlay,
        index,
        moveNumber: moves.length + 1,
        fadedIndex: fadedIdx,
        boardState: [...newBoard],
      };
      setMoves((prev) => [...prev, moveRecord]);

      // Check win or draw
      const winCheck = checkWinner(newBoard, variant);
      if (winCheck) {
        setWinningState(winCheck);
        setIsResultModalOpen(true);

        if (winCheck.winner === 'draw') {
          soundFX.playDraw();
          saveStats({
            ...stats,
            draws: stats.draws + 1,
            totalGames: stats.totalGames + 1,
            streak: { player: null, count: 0 },
          });
        } else {
          soundFX.playWin();
          const isX = winCheck.winner === 'X';
          const newStreakCount =
            stats.streak.player === winCheck.winner ? stats.streak.count + 1 : 1;

          saveStats({
            ...stats,
            xWins: isX ? stats.xWins + 1 : stats.xWins,
            oWins: !isX ? stats.oWins + 1 : stats.oWins,
            totalGames: stats.totalGames + 1,
            streak: {
              player: winCheck.winner,
              count: newStreakCount,
            },
          });
        }
      } else {
        // Toggle turn
        setCurrentTurn(playerToPlay === 'X' ? 'O' : 'X');
      }
    },
    [board, winningState, variant, xQueue, oQueue, moves.length, stats, saveStats]
  );

  // Cell click handler by human player
  const handleCellClick = useCallback(
    (index: number) => {
      if (isAiThinking || winningState) return;

      // In vs AI mode, human is always X
      if (gameMode !== 'pvp' && currentTurn !== 'X') return;

      executeMove(index, currentTurn);
    },
    [isAiThinking, winningState, gameMode, currentTurn, executeMove]
  );

  // Persist AI speed setting
  useEffect(() => {
    localStorage.setItem(AI_SPEED_STORAGE_KEY, aiSpeed);
  }, [aiSpeed]);

  // AI Turn Trigger - Blazing Fast Execution
  useEffect(() => {
    if (
      gameMode !== 'pvp' &&
      currentTurn === 'O' &&
      !winningState &&
      !isAiThinking
    ) {
      setIsAiThinking(true);
      // Instant (0ms) or Fast (70ms)
      const delay = aiSpeed === 'instant' ? 0 : 70;
      const timer = setTimeout(() => {
        const bestMoveIndex = getBestMove(
          board,
          gameMode,
          variant,
          'O',
          'X',
          xQueue,
          oQueue
        );

        setIsAiThinking(false);
        if (bestMoveIndex !== -1 && board[bestMoveIndex] === null) {
          executeMove(bestMoveIndex, 'O');
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [gameMode, currentTurn, winningState, isAiThinking, board, variant, xQueue, oQueue, executeMove, aiSpeed]);


  // Keyboard shortcut listener (Keys 1-9 for 3x3 grid)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        handleNewRound();
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        setSoundEnabled((prev) => !prev);
        return;
      }

      if (variant !== 'grid4') {
        const keyNum = parseInt(e.key, 10);
        if (keyNum >= 1 && keyNum <= 9) {
          const index = keyNum - 1;
          handleCellClick(index);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [variant, handleNewRound, handleCellClick]);

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 overflow-x-hidden">
      {/* Dynamic Immersive Background Scenery */}
      <BackgroundAmbiance
        style={bgStyle}
        currentTurn={currentTurn}
        winningState={winningState}
        darkMode={darkMode}
      />

      {/* Main Foreground Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Bar Contract (Wordmark, Nav Links, Action) */}
        <Header
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((prev) => !prev)}
          onOpenRules={() => setIsRulesModalOpen(true)}
          onResetStats={handleResetStats}
          onSelectClassic={() => handleSelectVariant('classic')}
          onSelectInfinite={() => handleSelectVariant('infinite')}
        />

        {/* Main Content Arena */}
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center justify-between gap-6">
          {/* Score & Turn Banner */}
          <ScoreBoard
            stats={stats}
            currentTurn={currentTurn}
            gameMode={gameMode}
            variant={variant}
            theme={symbolTheme}
            isAiThinking={isAiThinking}
            playerXName={playerXName}
            playerOName={playerOName}
            xTokensCount={xQueue.length}
            oTokensCount={oQueue.length}
          />

          {/* Tactile Game Board */}
          <GameBoard
            board={board}
            variant={variant}
            currentTurn={currentTurn}
            winningState={winningState}
            theme={symbolTheme}
            isAiThinking={isAiThinking}
            onCellClick={handleCellClick}
            xQueue={xQueue}
            oQueue={oQueue}
          />

          {/* Strategic Game Controls & Difficulty Tabs */}
          <GameControls
            gameMode={gameMode}
            variant={variant}
            symbolTheme={symbolTheme}
            bgStyle={bgStyle}
            aiSpeed={aiSpeed}
            soundEnabled={soundEnabled}
            hasMoves={moves.length > 0}
            onSelectMode={handleSelectMode}
            onSelectVariant={handleSelectVariant}
            onSelectTheme={setSymbolTheme}
            onSelectBgStyle={setBgStyle}
            onSelectAiSpeed={setAiSpeed}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            onNewRound={() => handleNewRound()}
            onOpenRules={() => setIsRulesModalOpen(true)}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
          />
        </main>

        {/* Quiet Footer with Keyboard Shortcut Guidance */}
        <footer className="w-full py-3 text-center text-xs text-slate-500/80 dark:text-slate-400/80 border-t border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xs">
          <div className="flex items-center justify-center gap-2">
            <span>Shortcuts: Press 1-9 to mark cell</span>
            <span aria-hidden="true">·</span>
            <span>R: New round</span>
            <span aria-hidden="true">·</span>
            <span>M: Toggle sound</span>
          </div>
        </footer>
      </div>


      {/* Victory / Draw Celebration Modal */}
      <GameModal
        isOpen={isResultModalOpen}
        winningState={winningState}
        playerXName={playerXName}
        playerOName={playerOName}
        gameMode={gameMode}
        theme={symbolTheme}
        onPlayAgain={() => handleNewRound()}
        onClose={() => setIsResultModalOpen(false)}
      />

      {/* Match Replay Modal */}
      <MoveHistoryModal
        isOpen={isHistoryModalOpen}
        moves={moves}
        variant={variant}
        theme={symbolTheme}
        playerXName={playerXName}
        playerOName={playerOName}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      {/* Game Rules Modal */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
}
