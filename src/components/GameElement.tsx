import React from 'react';
import { Sun, Target, Square } from 'lucide-react';
import type { GameElement as GameElementType } from '@/types/game';

interface GameElementProps {
  element: GameElementType;
  cellSize: number;
  onDragStart: (e: React.MouseEvent, elementId: string) => void;
  onTouchStart: (e: React.TouchEvent, elementId: string) => void;
  onClick: (elementId: string) => void;
  isDragging: boolean;
  targetHit: boolean;
}

export const GameElement: React.FC<GameElementProps> = ({
  element,
  cellSize,
  onDragStart,
  onTouchStart,
  onClick,
  isDragging,
  targetHit,
}) => {
  const left = element.position.x * cellSize;
  const top = element.position.y * cellSize;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.movable && element.type === 'mirror') {
      onClick(element.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (element.movable) {
      e.preventDefault();
      onDragStart(e, element.id);
    }
  };

  const handleTouchStartEvent = (e: React.TouchEvent) => {
    if (element.movable) {
      onTouchStart(e, element.id);
    }
  };

  const renderElement = () => {
    switch (element.type) {
      case 'light':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <Sun
              className="w-3/4 h-3/4 text-yellow-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
              style={{
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            />
          </div>
        );

      case 'target':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <Target
              className={`w-3/4 h-3/4 transition-all duration-300 ${
                targetHit
                  ? 'text-orange-400 drop-shadow-[0_0_20px_rgba(249,115,22,1)] scale-110'
                  : 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]'
              }`}
              style={{
                animation: targetHit ? 'pulse-orange 1s ease-in-out infinite' : 'none',
              }}
            />
          </div>
        );

      case 'mirror': {
        const rotation = element.orientation === '/' ? -45 : 45;
        return (
          <div
            className="relative w-full h-full flex items-center justify-center cursor-pointer"
            onClick={handleClick}
          >
            <div
              className="absolute w-4/5 h-1 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-transform duration-200"
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            />
            <div
              className="absolute w-4/5 h-0.5 bg-white/60 rounded-full"
              style={{
                transform: `rotate(${rotation}deg) translateY(-2px)`,
              }}
            />
          </div>
        );
      }

      case 'blocker':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <Square className="w-4/5 h-4/5 text-slate-600 fill-slate-700 stroke-slate-500" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`absolute transition-all duration-150 ${
        element.movable ? 'cursor-grab active:cursor-grabbing hover:scale-105' : ''
      } ${isDragging ? 'opacity-50 z-50' : 'z-10'}`}
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${cellSize}px`,
        height: `${cellSize}px`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStartEvent}
    >
      {renderElement()}
    </div>
  );
};
