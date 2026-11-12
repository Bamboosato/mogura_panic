import React from 'react';
import type { SpeedPreset, GameMode } from '../types/game';

interface FooterControlsProps {
  isPlaying: boolean;
  speed: SpeedPreset;
  mode: GameMode;
  onChangeSpeed: (speed: SpeedPreset) => void;
  onChangeMode: (mode: GameMode) => void;
  onStart: () => void;
  onStop: () => void;
}

export const FooterControls: React.FC<FooterControlsProps> = ({
  isPlaying,
  speed,
  mode,
  onChangeSpeed,
  onChangeMode,
  onStart,
  onStop,
}) => {
  return (
    <footer className="w-full shrink-0 flex flex-col gap-1.5 sm:gap-2 font-ud select-none">
      {!isPlaying ? (
        <>
          {/* モード選択 ＆ 速度選択（スタート前） */}
          <div className="grid grid-cols-2 gap-2">
            {/* モード切り替えトグル */}
            <div className="flex bg-slate-900/90 rounded-2xl p-1 border-2 border-slate-700">
              <button
                type="button"
                onClick={() => onChangeMode('classic')}
                className={`flex-1 py-1.5 text-base sm:text-lg font-black rounded-xl transition-all cursor-pointer ${
                  mode === 'classic'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                王道
              </button>
              <button
                type="button"
                onClick={() => onChangeMode('brain')}
                className={`flex-1 py-1.5 text-base sm:text-lg font-black rounded-xl transition-all cursor-pointer ${
                  mode === 'brain'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                脳トレ
              </button>
            </div>

            {/* 速度切り替え（青系背景 ＆ アイコンを大きく高視認化） */}
            <div className="flex bg-slate-900/90 rounded-2xl p-1 border-2 border-slate-700">
              <button
                type="button"
                onClick={() => onChangeSpeed('slow')}
                aria-label="ゆっくり速度"
                className={`flex-1 py-1 text-2xl sm:text-3xl rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                  speed === 'slow'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/40 scale-102'
                    : 'text-slate-400 hover:text-slate-200 opacity-50 hover:opacity-100'
                }`}
              >
                🐢
              </button>
              <button
                type="button"
                onClick={() => onChangeSpeed('normal')}
                aria-label="ふつう速度"
                className={`flex-1 py-1 text-2xl sm:text-3xl rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                  speed === 'normal'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/40 scale-102'
                    : 'text-slate-400 hover:text-slate-200 opacity-50 hover:opacity-100'
                }`}
              >
                🐇
              </button>
              <button
                type="button"
                onClick={() => onChangeSpeed('fast')}
                aria-label="はやい速度"
                className={`flex-1 py-1 text-2xl sm:text-3xl rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                  speed === 'fast'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/40 scale-102'
                    : 'text-slate-400 hover:text-slate-200 opacity-50 hover:opacity-100'
                }`}
              >
                ⚡
              </button>
            </div>
          </div>

          {/* 特大スタートボタン */}
          <button
            type="button"
            onClick={onStart}
            className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 active:scale-98 text-slate-950 font-black text-xl sm:text-2xl rounded-2xl border-2 border-yellow-200 shadow-[0_4px_16px_rgba(250,204,21,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🕹️</span>
            <span>スタート！</span>
          </button>
        </>
      ) : (
        /* プレイ中の操作バー */
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onStop}
            className="w-full py-2.5 sm:py-3 bg-slate-800/80 hover:bg-slate-700 active:scale-98 text-slate-300 hover:text-white font-bold text-lg rounded-2xl border border-slate-700 transition-all cursor-pointer text-center"
          >
            ⏹️ やめる
          </button>
        </div>
      )}
    </footer>
  );
};
