import React from 'react';

interface MoleIconProps {
  className?: string;
}

/**
 * 元祖モグラパニック！のオリジナルモグラアイコン
 * ゲーム内のモグラキャラクター（丸い耳、パッチリ目、赤い鼻、白い前歯、盛り土）を
 * そのままミニマムに凝縮したSVGアイコン
 */
export const MoleIcon: React.FC<MoleIconProps> = ({
  className = 'w-7 h-7 sm:w-8 sm:h-8',
}) => {
  return (
    <svg
      viewBox="0 0 36 36"
      className={`shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 盛り土の穴の奥影 */}
      <ellipse cx="18" cy="32" rx="16" ry="4" fill="#0f172a" />

      {/* 左耳 */}
      <circle cx="8" cy="11.5" r="4.5" fill="#78350f" />
      <circle cx="8" cy="11.5" r="2.6" fill="#fbcfe8" />

      {/* 右耳 */}
      <circle cx="28" cy="11.5" r="4.5" fill="#78350f" />
      <circle cx="28" cy="11.5" r="2.6" fill="#fbcfe8" />

      {/* モグラの頭部（温かみのあるブラウン） */}
      <path
        d="M 6.5 33 C 6.5 13, 29.5 13, 29.5 33 Z"
        fill="#b45309"
        stroke="#78350f"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* ほっぺのチーク（ピンクの血色感） */}
      <ellipse cx="10" cy="23.5" rx="2.5" ry="1.6" fill="#f43f5e" opacity="0.65" />
      <ellipse cx="26" cy="23.5" rx="2.5" ry="1.6" fill="#f43f5e" opacity="0.65" />

      {/* 左目（パッチリ白目＋黒目＋ハイライト） */}
      <ellipse cx="13" cy="19" rx="2.5" ry="3.2" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
      <circle cx="13.5" cy="19" r="1.6" fill="#0f172a" />
      <circle cx="12.7" cy="18.2" r="0.7" fill="#ffffff" />

      {/* 右目（パッチリ白目＋黒目＋ハイライト） */}
      <ellipse cx="23" cy="19" rx="2.5" ry="3.2" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
      <circle cx="22.5" cy="19" r="1.6" fill="#0f172a" />
      <circle cx="21.7" cy="18.2" r="0.7" fill="#ffffff" />

      {/* 赤い大きなツヤ鼻 */}
      <ellipse cx="18" cy="22.8" rx="4" ry="2.7" fill="#e11d48" />
      <ellipse cx="16.8" cy="22" rx="1.2" ry="0.8" fill="#ffffff" opacity="0.85" />

      {/* 白いトレードマーク前歯 */}
      <rect
        x="16.4"
        y="25.5"
        width="3.2"
        height="3.2"
        rx="0.7"
        fill="#ffffff"
        stroke="#78350f"
        strokeWidth="0.6"
      />
      <line x1="18" y1="25.5" x2="18" y2="28.7" stroke="#78350f" strokeWidth="0.5" />

      {/* 手前の盛り土リム（穴から顔を出している立体感） */}
      <ellipse cx="18" cy="33.5" rx="16.5" ry="3" fill="#451a03" stroke="#78350f" strokeWidth="1" />
    </svg>
  );
};
