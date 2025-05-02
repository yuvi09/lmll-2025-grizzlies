'use client';

import React, { useState, useEffect } from 'react';
import PlayerStatsTable from '@/components/PlayerStatsTable';
import { Game, PlayerStats } from '@/types/game';
import { calculatePlayerStats } from '@/lib/stats';

function getOrderColor(order: number, maxOrder: number) {
  if (order === 1) return 'bg-green-300';
  if (order === maxOrder) return 'bg-red-300';
  if (order <= Math.ceil(maxOrder / 3)) return 'bg-green-200';
  if (order >= maxOrder - Math.floor(maxOrder / 3) + 1) return 'bg-red-200';
  return 'bg-yellow-100';
}

function normalizeName(name: string): string {
  return name.replace(/\./g, '').replace(/\s+/g, ' ').trim();
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load game data from JSON files
    const loadGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }

        const validGames = data.filter(game => 
          game && 
          game.game && 
          game.field_positions && 
          Array.isArray(game.field_positions) && 
          game.field_positions.length > 0
        );

        if (validGames.length === 0) {
          setError('No valid game data found');
        } else {
          setGames(validGames);
        }
      } catch (error) {
        console.error('Error loading games:', error);
        setError(error instanceof Error ? error.message : 'An error occurred while loading games');
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      const stats = calculatePlayerStats(games);
      setPlayerStats(stats);
    }
  }, [games]);

  // Aggregate batting order stats across all games
  const battingOrderMap: Record<string, number[]> = {};
  let maxOrder = 0;
  games.forEach(game => {
    if (game.batting_order) {
      maxOrder = Math.max(maxOrder, game.batting_order.length);
      game.batting_order.forEach((player, idx) => {
        const norm = normalizeName(player);
        if (!battingOrderMap[norm]) battingOrderMap[norm] = [];
        battingOrderMap[norm].push(idx + 1);
      });
    }
  });

  // Prepare sorted player list and their most common batting order
  const allPlayerNormNames = Array.from(new Set(
    Object.keys(battingOrderMap).concat(
      ...games.flatMap(game => game.batting_order.map(normalizeName))
    )
  ));
  allPlayerNormNames.sort();

  // Map normalized name to display name (first encountered)
  const displayNameMap: Record<string, string> = {};
  games.forEach(game => {
    game.batting_order.forEach(player => {
      const norm = normalizeName(player);
      if (!displayNameMap[norm]) displayNameMap[norm] = player;
    });
  });

  // For each player, get their order per game and aggregate
  const battingOrderStats = allPlayerNormNames.map(norm => {
    // Per game order
    const perGameOrders = games.map(game => {
      const idx = game.batting_order.map(normalizeName).indexOf(norm);
      return idx >= 0 ? idx + 1 : null;
    });
    // Aggregate
    const orders = battingOrderMap[norm] || [];
    const orderCounts: Record<number, number> = {};
    orders.forEach(order => {
      orderCounts[order] = (orderCounts[order] || 0) + 1;
    });
    let mostCommonOrder = 1;
    let maxCount = 0;
    Object.entries(orderCounts).forEach(([orderStr, count]) => {
      const order = parseInt(orderStr);
      if (count > maxCount || (count === maxCount && order < mostCommonOrder)) {
        mostCommonOrder = order;
        maxCount = count;
      }
    });
    return {
      player: displayNameMap[norm] || norm,
      perGameOrders,
      mostCommonOrder,
      orderCounts
    };
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Loading...</h1>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Error</h1>
            <p className="text-lg text-red-600">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">Pizza Gourmet Grizzlies - Player Stats</h1>
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Player Statistics</h2>
          <PlayerStatsTable stats={playerStats} />
        </div>
        {battingOrderStats.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Batting Order (Per Game & Aggregate)</h2>
            <table className="min-w-[300px] w-auto border border-gray-300 text-center">
              <thead>
                <tr className="bg-gray-100 text-gray-900">
                  <th className="px-4 py-2 border text-gray-900">Player</th>
                  {games.map((game, idx) => (
                    <th key={idx} className="px-4 py-2 border text-gray-900">{game.game || `Game ${idx + 1}`}</th>
                  ))}
                  <th className="px-4 py-2 border text-gray-900">Aggregate</th>
                </tr>
              </thead>
              <tbody>
                {battingOrderStats.map(({ player, perGameOrders, mostCommonOrder }) => (
                  <tr key={player}>
                    <td className="px-4 py-2 border text-left font-semibold text-gray-900">{player}</td>
                    {perGameOrders.map((order, idx) => (
                      <td key={idx} className="px-4 py-2 border text-gray-900">{order ? order : <span className="text-gray-400">—</span>}</td>
                    ))}
                    <td className={`px-4 py-2 border font-bold text-gray-900 ${getOrderColor(mostCommonOrder, maxOrder)}`}>{mostCommonOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-500 mt-2">(Each column shows batting order for that game. Aggregate = most common order. Color: green = early, yellow = middle, red = late.)</div>
          </div>
        )}
      </div>
    </main>
  );
}
