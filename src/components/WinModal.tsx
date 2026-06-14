import React from 'react';
import { Star, ArrowRight, RotateCcw, Home, Trophy } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { levels } from '@/utils/levels';

interface WinModalProps {
  onBackHome: () => void;
  onNextLevel: () => void;
  onReplay: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ onBackHome, onNextLevel, onReplay }) => {
  const { steps, currentLevel, bestSteps } = useGameStore();
  const level = levels.find((l) => l.id === currentLevel);
  const hasNext = levels.some((l) => l.id === currentLevel + 1);

  if (!level) return null;

  const currentBest = bestSteps[currentLevel];
  const isNewRecord = currentBest !== undefined && currentBest === steps;
  const isPerfect = steps <= level.bestSteps;

  const stars = isPerfect ? 3 : steps <= level.bestSteps + 2 ? 2 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onReplay}
      />

      <div
        className="relative w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700/50 shadow-2xl p-8 text-center"
        style={{
          animation: 'modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl"
            style={{
              boxShadow: '0 0 40px rgba(251, 191, 36, 0.5)',
              animation: 'bounce-gentle 2s ease-in-out infinite',
            }}
          >
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-3xl font-bold text-white mb-2">恭喜过关！</h2>
          <p className="text-slate-400 mb-6">{level.name}</p>

          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                className={`w-10 h-10 transition-all duration-300 ${
                  i <= stars
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-600'
                }`}
                style={{
                  animation: i <= stars ? `star-pop 0.5s ease-out ${i * 0.15}s both` : 'none',
                }}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/30">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                本次步数
              </div>
              <div className="text-3xl font-bold font-mono text-yellow-400">{steps}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/30">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                最佳步数
              </div>
              <div className="text-3xl font-bold font-mono text-emerald-400">
                {currentBest ?? '-'}
              </div>
            </div>
          </div>

          {isNewRecord && (
            <div
              className="mb-6 py-2 px-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-medium"
              style={{ animation: 'pulse-glow 1.5s ease-in-out infinite' }}
            >
              🏆 新纪录！
            </div>
          )}

          <div className="flex flex-col gap-3">
            {hasNext ? (
              <button
                onClick={onNextLevel}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold shadow-lg shadow-orange-500/20 transition-all duration-200 hover:scale-[1.02]"
              >
                <span>下一关</span>
                <ArrowRight size={20} />
              </button>
            ) : (
              <div className="py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                🎉 已通关全部关卡！
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onReplay}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-all duration-200"
              >
                <RotateCcw size={18} />
                <span>重玩</span>
              </button>
              <button
                onClick={onBackHome}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-all duration-200"
              >
                <Home size={18} />
                <span>返回</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
