import React from 'react';
import { RotateCcw, Home, Footprints } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { levels } from '@/utils/levels';

interface HUDProps {
  onBack: () => void;
}

export const HUD: React.FC<HUDProps> = ({ onBack }) => {
  const { steps, currentLevel, resetLevel, bestSteps } = useGameStore();
  const level = levels.find((l) => l.id === currentLevel);

  return (
    <div className="absolute top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between px-6 z-30">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all duration-200 hover:scale-105"
      >
        <Home size={18} />
        <span className="font-medium">返回</span>
      </button>

      <div className="flex items-center gap-8">
        <div className="text-center">
          <div className="text-xs text-slate-500 uppercase tracking-wider">关卡</div>
          <div className="text-xl font-bold text-white">
            {level?.name || `第 ${currentLevel} 关`}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Footprints className="text-yellow-400" size={20} />
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">步数</div>
            <div className="text-xl font-bold font-mono text-yellow-400">{steps}</div>
          </div>
        </div>

        {level && level.bestSteps > 0 && (
          <div className="text-center">
            <div className="text-xs text-slate-500 uppercase tracking-wider">最佳</div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {bestSteps[currentLevel] || '-'}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={resetLevel}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all duration-200 hover:scale-105"
      >
        <RotateCcw size={18} />
        <span className="font-medium">重置</span>
      </button>
    </div>
  );
};
