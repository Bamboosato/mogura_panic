import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { RankingResult } from '../types/game';

interface ResultScreenProps {
  score: number;
  maxCombo: number;
  hits: number;
  misses: number;
  rankingResult: RankingResult | null;
  onRestart: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  maxCombo,
  hits,
  misses,
  rankingResult,
  onRestart,
  onHome,
}) => {
  const currentRowRef = useRef<HTMLDivElement | null>(null);

  const isRanked = rankingResult?.rank !== null && (rankingResult?.rank ?? 0) > 0;
  const rank = rankingResult?.rank ?? null;

  useEffect(() => {
    // ランクインした場合は紙吹雪
    if (isRanked) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }

    // 今回の行に自動スクロール
    const timer = setTimeout(() => {
      if (currentRowRef.current) {
        currentRowRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isRanked]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center modal-safe-container bg-slate-950/95 backdrop-blur-md overflow-y-auto overscroll-contain font-ud">
      <div className="w-full max-w-lg min-[900px]:max-w-4xl h-full min-[900px]:h-auto flex flex-col justify-between min-[900px]:grid min-[900px]:grid-cols-[1fr_1.15fr] min-[900px]:grid-rows-[auto_auto] min-[900px]:gap-x-8 min-[900px]:gap-y-4 min-[900px]:items-center">
        {/* 上部スコア・順位バナー（PCでは左カラム上段） */}
        <div className="w-full flex flex-col items-center pt-2 sm:pt-4 min-[900px]:pt-0 min-[900px]:col-start-1 min-[900px]:row-start-1 min-[900px]:self-end">
          <h2 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wider">
            🏆 ゲームしゅうりょう！
          </h2>

          {/* 最終スコア */}
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-slate-400 text-lg sm:text-xl font-bold">得点:</span>
            <span className="text-5xl sm:text-6xl font-black font-digital text-yellow-300 drop-shadow-[0_2px_10px_rgba(253,224,71,0.5)]">
              {score}
            </span>
            <span className="text-2xl font-black text-slate-300">点</span>
          </div>

          {/* 成績詳細サマリー */}
          <div className="flex items-center gap-4 text-base sm:text-lg font-bold text-slate-300 mb-2">
            <span>ヒット: <b className="text-emerald-400">{hits}</b></span>
            <span>ミス: <b className="text-rose-400">{misses}</b></span>
            <span>最大コンボ: <b className="text-amber-300">{maxCombo}</b></span>
          </div>

          {/* 特大ランクインバナー（3重視覚ハイライト ①） */}
          {rank === 1 ? (
            <div className="w-full py-2.5 px-4 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-slate-950 rounded-2xl border-2 border-yellow-200 shadow-[0_0_20px_rgba(250,204,21,0.8)] text-center animate-pulse">
              <p className="text-xl sm:text-2xl font-black">
                👑 祝・歴代 1 位（自己ベスト更新！）
              </p>
            </div>
          ) : rank !== null ? (
            <div className="w-full py-2.5 px-4 bg-amber-500/20 text-yellow-300 rounded-2xl border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)] text-center">
              <p className="text-xl sm:text-2xl font-black">
                🎉 今回 第 {rank} 位 にランクイン！
              </p>
            </div>
          ) : (
            <div className="w-full py-2 px-4 bg-slate-900 text-slate-300 rounded-2xl border border-slate-700 text-center">
              <p className="text-lg sm:text-xl font-bold">
                今回：圏外（あと <span className="text-amber-400 font-black">{rankingResult?.pointsToEnterTop10 ?? 0}</span> 点で10位入り！）
              </p>
            </div>
          )}
        </div>

        {/* スコア履歴表（Top 10 リスト：PCでは右カラム全面） */}
        <div className="w-full flex-1 min-h-0 my-3 min-[900px]:my-0 min-[900px]:col-start-2 min-[900px]:row-start-1 min-[900px]:row-span-2 bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-3 sm:p-4 overflow-y-auto overscroll-contain max-h-[42vh] min-[900px]:max-h-[70vh] shadow-inner">
          <h3 className="text-lg font-black text-slate-400 mb-2.5 flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span>🏅 歴代トップ10 スコア履歴</span>
            <span className="text-sm sm:text-base text-slate-400 font-normal">上位10件を自動保存</span>
          </h3>

          <div className="flex flex-col gap-2">
            {rankingResult?.top10List.map((item, idx) => {
              const isCurrent = item.id === rankingResult.currentRunId;
              const rankNum = idx + 1;
              const medal = rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : `${rankNum}位`;

              return (
                <div
                  key={item.id}
                  ref={isCurrent ? currentRowRef : null}
                  className={`grid grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1fr)] items-center gap-2 px-2.5 sm:px-3 py-2.5 rounded-xl text-lg sm:text-xl transition-all ${
                    isCurrent
                      ? 'bg-amber-500/25 border-2 border-yellow-300 text-white font-black shadow-[0_0_12px_rgba(253,224,71,0.5)] animate-pulse'
                      : 'bg-slate-800/60 border border-slate-700/50 text-slate-300'
                  }`}
                >
                  {/* 順位 ＆ 今回バッジ */}
                  <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                    <span className="font-black w-10 sm:w-12 text-center whitespace-nowrap shrink-0">{medal}</span>
                    {isCurrent && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-yellow-400 text-slate-950 text-xs sm:text-sm font-black rounded-md whitespace-nowrap shrink-0">
                        👉 今回
                      </span>
                    )}
                  </div>

                  {/* スコア（全行で縦位置を揃え、数値は右寄せ） */}
                  <div className="flex items-baseline justify-end gap-1 min-w-[4.75rem] sm:min-w-[5.5rem]">
                    <span className="font-digital font-black text-2xl text-yellow-300 tabular-nums">
                      {item.score}
                    </span>
                    <span className="text-base text-slate-300 font-bold">点</span>
                  </div>

                  {/* 達成日時 */}
                  <span className="text-xs sm:text-base text-slate-300 font-mono text-right whitespace-nowrap">
                    {item.playedAt}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* フッター操作ボタン（PCでは左カラム下段） */}
        <div className="w-full flex flex-col sm:flex-row gap-3 pt-2 min-[900px]:col-start-1 min-[900px]:row-start-2 min-[900px]:self-start">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 active:scale-98 text-slate-950 font-black text-2xl rounded-2xl shadow-[0_4px_14px_rgba(16,185,129,0.5)] border-2 border-emerald-300 transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
          >
            <span>🕹️</span>
            <span>もう１回プレイ！</span>
          </button>

          <button
            type="button"
            onClick={onHome}
            className="py-3 px-6 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-bold text-lg rounded-2xl border border-slate-600 transition-all cursor-pointer text-center touch-manipulation"
          >
            ホームへ
          </button>
        </div>
      </div>
    </div>
  );
};
