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
      {/* アーケード筐体コンテナ（iOS等のセーフエリアに確実に対応） */}
      <div className="w-full max-w-md sm:max-w-lg app-safe-container">
        {/* ヘッダー (約10%) */}
        <Header
          mode={mode}
          isPlaying={isPlaying}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* 大型デジタル表示パネル (約18%) */}
        <ScoreBoard
          score={score}
          timeLeft={timeLeft}
          combo={combo}
          mode={mode}
          currentRule={currentRule}
          isPanicTime={isPanicTime}
          isPlaying={isPlaying}
        />

        {/* メインプレイフィールド: 3×3 穴 (モグラがしっかり飛び出す正方形盤面) */}
        <PlayField holes={holes} onWhack={whackMole} />

        {/* フッター操作バー (約12%) */}
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
