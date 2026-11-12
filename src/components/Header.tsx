import React, { useState } from 'react';
import type { GameMode } from '../types/game';
import { sound } from '../utils/sound';
import { MoleIcon } from './MoleIcon';

interface HeaderProps {
  mode: GameMode;
  isPlaying: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  isPlaying,
  soundEnabled,
  onToggleSound,
  onOpenHelp,
}) => {
  const [showIosGuide, setShowIosGuide] = useState(false);

  // 全画面切り替え
  const handleToggleFullscreen = () => {
    sound.unlock();
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        setShowIosGuide(true);
        setTimeout(() => setShowIosGuide(false), 4000);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-2.5 sm:px-4 py-1.5 sm:py-2 border border-slate-800/80 bg-slate-900/80 rounded-2xl backdrop-blur-sm z-20 font-ud shrink-0">
      {/* 左側：タイトル / モードバッジ（改行を完全防止し1行でスマートに表示） */}
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <MoleIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        <h1 className="text-[15px] sm:text-lg md:text-xl font-black text-white tracking-tight whitespace-nowrap">
          元祖モグラパニック！
        </h1>
        <span
          className={`px-2 py-0.5 rounded-full text-xs sm:text-sm font-black whitespace-nowrap shrink-0 ${
            mode === 'brain'
              ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
              : 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
          }`}
        >
          {mode === 'brain' ? '脳トレ' : 'エレメカ'}
        </span>
      </div>

      {/* 右側：アクションボタン群（スマホサイズに合わせて省スペース化） */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* サウンド切り替え */}
        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'サウンドをミュート' : 'サウンドをオン'}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 flex items-center justify-center text-base sm:text-xl transition-all cursor-pointer"
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        {/* 全画面ボタン */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          aria-label="全画面表示の切り替え"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 flex items-center justify-center text-base sm:text-xl transition-all cursor-pointer"
        >
          ⛶
        </button>

        {/* ヘルプガイドボタン */}
        {!isPlaying && (
          <button
            type="button"
            onClick={onOpenHelp}
            aria-label="遊び方ガイド"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-yellow-300 border border-slate-700 flex items-center justify-center text-base sm:text-xl font-black transition-all cursor-pointer"
          >
            ❓
          </button>
        )}
      </div>

      {/* iOS Safari向け「ホーム画面に追加」案内ポップアップ */}
      {showIosGuide && (
        <div className="fixed top-14 right-4 z-50 p-4 max-w-xs bg-slate-900 border-2 border-yellow-400 text-slate-200 rounded-2xl shadow-2xl animate-pop-in font-ud text-sm">
          <p className="font-bold text-yellow-300 text-base mb-1">📱 全画面アプリ化の方法</p>
          <p className="leading-relaxed">
            Safari下部の「共有ボタン (⬆)」をタップし、<b>「ホーム画面に追加」</b>を選ぶと全画面で快適に遊べます！
          </p>
        </div>
      )}
    </header>
  );
};
