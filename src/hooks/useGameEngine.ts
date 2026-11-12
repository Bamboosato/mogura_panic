import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  GameMode,
  SpeedPreset,
  MoleType,
  MoleColor,
  BrainRule,
  HoleState,
  RulePopupState,
  RankingResult,
} from '../types/game';
import { getRandomRule } from '../utils/brainRules';
import { sound } from '../utils/sound';
import { saveAndEvaluateScore } from '../utils/ranking';

const GAME_DURATION = 45; // 45秒

const SPEED_CONFIG: Record<
  SpeedPreset,
  { stayTime: number; panicStayTime: number; maxActive: number }
> = {
  slow: { stayTime: 1800, panicStayTime: 1300, maxActive: 2 },
  normal: { stayTime: 1250, panicStayTime: 850, maxActive: 3 },
  fast: { stayTime: 850, panicStayTime: 550, maxActive: 4 },
};

const INITIAL_HOLES: HoleState[] = Array.from({ length: 9 }, (_, index) => ({
  index,
  isActive: false,
  moleType: 'NORMAL',
  hp: 1,
  numberLabel: null,
  isTarget: true,
  isWhacked: false,
}));

export function useGameEngine() {
  const [mode, setMode] = useState<GameMode>('classic');
  const [speed, setSpeed] = useState<SpeedPreset>('normal');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRuleSwitching, setIsRuleSwitching] = useState(false);
  const [isPanicTime, setIsPanicTime] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [noGoAvoided, setNoGoAvoided] = useState(0);
  const [currentRule, setCurrentRule] = useState<BrainRule | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [holes, setHoles] = useState<HoleState[]>(INITIAL_HOLES);
  const [rankingResult, setRankingResult] = useState<RankingResult | null>(null);

  const [popup, setPopup] = useState<RulePopupState>({
    isVisible: false,
    badgeText: '',
    mainTitle: '',
    subSubtitle: '',
    subSamples: [],
    theme: 'cyan',
    durationMs: 1500,
  });

  // タイマー等の参照
  const moleTimersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextRuleSwitchTimeRef = useRef<number>(30); // 脳トレモードの次のルール変更秒 (45 -> 30 -> 15)
  const isEndingRef = useRef<boolean>(false);

  // 最新の成績を確実に保持するRef
  const statsRef = useRef({ score: 0, maxCombo: 0, hits: 0, misses: 0 });
  useEffect(() => {
    statsRef.current = { score, maxCombo, hits, misses };
  }, [score, maxCombo, hits, misses]);

  // 全てのモグラタイマーを確実に破棄して穴に引っ込める
  const clearAllMoles = useCallback(() => {
    Object.values(moleTimersRef.current).forEach((t) => clearTimeout(t));
    moleTimersRef.current = {};
    setHoles((prev) =>
      prev.map((h) => ({
        ...h,
        isActive: false,
        isWhacked: false,
      }))
    );
  }, []);

  // アンマウント時のタイマークリーンアップを徹底
  useEffect(() => {
    return () => {
      Object.values(moleTimersRef.current).forEach((t) => clearTimeout(t));
      moleTimersRef.current = {};
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, []);

  // サウンドのオンオフ切り替え
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      sound.enabled = next;
      return next;
    });
  }, []);

  // 自動消去ポップアップ＆一時猶予ポーズ（Grace Pause）
  const triggerGracePausePopup = useCallback(
    (params: {
      badgeText: string;
      mainTitle: string;
      subSubtitle: string;
      subSamples: string[];
      theme: 'cyan' | 'amber' | 'red';
      onComplete?: () => void;
    }) => {
      setIsRuleSwitching(true);
      clearAllMoles();

      if (params.theme === 'red') {
        sound.playPanicAlert();
      } else {
        sound.playRuleChange();
      }

      setPopup({
        isVisible: true,
        badgeText: params.badgeText,
        mainTitle: params.mainTitle,
        subSubtitle: params.subSubtitle,
        subSamples: params.subSamples,
        theme: params.theme,
        durationMs: 1500,
      });

      // 既存のポップアップタイマーがあればクリア
      if (popupTimerRef.current) {
        clearTimeout(popupTimerRef.current);
      }

      // 1.5秒後に自動消去＆再開
      popupTimerRef.current = setTimeout(() => {
        popupTimerRef.current = null;
        setPopup((prev) => ({ ...prev, isVisible: false }));
        setIsRuleSwitching(false);
        if (params.onComplete) {
          params.onComplete();
        }
      }, 1500);
    },
    [clearAllMoles]
  );

  // ゲーム終了処理
  const endGame = useCallback(() => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;

    setIsPlaying(false);
    setIsGameOver(true);
    clearAllMoles();

    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
      popupTimerRef.current = null;
    }
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);

    sound.playGameOver();

    // Top 10 ランキング判定と永続化（StrictMode の 2重実行を防ぐため Ref から直接 1回のみ保存）
    const { score: finalScore, maxCombo: finalMaxCombo, hits: finalHits, misses: finalMisses } = statsRef.current;
    const result = saveAndEvaluateScore({
      score: finalScore,
      maxCombo: finalMaxCombo,
      hits: finalHits,
      misses: finalMisses,
      mode,
      speed,
    });
    setRankingResult(result);
  }, [clearAllMoles, mode, speed]);

  // ゲーム開始処理（もう1回プレイ時も呼ばれる）
  const startGame = useCallback(() => {
    isEndingRef.current = false;
    sound.unlock();
    clearAllMoles();

    setScore(0);
    setTimeLeft(GAME_DURATION);
    setCombo(0);
    setMaxCombo(0);
    setHits(0);
    setMisses(0);
    setNoGoAvoided(0);
    setIsPanicTime(false);
    setIsGameOver(false);
    setRankingResult(null);

    const initialRule = mode === 'brain' ? getRandomRule() : null;
    setCurrentRule(initialRule);
    nextRuleSwitchTimeRef.current = 30; // 30秒と15秒でルール変更

    if (mode === 'brain' && initialRule) {
      triggerGracePausePopup({
        badgeText: '🎯 スタート！',
        mainTitle: initialRule.shortTitle,
        subSubtitle: '',
        subSamples: [],
        theme: 'cyan',
        onComplete: () => {
          setIsPlaying(true);
        },
      });
    } else {
      setIsPlaying(true);
    }
  }, [clearAllMoles, mode, triggerGracePausePopup]);

  // ホームに戻る / 中断する（得点、残り時間、各種ステータスを初期状態にリセット）
  const stopGame = useCallback(() => {
    isEndingRef.current = false;
    setIsPlaying(false);
    setIsGameOver(false); // リザルト画面を確実に閉じる
    setRankingResult(null);
    clearAllMoles();
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
      popupTimerRef.current = null;
    }
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);

    // ホーム画面復帰時に得点・残り時間・各統計値をリセット
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setCombo(0);
    setMaxCombo(0);
    setHits(0);
    setMisses(0);
    setNoGoAvoided(0);
    setCurrentRule(null);
    setHoles(INITIAL_HOLES);
    setIsPanicTime(false);
    setIsRuleSwitching(false);
    statsRef.current = { score: 0, maxCombo: 0, hits: 0, misses: 0 };
  }, [clearAllMoles]);

  // モグラの出現ロジック
  const spawnMoles = useCallback(() => {
    if (!isPlaying || isRuleSwitching || isGameOver) return;

    setHoles((prevHoles) => {
      const activeCount = prevHoles.filter((h) => h.isActive).length;
      const config = SPEED_CONFIG[speed];
      const maxSpawn = isPanicTime ? config.maxActive + 1 : config.maxActive;

      if (activeCount >= maxSpawn) return prevHoles;

      // 空いている穴を抽出
      const inactiveIndices = prevHoles
        .map((h, i) => (!h.isActive ? i : -1))
        .filter((i) => i !== -1);

      if (inactiveIndices.length === 0) return prevHoles;

      // ランダムに1つ選出
      const targetIndex =
        inactiveIndices[Math.floor(Math.random() * inactiveIndices.length)];

      let moleType: MoleType = 'NORMAL';
      let moleColor: MoleColor = 'BROWN';
      let hp = 1;
      let numberLabel: number | null = null;
      let isTarget = true;

      if (mode === 'classic') {
        const rand = Math.random();
        if (rand < 0.15) {
          moleType = 'BOMB';
          isTarget = false; // 叩いてはいけない
        } else if (rand < 0.3) {
          moleType = 'GOLD';
        } else if (rand < 0.45) {
          moleType = 'HELMET';
          hp = 2;
        } else {
          moleType = 'NORMAL';
        }
      } else {
        // 脳トレモード
        const rand = Math.random();
        if (rand < 0.08) {
          // 爆弾も低確率で出現
          moleType = 'BOMB';
          isTarget = false;
        } else {
          moleType = 'NORMAL';
          // 1〜9の数字
          numberLabel = Math.floor(Math.random() * 9) + 1;

          // カラフルな体色を選出（出現比率の均等化：色ルール中も約50%が対象色になるよう重み付け）
          const COLORS: MoleColor[] = ['BLUE', 'YELLOW', 'GREEN', 'PINK', 'BROWN'];
          if (currentRule && currentRule.ruleType === 'COLOR') {
            const targetColorMatch = currentRule.id.replace('COLOR_', '') as MoleColor;
            // 50%の確率で正解のターゲット色、50%の確率でその他の色を出現させ、
            // 偶数・奇数など数字ルール（約50%出現）と難易度・出現機会を均等に保つ
            if (Math.random() < 0.5) {
              moleColor = targetColorMatch;
            } else {
              const otherColors = COLORS.filter((c) => c !== targetColorMatch);
              moleColor = otherColors[Math.floor(Math.random() * otherColors.length)];
            }
          } else {
            moleColor = COLORS[Math.floor(Math.random() * COLORS.length)];
          }

          // 現在のお題（数字 or 色）に従っているか判定
          isTarget = currentRule ? currentRule.validate(numberLabel, moleColor) : true;
        }
      }

      sound.playPop();

      // 滞在時間計算
      const baseStay = isPanicTime ? config.panicStayTime : config.stayTime;
      const stayTime =
        moleType === 'GOLD' ? Math.round(baseStay * 0.7) : baseStay;

      // 自動引っこみタイマー
      if (moleTimersRef.current[targetIndex]) {
        clearTimeout(moleTimersRef.current[targetIndex]);
      }
      moleTimersRef.current[targetIndex] = setTimeout(() => {
        delete moleTimersRef.current[targetIndex];
        setHoles((current) =>
          current.map((h, i) => {
            if (i === targetIndex && h.isActive && !h.isWhacked) {
              // 爆弾を叩かずに見送った場合は「ナイス回避」
              if (h.moleType === 'BOMB') {
                setNoGoAvoided((prev) => prev + 1);
              }
              return { ...h, isActive: false };
            }
            return h;
          })
        );
      }, stayTime);

      return prevHoles.map((h, i) => {
        if (i === targetIndex) {
          return {
            ...h,
            isActive: true,
            moleType,
            moleColor,
            hp,
            numberLabel,
            isTarget,
            isWhacked: false,
            hitScoreEffect: undefined,
          };
        }
        return h;
      });
    });
  }, [isPlaying, isRuleSwitching, isGameOver, speed, isPanicTime, mode, currentRule]);

  // モグラを叩く（Whack）処理
  const whackMole = useCallback(
    (index: number) => {
      if (!isPlaying || isRuleSwitching || isGameOver) return;

      setHoles((prevHoles) => {
        const target = prevHoles[index];
        if (!target.isActive || target.isWhacked) return prevHoles;

        let deltaScore = 0;
        let isSuccess = false;
        let effectText = '';
        const effectKey = Date.now();

        // 💣 爆弾を叩いてしまった場合
        if (target.moleType === 'BOMB') {
          sound.playMiss();
          deltaScore = -20;
          isSuccess = false;
          effectText = '💣 ドカン! -20';
          setCombo(0);
          setMisses((prev) => prev + 1);
        } else if (mode === 'brain') {
          // 脳トレモード判定（数字または色の一致を判定）
          const isCorrect = currentRule
            ? currentRule.validate(target.numberLabel, target.moleColor)
            : target.isTarget;

          if (isCorrect) {
            // 正解ターゲット
            sound.playHit();
            deltaScore = 20;
            isSuccess = true;
            effectText = '🎯 正解! +20';
            setHits((prev) => prev + 1);
            setCombo((c) => {
              const next = c + 1;
              setMaxCombo((mc) => Math.max(mc, next));
              return next;
            });
          } else {
            // お手つき
            sound.playMiss();
            deltaScore = -10;
            isSuccess = false;
            effectText = '✕ お手つき! -10';
            setCombo(0);
            setMisses((prev) => prev + 1);
          }
        } else {
          // エレメカモード
          if (target.moleType === 'HELMET' && target.hp === 2) {
            // ヘルメット1撃目
            sound.playHelmet();
            deltaScore = 5;
            isSuccess = true;
            effectText = '⛑️ ガン! +5';
            setHits((prev) => prev + 1);
            // 撃破せずhpを1にして残す
            setScore((s) => Math.max(0, s + deltaScore));
            return prevHoles.map((h, i) =>
              i === index
                ? {
                    ...h,
                    hp: 1,
                    hitScoreEffect: { text: effectText, isPositive: true, key: effectKey },
                  }
                : h
            );
          }

          // 撃破時
          sound.playHit();
          if (target.moleType === 'GOLD') {
            deltaScore = 30;
            effectText = '👑 +30';
          } else if (target.moleType === 'HELMET') {
            deltaScore = 20;
            effectText = '💥 +20';
          } else {
            deltaScore = 10;
            effectText = '+10';
          }
          isSuccess = true;
          setHits((prev) => prev + 1);
          setCombo((c) => {
            const next = c + 1;
            setMaxCombo((mc) => Math.max(mc, next));
            return next;
          });
        }

        // スコア加算
        setScore((s) => Math.max(0, s + deltaScore));

        // 撃破アニメーション＆一定時間後に引っ込める
        if (moleTimersRef.current[index]) {
          clearTimeout(moleTimersRef.current[index]);
        }
        moleTimersRef.current[index] = setTimeout(() => {
          delete moleTimersRef.current[index];
          setHoles((curr) =>
            curr.map((h, i) => (i === index ? { ...h, isActive: false, isWhacked: false } : h))
          );
        }, 220);

        return prevHoles.map((h, i) =>
          i === index
            ? {
                ...h,
                isWhacked: true,
                hitScoreEffect: {
                  text: effectText,
                  isPositive: isSuccess,
                  key: effectKey,
                },
              }
            : h
        );
      });
    },
    [isPlaying, isRuleSwitching, isGameOver, mode]
  );

  // メインゲームタイマー（1秒ごとカウントダウン）
  useEffect(() => {
    if (!isPlaying || isRuleSwitching) return;

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }

        const next = prev - 1;

        // エレメカモード: 残り15秒でパニックタイム突入
        if (mode === 'classic' && next === 15 && !isPanicTime) {
          setIsPanicTime(true);
          triggerGracePausePopup({
            badgeText: '🔥 パニックタイム！',
            mainTitle: '超高速ラッシュ突入！',
            subSubtitle: '',
            subSamples: [],
            theme: 'red',
          });
        }

        // 脳トレモード: 15秒ごとのルール変更
        if (mode === 'brain' && next === nextRuleSwitchTimeRef.current && next > 5) {
          const newRule = getRandomRule(currentRule?.id);
          setCurrentRule(newRule);
          nextRuleSwitchTimeRef.current = next - 15;

          triggerGracePausePopup({
            badgeText: '⚡ ルール変更！',
            mainTitle: newRule.shortTitle,
            subSubtitle: '',
            subSamples: [],
            theme: 'cyan',
          });
        }

        return next;
      });
    }, 1000);

    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [
    isPlaying,
    isRuleSwitching,
    mode,
    isPanicTime,
    currentRule,
    endGame,
    triggerGracePausePopup,
  ]);

  // モグラの定期出現ループ
  useEffect(() => {
    if (!isPlaying || isRuleSwitching) return;

    const intervalTime = isPanicTime ? 450 : 650;
    spawnTimerRef.current = setInterval(() => {
      spawnMoles();
    }, intervalTime);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [isPlaying, isRuleSwitching, isPanicTime, spawnMoles]);

  return {
    mode,
    speed,
    isPlaying,
    isRuleSwitching,
    isPanicTime,
    isGameOver,
    score,
    timeLeft,
    combo,
    maxCombo,
    hits,
    misses,
    noGoAvoided,
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
  };
}
