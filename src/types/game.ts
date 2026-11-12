// ゲームモードと速度設定
export type GameMode = 'classic' | 'brain';
export type SpeedPreset = 'slow' | 'normal' | 'fast';

// モグラ種別
export type MoleType = 'NORMAL' | 'GOLD' | 'HELMET' | 'BOMB';

// モグラの色バリエーション（色指定脳トレ対応）
export type MoleColor = 'BROWN' | 'BLUE' | 'YELLOW' | 'GREEN' | 'PINK';

// 脳トレお題定義
export type BrainRuleId =
  | 'EVEN'
  | 'ODD'
  | 'GTE5'
  | 'LTE4'
  | 'COLOR_BLUE'
  | 'COLOR_YELLOW'
  | 'COLOR_GREEN'
  | 'COLOR_PINK';

export interface BrainRule {
  id: BrainRuleId;
  ruleType: 'NUMBER' | 'COLOR';
  shortTitle: string;      // 例: "【 偶 数 】を叩け！" または "【 青 色 】を叩け！"
  popupSubtitle: string;   // 例: "青いモグラだけを狙って叩こう！"
  sampleBadges: string[];  // 例: ["🟦", "青モグラ"]
  validate: (value: number | null, color?: MoleColor) => boolean;
}

// 各穴（ホール）の状態
export interface HoleState {
  index: number;           // 0 〜 8 (3x3)
  isActive: boolean;       // 現在顔を出しているか
  moleType: MoleType;
  moleColor?: MoleColor;   // モグラの体色
  hp: number;              // 通常1、ヘルメットは2
  numberLabel: number | null; // 脳トレモード時の表示数字 (1〜9)
  isTarget: boolean;       // 叩くべき正解ターゲットか（falseなら叩くとお手つき）
  isWhacked: boolean;      // 撃破アニメーション中か
  hitScoreEffect?: { text: string; isPositive: boolean; key: number };
}

// 自動消去ポップアップ状態
export interface RulePopupState {
  isVisible: boolean;
  badgeText: string;       // "⚡ ルール変更！" または "🔥 パニックタイム！"
  mainTitle: string;       // "次は【 奇 数 】を叩け！"
  subSubtitle: string;     // 詳細ガイド
  subSamples: string[];    // ["1", "3", "5", "7", "9"]
  theme: 'cyan' | 'amber' | 'red';
  durationMs: number;
}

// スコア履歴（Top 10 ランキング）定義 (v1.1)
export interface ScoreRecord {
  id: string;              // プレイごとの一意識別子 (例: `run_${Date.now()}`)
  score: number;           // 獲得スコア
  maxCombo: number;        // 最大コンボ数
  hits: number;
  misses: number;
  mode: GameMode;          // プレイしたモード
  speed: SpeedPreset;      // 速度設定
  playedAt: string;        // 表示用日時文字列 (例: "11/12 12:30")
  timestamp?: number;      // ミリ秒エポック秒（厳密な一意判定・ソート用）
}

export interface RankingResult {
  currentRunId: string;        // 今回のレコードID（ハイライト照合用）
  rank: number | null;         // 今回の順位（1〜10位。圏外の場合は null）
  pointsToEnterTop10: number;  // 圏外の場合、10位に入るためにあと何点必要だったか
  top10List: ScoreRecord[];    // 保存されている最新Top 10配列（最大10件）
}

// ゲーム全体ステート
export interface GameState {
  mode: GameMode;
  speed: SpeedPreset;
  isPlaying: boolean;
  isPaused: boolean;
  isRuleSwitching: boolean; // ポップアップ表示中の一時猶予ポーズフラグ
  isPanicTime: boolean;
  isGameOver: boolean;
  score: number;
  timeLeft: number;
  combo: number;
  maxCombo: number;
  hits: number;
  misses: number;
  noGoAvoided: number;
  currentRule: BrainRule | null;
  popup: RulePopupState;
  holes: HoleState[];
  rankingResult: RankingResult | null;
  soundEnabled: boolean;
}
