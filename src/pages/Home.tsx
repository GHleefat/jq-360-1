import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { LevelSelect } from '@/components/LevelSelect';
import { GameBoard } from '@/components/GameBoard';
import { HUD } from '@/components/HUD';
import { WinModal } from '@/components/WinModal';

type ViewMode = 'select' | 'game';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const { isComplete, initLevel, nextLevel, resetLevel, currentLevel, clearLevel } = useGameStore();

  useEffect(() => {
    if (currentLevel > 0 && viewMode === 'select') {
      setViewMode('game');
    }
  }, [currentLevel, viewMode]);

  const handleSelectLevel = (levelId: number) => {
    initLevel(levelId);
    setViewMode('game');
  };

  const handleBackToSelect = () => {
    clearLevel();
    setViewMode('select');
  };

  const handleNextLevel = () => {
    nextLevel();
  };

  const handleReplay = () => {
    resetLevel();
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(251, 191, 36, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.05) 0%, transparent 60%)
          `,
        }}
      />

      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full h-full">
        {viewMode === 'select' ? (
          <LevelSelect onSelectLevel={handleSelectLevel} />
        ) : (
          <>
            <HUD onBack={handleBackToSelect} />
            <GameBoard onBack={handleBackToSelect} />
          </>
        )}
      </div>

      {isComplete && viewMode === 'game' && (
        <WinModal
          onBackHome={handleBackToSelect}
          onNextLevel={handleNextLevel}
          onReplay={handleReplay}
        />
      )}
    </div>
  );
}
