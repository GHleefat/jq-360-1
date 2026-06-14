import React from 'react';
import type { LightSegment } from '@/types/game';

interface LightRayProps {
  segments: LightSegment[];
  cellSize: number;
  targetHit: boolean;
}

export const LightRay: React.FC<LightRayProps> = ({ segments, cellSize, targetHit }) => {
  const center = cellSize / 2;

  return (
    <svg className="absolute inset-0 pointer-events-none z-20" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="lightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {segments.map((segment, index) => {
        const x1 = segment.from.x * cellSize + center;
        const y1 = segment.from.y * cellSize + center;
        const x2 = segment.to.x * cellSize + center;
        const y2 = segment.to.y * cellSize + center;

        const isLast = index === segments.length - 1;
        const strokeColor = isLast && targetHit ? '#f97316' : 'url(#lightGradient)';

        return (
          <g key={index}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={strokeColor}
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#glow)"
              style={{
                strokeDasharray: '1000',
                strokeDashoffset: '1000',
                animation: `draw-ray 0.3s ease-out ${index * 0.05}s forwards`,
              }}
            />
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#fef3c7"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                strokeDasharray: '1000',
                strokeDashoffset: '1000',
                animation: `draw-ray 0.3s ease-out ${index * 0.05}s forwards`,
              }}
            />
          </g>
        );
      })}
    </svg>
  );
};
