export type Player = 'X' | 'O';

export type CellValue = Player | null;

export type GameMode = 'pvp' | 'ai-easy' | 'ai-medium' | 'ai-master';

export type AiSpeed = 'instant' | 'fast';

export type GameVariant = 'classic' | 'infinite' | 'grid4';

export type SymbolTheme = 'classic' | 'neon' | 'cyber' | 'celestial';

export type BackgroundStyle = 'aurora' | 'cyber' | 'minimal' | 'casino';


export interface WinningState {
  winner: Player | 'draw';
  winningLine: number[] | null;
  direction?: 'horizontal' | 'vertical' | 'diagonal-main' | 'diagonal-anti';
  lineIndex?: number;
}

export interface MoveRecord {
  player: Player;
  index: number;
  moveNumber: number;
  fadedIndex?: number | null;
  boardState: CellValue[];
}

export interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
  streak: {
    player: Player | null;
    count: number;
  };
  totalGames: number;
}

export interface PlayerConfig {
  name: string;
  avatar: string;
  symbol: Player;
}

export interface AudioSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}
