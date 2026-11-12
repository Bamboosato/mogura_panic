import React from 'react';

/**
 * 地下トンネルジオラマ（下側の余白エリア）
 * 土の地層、木の根っこ、坑道のレール、
 * そしてヘルメットのヘッドランプを灯したミニモグラがトロッコに乗ってトコトコ走るアニメーション
 */
export const DioramaTunnel: React.FC = () => {
  return (
    <div className="w-full max-w-[480px] h-11 sm:h-14 flex items-start justify-center overflow-hidden pointer-events-none select-none relative px-2 shrink-0">
      <svg
        viewBox="0 0 460 64"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 地層の断面グラデーション */}
          <linearGradient id="soil-strata" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f130b" />
            <stop offset="40%" stopColor="#2e1a10" />
            <stop offset="100%" stopColor="#180e07" />
          </linearGradient>

          {/* ヘッドランプの光（前方照射グラデーション） */}
          <linearGradient id="headlamp-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#fef08a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
          </linearGradient>

          {/* 金鉱石のキラリ光 */}
          <radialGradient id="ore-glint" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 🪨 地下トンネルの背景地層 */}
        <rect x="0" y="0" width="460" height="64" fill="url(#soil-strata)" rx="8" />

        {/* 天井から垂れ下がる木の根っこ */}
        <path d="M 40 0 Q 42 12, 38 18 M 120 0 Q 124 10, 128 15 M 260 0 Q 256 14, 262 20 M 390 0 Q 394 12, 388 16" stroke="#92400e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 42 4 Q 46 10, 48 14 M 258 8 Q 252 14, 250 18" stroke="#78350f" strokeWidth="1.2" fill="none" strokeLinecap="round" />

        {/* 岩壁に埋まる金鉱石のキラめき */}
        <polygon points="80,14 83,18 80,22 77,18" fill="#facc15" />
        <polygon points="320,12 323,16 320,20 317,16" fill="#facc15" />
        <polygon points="200,24 203,27 200,30 197,27" fill="#fbbf24" opacity="0.8" />
        <circle cx="80" cy="18" r="6" fill="url(#ore-glint)" className="animate-pulse" />

        {/* 🪵 坑道の支柱（木製アーチビーム） */}
        <g stroke="#451a03" strokeWidth="1">
          {/* 左側の支柱 */}
          <rect x="18" y="0" width="10" height="64" fill="#78350f" />
          <line x1="23" y1="0" x2="23" y2="64" stroke="#92400e" strokeWidth="1.5" />
          {/* 右側の支柱 */}
          <rect x="432" y="0" width="10" height="64" fill="#78350f" />
          <line x1="437" y1="0" x2="437" y2="64" stroke="#92400e" strokeWidth="1.5" />
          {/* 天井梁 */}
          <rect x="18" y="0" width="424" height="6" fill="#58240c" />
        </g>

        {/* 🚂 坑道トロッコのレール（枕木 ＆ 2本の鉄レール） */}
        <g transform="translate(0, 48)">
          {/* 枕木（等間隔に配置） */}
          {Array.from({ length: 22 }, (_, i) => (
            <rect key={i} x={i * 21 + 6} y="4" width="9" height="7" rx="1" fill="#451a03" stroke="#271810" strokeWidth="0.8" />
          ))}

          {/* 鉄レール */}
          <rect x="0" y="2" width="460" height="2.5" fill="#64748b" />
          <line x1="0" y1="2.5" x2="460" y2="2.5" stroke="#cbd5e1" strokeWidth="0.8" />

          <rect x="0" y="8.5" width="460" height="2" fill="#475569" />
          <line x1="0" y1="9" x2="460" y2="9" stroke="#94a3b8" strokeWidth="0.6" />
        </g>

        {/* 🦔 トロッコに乗ったミニモグラ（CSSアニメーションで左から右へ走行） */}
        <g className="animate-minecart-roll" transform="translate(0, 20)">
          {/* カートの上下揺れ（ガタゴト振動） */}
          <g className="animate-cart-bounce">
            {/* ヘッドランプの投光ビーム */}
            <polygon
              points="48,15 110,-5 110,40"
              fill="url(#headlamp-beam)"
              className="animate-lamp-glow"
            />

            {/* モグラ本体（トロッコに乗っている） */}
            <g transform="translate(24, 6)">
              {/* 丸い耳 */}
              <circle cx="-10" cy="-2" r="3" fill="#78350f" />
              <circle cx="-10" cy="-2" r="1.5" fill="#fbcfe8" />
              <circle cx="10" cy="-2" r="3" fill="#78350f" />
              <circle cx="10" cy="-2" r="1.5" fill="#fbcfe8" />

              {/* 頭部 */}
              <circle cx="0" cy="4" r="11" fill="#b45309" stroke="#78350f" strokeWidth="1.2" />

              {/* ヘルメット（黄色い安全帽） */}
              <path d="M -11 0 C -11 -12, 11 -12, 11 0 Z" fill="#eab308" stroke="#a16207" strokeWidth="1.2" />
              <ellipse cx="0" cy="0" rx="12" ry="2.5" fill="#ca8a04" />
              {/* ヘルメットのヘッドランプ本体 */}
              <circle cx="9" cy="-3" r="3" fill="#0f172a" />
              <circle cx="10" cy="-3" r="2.2" fill="#fef08a" className="animate-pulse" />

              {/* ぱっちり目 */}
              <circle cx="-3" cy="4" r="1.8" fill="#ffffff" />
              <circle cx="-2.5" cy="4" r="1" fill="#0f172a" />
              <circle cx="5" cy="4" r="1.8" fill="#ffffff" />
              <circle cx="5.5" cy="4" r="1" fill="#0f172a" />

              {/* 赤い鼻と前歯 */}
              <ellipse cx="1" cy="7" rx="2.5" ry="1.8" fill="#e11d48" />
              <rect x="0" y="9" width="2" height="2" fill="#ffffff" stroke="#78350f" strokeWidth="0.4" />

              {/* トロッコの縁につかまる可愛い前足 */}
              <ellipse cx="-13" cy="14" rx="3" ry="2.2" fill="#fbcfe8" stroke="#78350f" strokeWidth="0.8" />
              <ellipse cx="13" cy="14" rx="3" ry="2.2" fill="#fbcfe8" stroke="#78350f" strokeWidth="0.8" />
            </g>

            {/* トロッコ本体（リベット留めの木製/鉄製ワゴン） */}
            <g transform="translate(6, 18)">
              {/* トロッコに積まれた金塊 */}
              <circle cx="12" cy="0" r="4" fill="#fde047" />
              <circle cx="18" cy="-2" r="4.5" fill="#facc15" />
              <circle cx="24" cy="0" r="3.8" fill="#eab308" />

              {/* カートの荷台箱 */}
              <polygon points="0,2 36,2 32,18 4,18" fill="#92400e" stroke="#451a03" strokeWidth="1.5" />
              {/* 金属フレーム補強板 */}
              <line x1="2" y1="2" x2="34" y2="2" stroke="#334155" strokeWidth="2.5" />
              <line x1="5" y1="17" x2="31" y2="17" stroke="#334155" strokeWidth="2" />
              <line x1="18" y1="2" x2="18" y2="18" stroke="#334155" strokeWidth="2" />

              {/* 前輪と後輪（車輪が回転する演出） */}
              <g transform="translate(8, 22)">
                <circle cx="0" cy="0" r="5" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="2" fill="#94a3b8" />
                <g className="animate-wheel-spin">
                  <line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" strokeWidth="0.8" />
                  <line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" strokeWidth="0.8" />
                </g>
              </g>

              <g transform="translate(28, 22)">
                <circle cx="0" cy="0" r="5" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="2" fill="#94a3b8" />
                <g className="animate-wheel-spin">
                  <line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" strokeWidth="0.8" />
                  <line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" strokeWidth="0.8" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
