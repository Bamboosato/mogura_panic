import React from 'react';
import type { HoleState } from '../types/game';
import { Mole } from './Mole';
import { DioramaSurface } from './DioramaSurface';
import { DioramaTunnel } from './DioramaTunnel';

interface PlayFieldProps {
  holes: HoleState[];
  onWhack: (index: number) => void;
}

export const PlayField: React.FC<PlayFieldProps> = ({ holes, onWhack }) => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center min-h-0 my-auto py-1 sm:py-2 gap-2 sm:gap-3">
      {/* 🌲 上側：地上風景ジオラマ（見張りモグラ ＆ のどかな丘） */}
      <DioramaSurface />

      {/* 🎯 メインの3×3モグラ盤面 */}
      <div className="playfield-board relative grid grid-cols-3 grid-rows-3 gap-2.5 sm:gap-3.5 bg-gradient-to-b from-[#14381e] via-[#0f2e18] to-[#091b10] p-3 sm:p-4 rounded-3xl border-4 border-[#2d5a36] shadow-[0_8px_28px_rgba(0,0,0,0.7)] overflow-hidden shrink-0">
        {/* 背景の小さな野原・クローバー装飾（のどかな草原の演出） */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grass-tuft" width="80" height="80" patternUnits="userSpaceOnUse">
                {/* 小さな草の芽 */}
                <path d="M 20 40 Q 16 30, 18 24 Q 22 32, 22 40" fill="#4ade80" />
                <path d="M 23 40 Q 28 28, 33 25 Q 30 33, 25 40" fill="#22c55e" />
                <path d="M 60 70 Q 56 62, 58 56 Q 62 64, 62 70" fill="#4ade80" />
                <path d="M 63 70 Q 68 59, 72 58 Q 69 65, 65 70" fill="#86efac" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grass-tuft)" />
          </svg>
        </div>

        {/* 各穴の配置 */}
        {holes.map((hole) => (
          <div key={hole.index} className="relative w-full h-full z-10">
            <Mole hole={hole} onWhack={onWhack} />
          </div>
        ))}
      </div>

      {/* ⛏️ 下側：地下トンネルジオラマ（走るトロッコモグラ ＆ 鉱山レール） */}
      <DioramaTunnel />
    </div>
  );
};
