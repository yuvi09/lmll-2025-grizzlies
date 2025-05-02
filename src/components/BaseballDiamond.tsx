import React from 'react';
import { Game } from '@/types/game';

interface BaseballDiamondProps {
  game: Game;
  inning: number;
}

const BaseballDiamond: React.FC<BaseballDiamondProps> = ({ game, inning }) => {
  const currentInning = game.field_positions[inning - 1];
  const positions = currentInning.positions;

  const positionCoordinates: Record<string, { x: number; y: number }> = {
    'P': { x: 50, y: 50 },
    'C': { x: 50, y: 70 },
    '1B': { x: 80, y: 30 },
    '2B': { x: 50, y: 30 },
    'SS': { x: 20, y: 30 },
    '3B': { x: 20, y: 70 },
    'LF': { x: 10, y: 50 },
    'LC': { x: 30, y: 40 },
    'RC': { x: 70, y: 40 },
    'RF': { x: 90, y: 50 }
  };

  return (
    <div className="relative w-64 h-64">
      {/* Baseball Diamond Background */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Diamond Lines */}
        <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="1" />
        <polygon
          points="50,0 100,50 50,100 0,50"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        
        {/* Position Markers */}
        {Object.entries(positionCoordinates).map(([pos, coords]) => {
          const playerName = positions[pos as keyof typeof positions];
          return (
            <g key={pos}>
              <circle
                cx={coords.x}
                cy={coords.y}
                r="5"
                fill="#4CAF50"
                stroke="white"
                strokeWidth="1"
              />
              <text
                x={coords.x}
                y={coords.y + 15}
                textAnchor="middle"
                fill="white"
                fontSize="6"
              >
                {pos}
              </text>
              <text
                x={coords.x}
                y={coords.y - 8}
                textAnchor="middle"
                fill="white"
                fontSize="6"
              >
                {playerName}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BaseballDiamond; 