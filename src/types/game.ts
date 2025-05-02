export interface Player {
  id: string;
  name: string;
}

export interface Position {
  playerId: string;
  inning: number;
  position: 'P' | 'C' | '1B' | '2B' | 'SS' | '3B' | 'LF' | 'LC' | 'RC' | 'RF';
}

export interface BattingOrder {
  playerId: string;
  order: number;
}

export interface Inning {
  inning: string;
  positions: {
    P?: string;
    C?: string;
    '1B'?: string;
    '2B'?: string;
    SS?: string;
    '3B'?: string;
    LF?: string;
    LC?: string;
    RC?: string;
    RF?: string;
    // B1/B2 are not here, they're in bench
  };
  bench?: {
    B1?: string;
    B2?: string;
  };
}

export interface Game {
  game: string;
  field_positions: Inning[];
  batting_order: string[];
}

export interface PlayerStats {
  player: Player;
  positionStats: {
    position: string;
    inningsPlayed: number;
    percentage: number;
  }[];
  battingOrderStats: {
    order: number;
    games: number;
  }[];
} 