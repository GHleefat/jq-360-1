import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { levels } from '@/utils/levels';
import { LevelCard } from './LevelCard';

interface LevelSelectProps {
  onSelectLevel: (levelId: number) => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ onSelectLevel }) => {
  const { unlockedLevels, bestSteps } = useGameStore();

  const handleSelect = (levelId: number) => {
    onSelectLevel(levelId);
  };

  const completedCount = Object.keys(bestSteps).length;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Lightbulb
            className="w-12 h-12 text-yellow-400"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(251,191,36,0.8))',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-200 via-orange-300 to-yellow-200 bg-clip-text text-transparent">
            光线解谜
          </h1>
        </div>
        <p className="text-slate-400 text-lg">移动镜子和挡板，让光线照亮目标</p>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="text-slate-500">
            已解锁 <span className="text-emerald-400 font-bold">{unlockedLevels.length}</span> / {levels.length} 关
          </div>
          <div className="text-slate-500">
            已完成 <span className="text-yellow-400 font-bold">{completedCount}</span> / {levels.length} 关
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-w-4xl w-full">
        {levels.map((level) => (
          <LevelCard
            key={level.id}
            levelId={level.id}
            isUnlocked={unlockedLevels.includes(level.id)}
            bestSteps={bestSteps[level.id]}
            onClick={() => handleSelect(level.id)}
          />
        ))}
      </div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl w-full text-center">
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
          <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-lg bg-yellow-500/10">
            <div className="w-6 h-6 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
          </div>
          <div className="text-xs text-slate-400">光源</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
          <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-lg bg-orange-500/10">
            <div className="w-6 h-6 rounded-full border-4 border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
          </div>
          <div className="text-xs text-slate-400">目标</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
          <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-lg bg-cyan-500/10">
            <div className="w-8 h-1 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 rounded-full rotate-[-45deg] shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
          </div>
          <div className="text-xs text-slate-400">镜子</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
          <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-lg bg-slate-600/30">
            <div className="w-6 h-6 rounded bg-slate-600 border border-slate-500" />
          </div>
          <div className="text-xs text-slate-400">挡板</div>
        </div>
      </div>
    </div>
  );
};
