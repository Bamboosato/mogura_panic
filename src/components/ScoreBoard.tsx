import React from 'react';
import type { GameMode, BrainRule } from '../types/game';

interface ScoreBoardProps {
  score: number;
  timeLeft: number;
  combo: number;
  mode: GameMode;
  currentRule: BrainRule | null;
  isPanicTime: boolean;
  isPlaying: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  timeLeft,
  combo,
  mode,
  currentRule,
  isPanicTime,
  isPlaying,
}) => {
  const isTimeLow = timeLeft <= 5 && isPlaying;

  return (
    <div className="w-full flex flex-col gap-1.5 sm:gap-2 my-1 shrink-0 select-none font-ud">
      {/* 上段：得点 ＆ 残り時間カウンター */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* スコアパネル */}
        <div className="flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl bg-slate-900/90 border-2 border-slate-700 shadow-md">
          <span className="text-sm sm:text-base font-bold text-slate-300">得点</span>
          <div className="flex items-baseline gap-1">
            <span className="font-digital font-black text-3xl sm:text-4xl text-yellow-300 tracking-wider">
              {String(score).padStart(4, '0')}
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-300">点</span>
          </div>
        </div>

        {/* 残り時間パネル */}
        <div
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl bg-slate-900/90 border-2 shadow-md transition-colors ${
            isTimeLow
              ? 'border-red-500 bg-red-950/40 animate-pulse'
              : 'border-slate-700'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm sm:text-base font-bold text-slate-300">残り時間</span>
            {combo > 1 && isPlaying && (
              <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-full">
                {combo} 連続!
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={`font-digital font-black text-3xl sm:text-4xl tracking-wider ${
                isTimeLow ? 'text-red-400' : 'text-cyan-300'
              }`}
            >
              {String(Math.max(0, timeLeft)).padStart(2, '0')}
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-300">秒</span>
          </div>
        </div>
      </div>

      {/* 下段：現在のお題バナー */}
      <div
        className={`w-full py-1.5 px-3 rounded-2xl flex items-center justify-center text-center shadow-md border-2 transition-all ${
          isPanicTime
            ? 'bg-red-950/70 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
            : mode === 'brain' && currentRule
            ? 'bg-indigo-950/80 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]'
            : 'bg-slate-900/80 border-slate-700 text-slate-300'
        }`}
      >
        {isPanicTime ? (
          <p className="font-black text-lg sm:text-2xl text-yellow-300 tracking-wide animate-pulse whitespace-nowrap">
            🔥 もう怒ったぞ！パニックタイム！！
          </p>
        ) : mode === 'brain' && currentRule ? (
          <div className="flex items-center gap-1.5 sm:gap-2 justify-center whitespace-nowrap">
            <span className="text-lg sm:text-2xl shrink-0">🎯</span>
            <span className="font-black text-lg sm:text-2xl text-yellow-300 whitespace-nowrap">
              {currentRule.shortTitle}
            </span>
          </div>
        ) : (
          <p className="font-bold text-base sm:text-xl text-slate-200 whitespace-nowrap">
            {isPlaying ? '穴から出てくるモグラを叩け！' : '「スタート」を押してプレイ開始！'}
          </p>
        )}
      </div>
    </div>
  );
};
