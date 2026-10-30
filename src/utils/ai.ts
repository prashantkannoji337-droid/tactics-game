import { CellValue, GameMode, GameVariant, Player, WinningState } from '../types';

export const WINNING_COMBOS_3X3 = [
  // Rows
  { combo: [0, 1, 2], direction: 'horizontal' as const, lineIndex: 0 },
  { combo: [3, 4, 5], direction: 'horizontal' as const, lineIndex: 1 },
  { combo: [6, 7, 8], direction: 'horizontal' as const, lineIndex: 2 },
  // Columns
  { combo: [0, 3, 6], direction: 'vertical' as const, lineIndex: 0 },
  { combo: [1, 4, 7], direction: 'vertical' as const, lineIndex: 1 },
  { combo: [2, 5, 8], direction: 'vertical' as const, lineIndex: 2 },
  // Diagonals
  { combo: [0, 4, 8], direction: 'diagonal-main' as const, lineIndex: 0 },
  { combo: [2, 4, 6], direction: 'diagonal-anti' as const, lineIndex: 1 },
];

export const WINNING_COMBOS_4X4 = [
  // Rows
  { combo: [0, 1, 2, 3], direction: 'horizontal' as const, lineIndex: 0 },
  { combo: [4, 5, 6, 7], direction: 'horizontal' as const, lineIndex: 1 },
  { combo: [8, 9, 10, 11], direction: 'horizontal' as const, lineIndex: 2 },
  { combo: [12, 13, 14, 15], direction: 'horizontal' as const, lineIndex: 3 },
  // Columns
  { combo: [0, 4, 8, 12], direction: 'vertical' as const, lineIndex: 0 },
  { combo: [1, 5, 9, 13], direction: 'vertical' as const, lineIndex: 1 },
  { combo: [2, 6, 10, 14], direction: 'vertical' as const, lineIndex: 2 },
  { combo: [3, 7, 11, 15], direction: 'vertical' as const, lineIndex: 3 },
  // Diagonals
  { combo: [0, 5, 10, 15], direction: 'diagonal-main' as const, lineIndex: 0 },
  { combo: [3, 6, 9, 12], direction: 'diagonal-anti' as const, lineIndex: 1 },
];

export function checkWinner(
  board: CellValue[],
  variant: GameVariant
): WinningState | null {
  const combos = variant === 'grid4' ? WINNING_COMBOS_4X4 : WINNING_COMBOS_3X3;

  for (const { combo, direction, lineIndex } of combos) {
    const first = board[combo[0]];
    if (first && combo.every((idx) => board[idx] === first)) {
      return {
        winner: first,
        winningLine: combo,
        direction,
        lineIndex,
      };
    }
  }

  // Check for draw if board is full (applicable to classic & 4x4; infinite mode never draws unless no legal moves)
  if (variant !== 'infinite') {
    const isFull = board.every((cell) => cell !== null);
    if (isFull) {
      return {
        winner: 'draw',
        winningLine: null,
      };
    }
  }

  return null;
}

// Memoization cache for minimax states to achieve sub-millisecond evaluation
const minimaxCache = new Map<string, number>();

// Minimax algorithm for unbeatable 3x3 AI with Alpha-Beta Pruning and Memoization
function minimax(
  board: CellValue[],
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  alpha: number,
  beta: number
): number {
  const result = checkWinner(board, 'classic');
  if (result) {
    if (result.winner === aiPlayer) return 10 - depth;
    if (result.winner === humanPlayer) return depth - 10;
    if (result.winner === 'draw') return 0;
  }

  // Board key for state caching
  const stateKey = `${board.map(c => c || '-').join('')}_${isMaximizing}_${depth}`;
  if (minimaxCache.has(stateKey)) {
    return minimaxCache.get(stateKey)!;
  }

  const availableMoves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) availableMoves.push(i);
  }

  if (availableMoves.length === 0) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of availableMoves) {
      board[move] = aiPlayer;
      const evaluation = minimax(board, depth + 1, false, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null;
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    minimaxCache.set(stateKey, maxEval);
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of availableMoves) {
      board[move] = humanPlayer;
      const evaluation = minimax(board, depth + 1, true, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null;
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    minimaxCache.set(stateKey, minEval);
    return minEval;
  }
}


export function getBestMove(
  board: CellValue[],
  mode: GameMode,
  variant: GameVariant,
  aiPlayer: Player = 'O',
  humanPlayer: Player = 'X',
  xQueue: number[] = [],
  oQueue: number[] = []
): number {
  const availableMoves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) availableMoves.push(i);
  }

  if (availableMoves.length === 0) return -1;

  // 1. Easy mode: Mostly random with 30% tactical play
  if (mode === 'ai-easy') {
    if (Math.random() < 0.7) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  // 2. Check for immediate winning move for AI
  for (const move of availableMoves) {
    const tempBoard = [...board];
    if (variant === 'infinite' && oQueue.length >= 3) {
      // Simulate oldest piece removal
      tempBoard[oQueue[0]] = null;
    }
    tempBoard[move] = aiPlayer;
    const win = checkWinner(tempBoard, variant);
    if (win && win.winner === aiPlayer) {
      return move;
    }
  }

  // 3. Check for blocking opponent's immediate winning move
  for (const move of availableMoves) {
    const tempBoard = [...board];
    if (variant === 'infinite' && xQueue.length >= 3) {
      tempBoard[xQueue[0]] = null;
    }
    tempBoard[move] = humanPlayer;
    const win = checkWinner(tempBoard, variant);
    if (win && win.winner === humanPlayer) {
      // If medium mode, 80% chance to block, else maybe blunder
      if (mode === 'ai-medium' && Math.random() < 0.2) continue;
      return move;
    }
  }

  // If medium mode and no immediate win/block, pick center, corners, or random
  if (mode === 'ai-medium') {
    const center = variant === 'grid4' ? [5, 6, 9, 10] : [4];
    const availableCenter = center.filter((idx) => board[idx] === null);
    if (availableCenter.length > 0 && Math.random() < 0.7) {
      return availableCenter[Math.floor(Math.random() * availableCenter.length)];
    }
    const corners = variant === 'grid4' ? [0, 3, 12, 15] : [0, 2, 6, 8];
    const availableCorners = corners.filter((idx) => board[idx] === null);
    if (availableCorners.length > 0 && Math.random() < 0.5) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // 4. Master AI (Minimax for 3x3 Classic)
  if (variant === 'classic') {
    let bestScore = -Infinity;
    let bestMoves: number[] = [];

    for (const move of availableMoves) {
      board[move] = aiPlayer;
      const score = minimax(board, 0, false, aiPlayer, humanPlayer, -Infinity, Infinity);
      board[move] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [move];
      } else if (score === bestScore) {
        bestMoves.push(move);
      }
    }

    if (bestMoves.length > 0) {
      return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }
  }

  // Infinite mode & 4x4 Master AI (Smart Heuristics + Center/Corners preference)
  // Center is strategically dominant
  if (variant === 'classic' || variant === 'infinite') {
    if (board[4] === null) return 4;
    const corners = [0, 2, 6, 8].filter((idx) => board[idx] === null);
    if (corners.length > 0 && Math.random() < 0.8) {
      return corners[Math.floor(Math.random() * corners.length)];
    }
  } else if (variant === 'grid4') {
    const sweetSpots = [5, 6, 9, 10, 0, 3, 12, 15].filter((idx) => board[idx] === null);
    if (sweetSpots.length > 0) {
      return sweetSpots[Math.floor(Math.random() * sweetSpots.length)];
    }
  }

  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}
