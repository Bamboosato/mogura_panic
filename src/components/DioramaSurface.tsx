import React from 'react';

/**
 * 地上風景ジオラマ（上側の余白エリア）
 * モグラの丘の草木、道標、風にそよぐ花々、
 * そして草むらの奥から時々ピョコッと顔を出して双眼鏡で見張る「見張りモグラ」
 */
export const DioramaSurface: React.FC = () => {
  return (
    <div className="w-full max-w-[480px] h-11 sm:h-14 flex items-end justify-center overflow-hidden pointer-events-none select-none relative px-2 shrink-0">
      <svg
        viewBox="0 0 460 70"
        className="w-full h-full"
        preserveAspectRatio="xMidYMax meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 青空・草原のグラデーション */}
          <linearGradient id="sky-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hill-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#14381e" />
          </linearGradient>
        </defs>

        {/* 遠くのなだらかな緑の丘 */}
        <path d="M 0 70 Q 110 32, 230 46 T 460 70 Z" fill="#166534" opacity="0.6" />
        <path d="M 0 70 Q 160 38, 320 30 T 460 70 Z" fill="url(#hill-grad)" />

        {/* 🌲 左側の低木＆道標 */}
        <g transform="translate(30, 22)">
          {/* 低木の茂み */}
          <circle cx="16" cy="32" r="14" fill="#14532d" />
          <circle cx="30" cy="30" r="16" fill="#166534" />
          <circle cx="22" cy="22" r="12" fill="#15803d" />

          {/* 木製の道標ポール */}
          <rect x="52" y="16" width="5" height="30" fill="#78350f" rx="1.5" />
          {/* 案内板 */}
          <path d="M 46 16 L 78 16 L 84 22 L 78 28 L 46 28 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
          <text x="64" y="24" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">
            モグラの丘
          </text>
        </g>

        {/* 🌸 右側の小さな野花たち */}
        <g transform="translate(360, 38)">
          <circle cx="10" cy="18" r="4" fill="#f43f5e" />
          <circle cx="10" cy="18" r="1.5" fill="#fef08a" />
          <circle cx="24" cy="22" r="3.5" fill="#38bdf8" />
          <circle cx="24" cy="22" r="1.2" fill="#ffffff" />
          <circle cx="36" cy="16" r="4.5" fill="#fbbf24" />
          <circle cx="36" cy="16" r="1.5" fill="#b45309" />
          <circle cx="48" cy="20" r="3.5" fill="#f472b6" />
          <circle cx="48" cy="20" r="1.2" fill="#ffffff" />
        </g>

        {/* 🦋 ひらひら舞うチョウチョ（CSSアニメーション） */}
        <g className="animate-butterfly-flutter" transform="translate(100, 16)">
          <ellipse cx="-2" cy="-2" rx="3.5" ry="2" fill="#fef08a" transform="rotate(-30)" />
          <ellipse cx="2" cy="-2" rx="3.5" ry="2" fill="#fef08a" transform="rotate(30)" />
          <ellipse cx="-1.5" cy="2" rx="2.5" ry="1.5" fill="#fde047" transform="rotate(-15)" />
          <ellipse cx="1.5" cy="2" rx="2.5" ry="1.5" fill="#fde047" transform="rotate(15)" />
          <line x1="0" y1="-4" x2="0" y2="4" stroke="#78350f" strokeWidth="0.8" />
        </g>

        {/* 🦔 見張りモグラ（草むらの奥から顔を出し、双眼鏡で周囲を見渡す） */}
        <g transform="translate(230, 48)">
          {/* モグラ本体（CSSキーフレームで浮上＆キョロキョロ見張り） */}
          <g className="animate-lookout-mole" style={{ transformOrigin: '0px 10px' }}>
            {/* 耳 */}
            <circle cx="-13" cy="-14" r="3.5" fill="#78350f" />
            <circle cx="-13" cy="-14" r="1.8" fill="#fbcfe8" />
            <circle cx="13" cy="-14" r="3.5" fill="#78350f" />
            <circle cx="13" cy="-14" r="1.8" fill="#fbcfe8" />

            {/* 頭部 */}
            <path d="M -14 6 C -14 -16, 14 -16, 14 6 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />

            {/* つぶらな目 */}
            <circle cx="-5" cy="-8" r="2" fill="#ffffff" />
            <circle cx="-4.5" cy="-8" r="1.2" fill="#0f172a" />
            <circle cx="5" cy="-8" r="2" fill="#ffffff" />
            <circle cx="5.5" cy="-8" r="1.2" fill="#0f172a" />

            {/* 赤い鼻と前歯 */}
            <ellipse cx="0" cy="-4" rx="3" ry="2" fill="#e11d48" />
            <rect x="-1.5" y="-2" width="3" height="2.5" rx="0.5" fill="#ffffff" stroke="#78350f" strokeWidth="0.5" />

            {/* 探検隊の双眼鏡（手で構えている様子） */}
            <rect x="-10" y="-7" width="8" height="5" rx="2" fill="#334155" stroke="#0f172a" strokeWidth="1" />
            <rect x="2" y="-7" width="8" height="5" rx="2" fill="#334155" stroke="#0f172a" strokeWidth="1" />
            <line x1="-2" y1="-4.5" x2="2" y2="-4.5" stroke="#0f172a" strokeWidth="1.5" />
            {/* レンズのキラリ光 */}
            <circle cx="-6" cy="-4.5" r="1.5" fill="#38bdf8" />
            <circle cx="6" cy="-4.5" r="1.5" fill="#38bdf8" />

            {/* 前足の爪 */}
            <ellipse cx="-12" cy="0" rx="3.5" ry="2.5" fill="#fbcfe8" stroke="#78350f" strokeWidth="1" />
            <ellipse cx="12" cy="0" rx="3.5" ry="2.5" fill="#fbcfe8" stroke="#78350f" strokeWidth="1" />
          </g>

          {/* 手前を隠す草むら（モグラはこの草むらの後ろから顔を出す） */}
          <path d="M -26 12 Q -18 -4, -14 12 Q -8 -6, -2 12 Q 4 -5, 10 12 Q 18 -6, 26 12 Z" fill="#15803d" />
          <path d="M -22 14 Q -14 0, -10 14 Q -2 -2, 4 14 Q 12 1, 18 14 Z" fill="#22c55e" />
        </g>
      </svg>
    </div>
  );
};
