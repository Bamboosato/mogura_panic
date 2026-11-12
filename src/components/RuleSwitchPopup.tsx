import React from 'react';
import type { RulePopupState } from '../types/game';

interface RuleSwitchPopupProps {
  popup: RulePopupState;
}

export const RuleSwitchPopup: React.FC<RuleSwitchPopupProps> = ({ popup }) => {
  if (!popup.isVisible) return null;

  const isRed = popup.theme === 'red';
  const borderColor = isRed
    ? 'border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.8)]'
    : 'border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.8)]';
  const badgeBg = isRed ? 'bg-red-500 text-white' : 'bg-cyan-400 text-slate-950';

  // 「【 〇〇 】を叩け！」形式の場合、1段目に対象【〇〇】、2段目に「を叩け！」と綺麗に2段分割
  const match = popup.mainTitle.match(/^(【.*?】)\s*(.+)$/);
  const targetText = match ? match[1] : popup.mainTitle;
  const actionText = match ? match[2] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-pop-in pointer-events-none select-none font-ud">
      <div
        className={`w-[90%] max-w-xs sm:max-w-sm bg-slate-900/95 border-4 sm:border-6 ${borderColor} rounded-3xl px-4 py-5 sm:px-6 sm:py-7 flex flex-col items-center text-center`}
      >
        {/* 上段バッジ（⚡ ルール変更！ / 🔥 パニックタイム！） */}
        <div
          className={`px-4 sm:px-5 py-1 rounded-full font-black text-sm sm:text-base font-ud tracking-wider mb-3 sm:mb-4 whitespace-nowrap ${badgeBg}`}
        >
          {popup.badgeText}
        </div>

        {/* 1段目：対象ターゲット（特大イエローで瞬時に目に飛び込む） */}
        <div className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-300 font-ud tracking-wider leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] whitespace-nowrap">
          {targetText}
        </div>

        {/* 2段目：アクション指示（控えめなサイズで対象を引き立てる） */}
        {actionText && (
          <div className="text-base sm:text-lg md:text-xl font-bold text-slate-200 font-ud tracking-widest mt-1.5 whitespace-nowrap">
            {actionText}
          </div>
        )}

        {/* 自動消去プログレスバー（Grace Pauseの進行度） */}
        <div className="w-full h-2.5 sm:h-3 bg-slate-800 rounded-full mt-4 sm:mt-5 overflow-hidden border border-slate-700">
          <div
            className={`h-full ${isRed ? 'bg-red-500' : 'bg-cyan-400'}`}
            style={{
              animation: `shrinkWidth ${popup.durationMs}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrinkWidth {
          0% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
    </div>
  );
};
