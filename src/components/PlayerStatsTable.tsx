import React from 'react';
import { PlayerStats } from '@/types/game';

const POSITIONS = ['P', 'C', '1B', '2B', 'SS', '3B', 'LF', 'LC', 'RC', 'RF'];

const PlayerStatsTable: React.FC<{ stats: PlayerStats[] }> = ({ stats }) => {
  if (!stats || stats.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No player statistics available</p>
      </div>
    );
  }

  // Build a map: player -> position -> innings
  const tableData = stats.map(playerStat => {
    const posMap: Record<string, number> = {};
    POSITIONS.forEach(pos => (posMap[pos] = 0));
    let bench = 0;
    let total = 0;
    playerStat.positionStats?.forEach(posStat => {
      if (posStat.position === 'B1' || posStat.position === 'B2') {
        bench += posStat.inningsPlayed || 0;
      } else if (POSITIONS.includes(posStat.position)) {
        posMap[posStat.position] = posStat.inningsPlayed || 0;
      }
      total += posStat.inningsPlayed || 0;
    });
    return {
      name: playerStat.player.name,
      posMap,
      bench,
      total
    };
  })
  // Filter out players with zero total innings played
  .filter(row => row.total > 0);

  // Find the max innings played at any position for color coding (including bench)
  const maxInnings = Math.max(
    ...tableData.flatMap(row => [...POSITIONS.map(pos => row.posMap[pos]), row.bench])
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 text-center">
        <thead>
          <tr className="bg-gray-100 text-gray-900">
            <th className="px-4 py-2 border text-gray-900">Player</th>
            {POSITIONS.map(pos => (
              <th key={pos} className="px-2 py-2 border text-gray-900">{pos}</th>
            ))}
            <th className="px-2 py-2 border text-gray-900">Bench</th>
            <th className="px-4 py-2 border text-gray-900">Total Innings Played</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(row => (
            <tr key={row.name}>
              <td className="px-4 py-2 border text-left font-semibold text-gray-900">{row.name}</td>
              {POSITIONS.map(pos => (
                <td
                  key={pos}
                  className="px-2 py-2 border text-gray-900"
                  style={{ backgroundColor: maxInnings > 0 && row.posMap[pos] > 0 ? `rgba(34,197,94,${0.2 + 0.6 * (row.posMap[pos] / maxInnings)})` : undefined }}
                >
                  {row.posMap[pos]}
                </td>
              ))}
              <td
                className="px-2 py-2 border text-gray-900"
                style={{ backgroundColor: maxInnings > 0 && row.bench > 0 ? `rgba(34,197,94,${0.2 + 0.6 * (row.bench / maxInnings)})` : undefined }}
              >
                {row.bench}
              </td>
              <td className="px-4 py-2 border font-bold text-gray-900">{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-xs text-gray-500 mt-2">(Color code: more innings at a position = darker background shade. &quot;Bench&quot; = sum of B1 and B2.)</div>
    </div>
  );
};

export default PlayerStatsTable; 