import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { levels } from '@/utils/levels';
import { GameElement } from './GameElement';
import { LightRay } from './LightRay';
import type { Position } from '@/types/game';

interface GameBoardProps {
  onBack?: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = () => {
  const {
    currentLevel,
    elements,
    lightPath,
    targetHit,
    draggingElement,
    moveElement,
    rotateMirror,
    setDragging,
  } = useGameStore();

  const level = levels.find((l) => l.id === currentLevel);
  const boardRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(60);
  const [hoverCell, setHoverCell] = useState<Position | null>(null);
  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const calculateSize = () => {
      if (!level) return;
      const maxWidth = Math.min(window.innerWidth - 80, 800);
      const maxHeight = window.innerHeight - 200;
      const sizeByWidth = Math.floor(maxWidth / level.gridSize.width);
      const sizeByHeight = Math.floor(maxHeight / level.gridSize.height);
      setCellSize(Math.min(sizeByWidth, sizeByHeight, 70));
    };
    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [level]);

  const getCellFromEvent = useCallback(
    (clientX: number, clientY: number): Position | null => {
      if (!boardRef.current || !level) return null;
      const rect = boardRef.current.getBoundingClientRect();
      const x = Math.floor((clientX - rect.left) / cellSize);
      const y = Math.floor((clientY - rect.top) / cellSize);
      if (x < 0 || x >= level.gridSize.width || y < 0 || y >= level.gridSize.height) {
        return null;
      }
      return { x, y };
    },
    [cellSize, level]
  );

  const handleDragStart = useCallback(
    (clientX: number, clientY: number, elementId: string) => {
      const element = elements.find((el) => el.id === elementId);
      if (!element || !boardRef.current) return;

      const rect = boardRef.current.getBoundingClientRect();
      const elementLeft = element.position.x * cellSize;
      const elementTop = element.position.y * cellSize;

      dragOffsetRef.current = {
        x: clientX - rect.left - elementLeft,
        y: clientY - rect.top - elementTop,
      };

      setDragging(elementId, { ...element.position });
    },
    [elements, cellSize, setDragging]
  );

  const handleMouseDragStart = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      handleDragStart(e.clientX, e.clientY, elementId);
    },
    [handleDragStart]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, elementId: string) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        const touch = e.touches[0];
        handleDragStart(touch.clientX, touch.clientY, elementId);
      }
    },
    [handleDragStart]
  );

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!boardRef.current || !level) return;
      const cell = getCellFromEvent(clientX, clientY);
      setHoverCell(cell);
    },
    [getCellFromEvent, level]
  );

  const handleDragEnd = useCallback(
    (clientX: number, clientY: number) => {
      if (!draggingElement) return;
      const cell = getCellFromEvent(clientX, clientY);
      if (cell) {
        const dragEl = elements.find((el) => el.id === draggingElement);
        if (
          dragEl &&
          (dragEl.position.x !== cell.x || dragEl.position.y !== cell.y)
        ) {
          moveElement(draggingElement, cell);
        }
      }
      setDragging(null, null);
      setHoverCell(null);
    },
    [draggingElement, elements, getCellFromEvent, moveElement, setDragging]
  );

  useEffect(() => {
    if (!draggingElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX, e.clientY);
    };

    const handleMouseUp = (e: MouseEvent) => {
      handleDragEnd(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        const touch = e.touches[0];
        handleDragMove(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        handleDragEnd(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [draggingElement, handleDragMove, handleDragEnd]);

  const handleElementClick = useCallback(
    (elementId: string) => {
      rotateMirror(elementId);
    },
    [rotateMirror]
  );

  if (!level) return null;

  const boardWidth = level.gridSize.width * cellSize;
  const boardHeight = level.gridSize.height * cellSize;

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < level.gridSize.height; y++) {
      for (let x = 0; x < level.gridSize.width; x++) {
        const isHovered =
          hoverCell && hoverCell.x === x && hoverCell.y === y && draggingElement;
        cells.push(
          <div
            key={`${x}-${y}`}
            className={`absolute border border-slate-700/30 transition-colors duration-150 ${
              isHovered ? 'bg-yellow-500/10 border-yellow-500/40' : 'bg-slate-800/20'
            }`}
            style={{
              left: `${x * cellSize}px`,
              top: `${y * cellSize}px`,
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
          />
        );
      }
    }
    return cells;
  };

  const draggingEl = draggingElement
    ? elements.find((el) => el.id === draggingElement)
    : null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center pt-20 pb-8 px-4">
      <div
        ref={boardRef}
        className="relative rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 shadow-2xl"
        style={{
          width: `${boardWidth}px`,
          height: `${boardHeight}px`,
        }}
      >
        {renderGrid()}

        <LightRay segments={lightPath} cellSize={cellSize} targetHit={targetHit} />

        {elements.map((element) => (
          <GameElement
            key={element.id}
            element={element}
            cellSize={cellSize}
            onDragStart={handleMouseDragStart}
            onTouchStart={handleTouchStart}
            onClick={handleElementClick}
            isDragging={draggingElement === element.id}
            targetHit={targetHit && element.type === 'target'}
          />
        ))}

        {draggingEl && hoverCell && (
          <div
            className="absolute border-2 border-dashed border-yellow-400/60 rounded-lg pointer-events-none z-30 transition-all duration-75"
            style={{
              left: `${hoverCell.x * cellSize + 4}px`,
              top: `${hoverCell.y * cellSize + 4}px`,
              width: `${cellSize - 8}px`,
              height: `${cellSize - 8}px`,
            }}
          />
        )}
      </div>

      <div className="mt-6 text-center text-slate-400 text-sm space-y-1">
        <p>拖拽镜子和挡板移动位置</p>
        <p>点击镜子旋转方向 ( / ↔ \ )</p>
      </div>
    </div>
  );
};
