import { Game, PlayerStats } from '@/types/game';

const POSITIONS = ['P', 'C', '1B', '2B', 'SS', '3B', 'LF', 'LC', 'RC', 'RF', 'B1', 'B2'];

function normalizeName(name: string): string {
  return name.replace(/\./g, '').replace(/\s+/g, ' ').trim();
}

export function calculatePlayerStats(games: Game[]): PlayerStats[] {
  const playerStatsMap = new Map<string, PlayerStats>();
  const displayNameMap = new Map<string, string>(); // normalized -> display name

  // Initialize player stats
  games.forEach(game => {
    // Get all unique players from positions, bench, and batting order
    const allPlayers = new Set<string>();
    
    game.field_positions.forEach(inning => {
      Object.values(inning.positions).forEach(playerName => {
        const norm = normalizeName(playerName);
        allPlayers.add(norm);
        if (!displayNameMap.has(norm)) displayNameMap.set(norm, playerName);
      });
      if (inning.bench) {
        if (inning.bench.B1) {
          const norm = normalizeName(inning.bench.B1);
          allPlayers.add(norm);
          if (!displayNameMap.has(norm)) displayNameMap.set(norm, inning.bench.B1);
        }
        if (inning.bench.B2) {
          const norm = normalizeName(inning.bench.B2);
          allPlayers.add(norm);
          if (!displayNameMap.has(norm)) displayNameMap.set(norm, inning.bench.B2);
        }
      }
    });

    game.batting_order.forEach(playerName => {
      const norm = normalizeName(playerName);
      allPlayers.add(norm);
      if (!displayNameMap.has(norm)) displayNameMap.set(norm, playerName);
    });

    allPlayers.forEach(norm => {
      if (!playerStatsMap.has(norm)) {
        playerStatsMap.set(norm, {
          player: { id: norm, name: displayNameMap.get(norm) || norm },
          positionStats: [],
          battingOrderStats: []
        });
      }
    });
  });

  // Calculate position stats, including explicit B1/B2 from bench object
  games.forEach(game => {
    game.field_positions.forEach(inning => {
      // Field positions
      Object.entries(inning.positions).forEach(([position, playerName]) => {
        if (!POSITIONS.includes(position)) return; // skip unknown positions
        const norm = normalizeName(playerName);
        const stats = playerStatsMap.get(norm)!;
        const positionStat = stats.positionStats.find(p => p.position === position);
        if (positionStat) {
          positionStat.inningsPlayed += 1;
        } else {
          stats.positionStats.push({
            position,
            inningsPlayed: 1,
            percentage: 0
          });
        }
      });
      // Bench positions from bench object
      if (inning.bench) {
        if (inning.bench.B1) {
          const norm = normalizeName(inning.bench.B1);
          const stats = playerStatsMap.get(norm)!;
          const positionStat = stats.positionStats.find(p => p.position === 'B1');
          if (positionStat) {
            positionStat.inningsPlayed += 1;
          } else {
            stats.positionStats.push({
              position: 'B1',
              inningsPlayed: 1,
              percentage: 0
            });
          }
        }
        if (inning.bench.B2) {
          const norm = normalizeName(inning.bench.B2);
          const stats = playerStatsMap.get(norm)!;
          const positionStat = stats.positionStats.find(p => p.position === 'B2');
          if (positionStat) {
            positionStat.inningsPlayed += 1;
          } else {
            stats.positionStats.push({
              position: 'B2',
              inningsPlayed: 1,
              percentage: 0
            });
          }
        }
      }
    });

    // Update batting order stats
    game.batting_order.forEach((playerName, index) => {
      const norm = normalizeName(playerName);
      const stats = playerStatsMap.get(norm)!;
      const orderStat = stats.battingOrderStats.find(o => o.order === index + 1);
      if (orderStat) {
        orderStat.games += 1;
      } else {
        stats.battingOrderStats.push({
          order: index + 1,
          games: 1
        });
      }
    });
  });

  // Calculate percentages
  playerStatsMap.forEach(stats => {
    const totalInnings = games.reduce((sum, game) => sum + game.field_positions.length, 0);
    stats.positionStats.forEach(pos => {
      pos.percentage = (pos.inningsPlayed / totalInnings) * 100;
    });
  });

  return Array.from(playerStatsMap.values());
}

export function getPositionDisplayName(position: string): string {
  const positionMap: Record<string, string> = {
    'P': 'Pitcher',
    'C': 'Catcher',
    '1B': 'First Base',
    '2B': 'Second Base',
    'SS': 'Short Stop',
    '3B': 'Third Base',
    'LF': 'Left Field',
    'LC': 'Left Center',
    'RC': 'Right Center',
    'RF': 'Right Field',
    'B1': 'Bench 1',
    'B2': 'Bench 2'
  };
  return positionMap[position] || position;
} 