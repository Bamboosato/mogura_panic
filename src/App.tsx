import React, { useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { PlayField } from './components/PlayField';
import { FooterControls } from './components/FooterControls';
import { RuleSwitchPopup } from './components/RuleSwitchPopup';
import { ResultScreen } from './components/ResultScreen';
import { HelpModal } from './components/HelpModal';

export const App: React.FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const {
    mode,
    speed,
    isPlaying,
    isPanicTime,
    isGameOver,
    score,
    timeLeft,
    combo,
    maxCombo,
    hits,
    misses,
    currentRule,
    popup,
    holes,
    rankingResult,
    soundEnabled,
    setMode,
    setSpeed,
    toggleSound,
    startGame,
    stopGame,
    whackMole,
  } = useGameEngine();

  return (
    <div className="relative w-full min-h-screen min-h-[100dvh] bg-slate-950 select-none font-ud text-white flex items-center justify-center overflow-y-auto">
      {/* アーケード筐体コンテナ（スマホは縦積み・PCは2カラムへアダプティブ展開） */}
      <div className="arcade-shell app-safe-container">
        {/* ヘッダー */}
        <Header
          mode={mode}
          isPlaying={isPlaying}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* メイン領域：PCでは左に盤面、右にスコア＆操作パネルを配置 */}
        <div className="arcade-grid">
          {/* 大型デジタル表示パネル */}
          <div className="arcade-score w-full">
            <ScoreBoard
              score={score}
              timeLeft={timeLeft}
              combo={combo}
              mode={mode}
              currentRule={currentRule}
              isPanicTime={isPanicTime}
              isPlaying={isPlaying}
            />
          </div>

          {/* メインプレイフィールド: 3×3 穴 (モグラがしっかり飛び出す正方形盤面) */}
          <div className="arcade-playfield w-full">
            <PlayField holes={holes} onWhack={whackMole} />
          </div>

          {/* フッター操作バー */}
          <div className="arcade-controls w-full">
            <FooterControls
              isPlaying={isPlaying}
              speed={speed}
              mode={mode}
              onChangeSpeed={setSpeed}
              onChangeMode={setMode}
              onStart={startGame}
              onStop={stopGame}
            />
          </div>
        </div>
      </div>

      {/* 自動消去ビッグポップアップ（Grace Pause） */}
      <RuleSwitchPopup popup={popup} />

      {/* リザルト画面（Top 10 スコア履歴 ＆ 今回順位ハイライト） */}
      {isGameOver && (
        <ResultScreen
          score={score}
          maxCombo={maxCombo}
          hits={hits}
          misses={misses}
          rankingResult={rankingResult}
          onRestart={startGame}
          onHome={stopGame}
        />
      )}

      {/* 遊び方ガイドモーダル */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
