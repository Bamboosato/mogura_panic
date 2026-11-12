import React from 'react';
import type { HoleState, MoleColor } from '../types/game';

interface MoleProps {
  hole: HoleState;
  onWhack: (index: number) => void;
}

// モグラのカラーパレット定義
const COLOR_THEMES: Record<
  MoleColor,
  { body: string; stroke: string; earInner: string; paw: string }
> = {
  BROWN: { body: '#854d0e', stroke: '#713f12', earInner: '#fbcfe8', paw: '#fde047' },
  BLUE: { body: '#2563eb', stroke: '#1d4ed8', earInner: '#bfdbfe', paw: '#93c5fd' },
  YELLOW: { body: '#eab308', stroke: '#ca8a04', earInner: '#fef08a', paw: '#fef9c3' },
  GREEN: { body: '#16a34a', stroke: '#15803d', earInner: '#bbf7d0', paw: '#86efac' },
  PINK: { body: '#ec4899', stroke: '#be185d', earInner: '#fce7f3', paw: '#fbcfe8' },
};

export const Mole: React.FC<MoleProps> = ({ hole, onWhack }) => {
  const { index, isActive, moleType, moleColor = 'BROWN', hp, numberLabel, isWhacked, hitScoreEffect } = hole;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    onWhack(index);
  };

  const isGold = moleType === 'GOLD';
  const isBomb = moleType === 'BOMB';
  const isHelmet = moleType === 'HELMET';

  const theme = isGold
    ? { body: '#eab308', stroke: '#ca8a04', earInner: '#fef08a', paw: '#fef08a' }
    : COLOR_THEMES[moleColor] || COLOR_THEMES.BROWN;

  // 穴ごとに異なる野原の小花カラー
  const flowerTypes = [
    { left: '#ffffff', right: '#f472b6' }, // 白 ＆ ピンク
    { left: '#fef08a', right: '#ffffff' }, // 黄 ＆ 白
    { left: '#f472b6', right: '#38bdf8' }, // ピンク ＆ 水色
    { left: '#38bdf8', right: '#fef08a' }, // 水色 ＆ 黄色
  ];
  const flower = flowerTypes[index % flowerTypes.length];

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-end overflow-hidden select-none cursor-pointer touch-none"
      onPointerDown={handlePointerDown}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* 浮き上がりスコアエフェクト */}
      {hitScoreEffect && (
        <div
          key={hitScoreEffect.key}
          className={`absolute top-0 left-1/2 -translate-x-1/2 z-40 pointer-events-none font-black text-2xl sm:text-3xl font-ud drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-float-up whitespace-nowrap ${
            hitScoreEffect.isPositive ? 'text-yellow-300' : 'text-red-500'
          }`}
        >
          {hitScoreEffect.text}
        </div>
      )}

      {/* 🕳️ 穴の奥の暗がり（高さ95%の上膨らみアーチドーム・最背面 z-0） */}
      <svg
        viewBox="0 0 200 220"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 外枠リム（土の盛り上がり） */}
        <path
          d="M 18 198 C 18 42, 182 42, 182 198 Z"
          fill="#020617"
          stroke="#271810"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        {/* 穴の奥の深みシャドウ */}
        <path d="M 25 198 C 25 52, 175 52, 175 198 Z" fill="#000000" />
        <path d="M 28 198 C 28 58, 172 58, 172 198 Z" fill="#050811" />
      </svg>

      {/* モグラ本体（穴から飛び出す要素・z-10） */}
      <div
        className={`relative w-[92%] h-[95%] z-10 flex flex-col items-center justify-end transition-transform duration-150 ease-out ${
          isActive
            ? isWhacked
              ? 'translate-y-2 scale-95 duration-100'
              : '-translate-y-7 scale-100'
            : 'translate-y-full pointer-events-none'
        }`}
      >
        {/* SVGグラフィック */}
        <svg
          viewBox="0 0 200 220"
          className="w-full h-full drop-shadow-[0_6px_8px_rgba(0,0,0,0.6)] overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 💣 爆弾ターゲットの場合 */}
          {isBomb ? (
            <g>
              {/* 導火線と火花 */}
              <path d="M100 65 Q90 30, 125 25" fill="none" stroke="#a16207" strokeWidth="6" strokeLinecap="round" />
              <circle cx="125" cy="25" r="8" fill="#f97316" className="animate-ping" />
              <polygon points="125,15 130,22 137,20 133,27 138,33 130,31 126,38 122,31 114,33 119,27 115,20 122,22" fill="#ef4444" />
              
              {/* 爆弾本体 */}
              <circle cx="100" cy="120" r="62" fill="#1e293b" stroke="#0f172a" strokeWidth="6" />
              <circle cx="85" cy="105" r="48" fill="#334155" opacity="0.4" />
              <circle cx="70" cy="90" r="14" fill="#ffffff" opacity="0.3" />
              
              {/* トゲ */}
              <polygon points="100,48 92,60 108,60" fill="#0f172a" />
              <polygon points="100,192 92,180 108,180" fill="#0f172a" />
              <polygon points="28,120 40,112 40,128" fill="#0f172a" />
              <polygon points="172,120 160,112 160,128" fill="#0f172a" />
              <polygon points="48,68 61,67 54,78" fill="#0f172a" />
              <polygon points="152,68 139,67 146,78" fill="#0f172a" />

              {/* バツ目 */}
              <line x1="75" y1="95" x2="95" y2="110" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
              <line x1="95" y1="95" x2="75" y2="110" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
              <line x1="105" y1="95" x2="125" y2="110" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
              <line x1="125" y1="95" x2="105" y2="110" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />

              {/* 特大 NO-GO バツマーク ❌ */}
              <circle cx="100" cy="145" r="22" fill="#ef4444" />
              <text x="100" y="154" fill="#ffffff" fontSize="24" fontWeight="900" textAnchor="middle" dominantBaseline="middle">✕</text>
            </g>
          ) : (
            /* 通常モグラ / 金モグラ / ヘルメットモグラ / カラフルモグラ */
            <g>
              {/* 耳 */}
              <circle cx="48" cy="70" r="14" fill={theme.stroke} />
              <circle cx="48" cy="70" r="8" fill={theme.earInner} />
              <circle cx="152" cy="70" r="14" fill={theme.stroke} />
              <circle cx="152" cy="70" r="8" fill={theme.earInner} />

              {/* 体（丸い頭部） */}
              <path
                d="M36 220 C36 45, 164 45, 164 220 Z"
                fill={theme.body}
                stroke={theme.stroke}
                strokeWidth="7"
              />
              
              {isGold && (
                <path d="M55 210 C55 90, 100 65, 100 65 C80 95, 80 170, 75 210 Z" fill="#fef08a" opacity="0.6" />
              )}

              {/* お腹（通常時） */}
              {numberLabel === null && (
                <ellipse
                  cx="100"
                  cy="175"
                  rx="50"
                  ry="35"
                  fill={isGold ? '#fef08a' : theme.paw}
                  opacity="0.85"
                />
              )}

              {/* ヘルメット */}
              {isHelmet && hp === 2 && (
                <g className="drop-shadow-md">
                  <path d="M40 78 C40 35, 160 35, 160 78 Z" fill="#eab308" stroke="#a16207" strokeWidth="6" />
                  <ellipse cx="100" cy="78" rx="66" ry="12" fill="#ca8a04" />
                  <rect x="92" y="45" width="16" height="24" fill="#15803d" rx="2" />
                  <line x1="92" y1="57" x2="108" y2="57" stroke="#ffffff" strokeWidth="4" />
                  <line x1="100" y1="49" x2="100" y2="65" stroke="#ffffff" strokeWidth="4" />
                </g>
              )}

              {/* 王冠（金モグラ） */}
              {isGold && (
                <g>
                  <polygon points="70,42 85,62 100,32 115,62 130,42 130,72 70,72" fill="#fde047" stroke="#b45309" strokeWidth="4" />
                  <circle cx="70" cy="39" r="4" fill="#ef4444" />
                  <circle cx="100" cy="29" r="5" fill="#3b82f6" />
                  <circle cx="130" cy="39" r="4" fill="#10b981" />
                </g>
              )}

              {/* 表情（目・鼻・口） */}
              {isWhacked ? (
                <g>
                  {/* やられた表情（ぐるぐる目） */}
                  <circle cx="75" cy="85" r="12" fill="#ffffff" stroke={theme.stroke} strokeWidth="3" />
                  <path d="M70 85 Q75 80, 80 85 T75 90" fill="none" stroke={theme.stroke} strokeWidth="3" />
                  <circle cx="125" cy="85" r="12" fill="#ffffff" stroke={theme.stroke} strokeWidth="3" />
                  <path d="M120 85 Q125 80, 130 85 T125 90" fill="none" stroke={theme.stroke} strokeWidth="3" />
                  <path d="M142 62 Q148 72, 142 79 A5 5 0 0 1 138 72 Z" fill="#38bdf8" />
                  <line x1="88" y1="108" x2="112" y2="108" stroke={theme.stroke} strokeWidth="4" strokeLinecap="round" />
                </g>
              ) : (
                <g>
                  {/* ぱっちり目 */}
                  <ellipse cx="75" cy="84" rx="11" ry="14" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
                  <circle cx="77" cy="84" r="7" fill="#1e293b" />
                  <circle cx="75" cy="80" r="3" fill="#ffffff" />

                  <ellipse cx="125" cy="84" rx="11" ry="14" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
                  <circle cx="123" cy="84" r="7" fill="#1e293b" />
                  <circle cx="121" cy="80" r="3" fill="#ffffff" />

                  {/* ほっぺ */}
                  <ellipse cx="58" cy="100" rx="8" ry="5" fill="#f43f5e" opacity="0.65" />
                  <ellipse cx="142" cy="100" rx="8" ry="5" fill="#f43f5e" opacity="0.65" />

                  {/* 赤い大きな鼻 */}
                  <ellipse cx="100" cy="98" rx="17" ry="11" fill="#e11d48" />
                  <ellipse cx="95" cy="94" rx="5" ry="3" fill="#ffffff" opacity="0.8" />

                  {/* 前歯 */}
                  <rect x="94" y="108" width="12" height="11" rx="2" fill="#ffffff" stroke={theme.stroke} strokeWidth="2" />
                  <line x1="100" y1="108" x2="100" y2="119" stroke={theme.stroke} strokeWidth="1.5" />
                </g>
              )}

              {/* 脳トレ数字プレート ＆ モグラの手 */}
              {numberLabel !== null && (
                <g>
                  {/* 左右の手（肉球） */}
                  <ellipse cx="44" cy="154" rx="13" ry="11" fill={theme.paw} stroke={theme.stroke} strokeWidth="3" />
                  <ellipse cx="156" cy="154" rx="13" ry="11" fill={theme.paw} stroke={theme.stroke} strokeWidth="3" />

                  {/* 数字プレート本体 */}
                  <rect
                    x="51"
                    y="124"
                    width="98"
                    height="68"
                    rx="16"
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth="5"
                    className="drop-shadow-md"
                  />

                  {/* 数字テキスト */}
                  <text
                    x="100"
                    y="174"
                    fill="#090d16"
                    fontSize="50"
                    fontWeight="900"
                    fontFamily="var(--font-digital)"
                    textAnchor="middle"
                  >
                    {numberLabel}
                  </text>
                </g>
              )}
            </g>
          )}
        </svg>
      </div>

      {/* 🪵 穴の手前リム ＆ 草原の小さな草花（最前面 z-20） */}
      <svg
        viewBox="0 0 200 220"
        className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 手前の水平リム（温かみのあるウッド台座） */}
        <rect
          x="12"
          y="192"
          width="176"
          height="14"
          rx="5"
          fill="#451a03"
          stroke="#78350f"
          strokeWidth="3.5"
        />
        <line x1="18" y1="195" x2="182" y2="195" stroke="#92400e" strokeWidth="2" />

        {/* 🌿 左側の草むら */}
        <path d="M 10 198 Q 4 186, 6 180 Q 11 188, 12 198" fill="#4ade80" />
        <path d="M 14 198 Q 18 182, 24 176 Q 22 188, 16 198" fill="#22c55e" />

        {/* 🌸 左側の小さな花 */}
        <g transform="translate(10, 182)">
          <circle cx="-3" cy="0" r="3" fill={flower.left} />
          <circle cx="3" cy="0" r="3" fill={flower.left} />
          <circle cx="0" cy="-3" r="3" fill={flower.left} />
          <circle cx="0" cy="3" r="3" fill={flower.left} />
          <circle cx="0" cy="0" r="2.2" fill="#facc15" />
        </g>

        {/* 🌿 右側の草むら */}
        <path d="M 188 198 Q 194 186, 192 180 Q 187 188, 186 198" fill="#4ade80" />
        <path d="M 184 198 Q 180 182, 174 176 Q 176 188, 182 198" fill="#22c55e" />

        {/* 🌼 右側の小さな花 */}
        <g transform="translate(188, 182)">
          <circle cx="-3" cy="0" r="3" fill={flower.right} />
          <circle cx="3" cy="0" r="3" fill={flower.right} />
          <circle cx="0" cy="-3" r="3" fill={flower.right} />
          <circle cx="0" cy="3" r="3" fill={flower.right} />
          <circle cx="0" cy="0" r="2.2" fill="#f59e0b" />
        </g>
      </svg>
    </div>
  );
};
