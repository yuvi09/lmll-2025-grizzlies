import React from 'react';
import Image from 'next/image';

// These coordinates are approximate and should be adjusted to match the SVG field
const POSITION_COORDS: Record<string, { x: number; y: number }> = {
  P:   { x: 410, y: 430 }, // Pitcher
  C:   { x: 410, y: 670 }, // Catcher
  '1B': { x: 630, y: 440 },
  '2B': { x: 410, y: 200 },
  SS:  { x: 320, y: 320 },
  '3B': { x: 200, y: 430 },
  LF:  { x: 100, y: 200 },
  LC:  { x: 250, y: 100 },
  RC:  { x: 570, y: 100 },
  RF:  { x: 720, y: 200 },
};

interface DiamondFrequencyPlotProps {
  frequencies: Record<string, number>; // e.g. { P: 4, C: 2, ... }
  maxFrequency?: number; // for scaling
}

const DiamondFrequencyPlot: React.FC<DiamondFrequencyPlotProps> = ({ frequencies, maxFrequency }) => {
  // If maxFrequency not provided, calculate from data
  const max = maxFrequency || Math.max(...Object.values(frequencies), 1);

  return (
    <div className="relative w-full max-w-xl mx-auto" style={{ aspectRatio: '815/759' }}>
      {/* SVG as background */}
      <Image
        src="/assets/Baseball_field_overview.svg"
        alt="Baseball Diamond"
        fill
        className="object-contain absolute top-0 left-0 z-0"
        style={{ pointerEvents: 'none' }}
        priority
      />
      {/* Overlay circles for each position */}
      <svg
        viewBox="0 0 815 759"
        className="absolute top-0 left-0 w-full h-full z-10"
        style={{ pointerEvents: 'none' }}
      >
        {Object.entries(POSITION_COORDS).map(([pos, { x, y }]) => {
          const freq = frequencies[pos] || 0;
          if (!freq) return null;
          // Circle size and color based on frequency
          const r = 18 + 18 * (freq / max); // min 18, max 36
          const color = `rgba(34,197,94,${0.3 + 0.7 * (freq / max)})`;
          return (
            <g key={pos}>
              <circle cx={x} cy={y} r={r} fill={color} stroke="#111" strokeWidth={2} />
              <text x={x} y={y + 6} textAnchor="middle" fontSize="22" fill="#111" fontWeight="bold">
                {freq}
              </text>
              <text x={x} y={y - r - 8} textAnchor="middle" fontSize="16" fill="#222" fontWeight="bold">
                {pos}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default DiamondFrequencyPlot; 