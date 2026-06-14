import React from 'react';
import { Lock, Star, Trophy } from 'lucide-react';
import { levels } from '@/utils/levels';

interface LevelCardProps {
  levelId: number;
  isUnlocked: boolean;
  bestSteps?: number;
  onClick: () => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({
  levelId,
  isUnlocked,
  bestSteps,
  onClick,
}) => {
  const level = levels.find((l) => l.id === levelId);
  if (!level) return null;

  const hasBest = bestSteps !== undefined && bestSteps !== null;
  const isPerfect = hasBest && bestSteps <= level.bestSteps;
  const stars = hasBest
    ? isPerfect
      ? 3
      : bestSteps <= level.bestSteps + 2
        ? 2
        : 1
    : 0;

  return (
    <button
      onClick={onClick}
      disabled={!isUnlocked}
      className={`relative group aspect-square rounded-2xl p-4 transition-all duration-300 ${
        isUnlocked
          ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-slate-700/80 hover:to-slate-800/80 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 cursor-pointer border border-slate-700/50 hover:border-yellow-500/30'
          : 'bg-slate-900/40 border border-slate-800/50 cursor-not-allowed opacity-60'
      }`}
    >
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="w-8 h-8 text-slate-600" />
        </div>
      )}

      <div className={`w-full h-full flex flex-col items-center justify-between ${!isUnlocked ? 'opacity-30' : ''}`}>
        <div className="text-xs text-slate-500 font-medium tracking-wider uppercase">
          第 {levelId} 关
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className={`text-3xl md:text-4xl font-bold mb-2 transition-colors duration-300 ${
              isUnlocked
                ? hasBest
                  ? 'text-yellow-400'
                  : 'text-white group-hover:text-yellow-300'
                : 'text-slate-600'
            }`}
          >
            {levelId}
          </div>
          <div className="text-xs text-slate-400 text-center line-clamp-2">
            {level.name}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 mt-2">
          {[1, 2, 3].map((i) => (
            <Star
              key={i}
              className={`w-4 h-4 transition-all duration-200 ${
                i <= stars
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {hasBest && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
            <Trophy className="w-3 h-3" />
            <span>{bestSteps} 步</span>
          </div>
        )}

        {isPerfect && isUnlocked && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <Trophy className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
    </button>
  );
};
