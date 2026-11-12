import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-safe-container bg-slate-950/85 backdrop-blur-sm animate-pop-in font-ud">
      <div className="w-full max-w-md bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-slate-200 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-2xl font-black text-amber-300">📖 遊び方ガイド</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* ターゲット一覧 */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-black text-cyan-300">① モグラの種類</h3>

          <div className="grid grid-cols-2 gap-2 text-base">
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
              <span className="text-3xl mb-1">🐻</span>
              <span className="font-black text-amber-300">ふつうのモグラ</span>
              <span className="text-slate-300 font-bold">+10点</span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
              <span className="text-3xl mb-1">👑</span>
              <span className="font-black text-yellow-300">黄金モグラ</span>
              <span className="text-slate-300 font-bold">+30点 (素早い)</span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
              <span className="text-3xl mb-1">⛑️</span>
              <span className="font-black text-yellow-400">ヘルメット</span>
              <span className="text-slate-300 font-bold">2回叩く (+25点)</span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-2xl border border-red-500/50 bg-red-950/20 flex flex-col items-center text-center">
              <span className="text-3xl mb-1">💣</span>
              <span className="font-black text-red-400">トゲ爆弾 (叩くな!)</span>
              <span className="text-red-300 font-bold">-20点 減点</span>
            </div>
          </div>
        </div>

        {/* 脳トレモード解説 */}
        <div className="flex flex-col gap-2 p-3 bg-indigo-950/50 rounded-2xl border border-indigo-500/40">
          <h3 className="text-lg font-black text-purple-300">② 脳トレ・お題モード</h3>
          <p className="text-base text-slate-200 leading-snug font-bold">
            画面上のお題に合うモグラだけを叩こう！
          </p>
          <ul className="text-base text-slate-200 space-y-1 font-bold pl-2">
            <li>🎯 <b>数字のお題</b>: 【偶数】【奇数】【5以上】【4以下】など</li>
            <li>🎨 <b>色のお題</b>: 【青色】【黄色】【緑色】【ピンク】のモグラを指定！</li>
          </ul>
          <p className="text-sm sm:text-base text-yellow-300 font-bold mt-1">
            ※ルール変更時は、画面中央に特大ポップアップ（約1.5秒間ポーズ）でお知らせします。
          </p>
        </div>

        {/* 閉じるボタン */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xl rounded-2xl shadow-lg border-2 border-yellow-200 cursor-pointer"
        >
          わかった！
        </button>
      </div>
    </div>
  );
};
