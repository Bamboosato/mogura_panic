import type { ScoreRecord, RankingResult, GameMode, SpeedPreset } from '../types/game';

const STORAGE_KEY = 'mogura_panic_top10_v1';

// 重複した誤登録レコードをクリーンアップするヘルパー
function deduplicateScores(list: ScoreRecord[]): ScoreRecord[] {
  const seen = new Set<string>();
  const cleaned: ScoreRecord[] = [];

  for (const item of list) {
    // プレイごとの一意IDで重複排除（同一IDの二重書き込みを確実に防止）
    // 古いレコード等の互換性のため、IDが無い場合はタイムスタンプやシグネチャをフォールバックとして利用
    const key = item.id || `${item.score}_${item.timestamp ?? item.playedAt}_${item.hits}_${item.misses}_${item.mode}`;
    if (!seen.has(key)) {
      seen.add(key);
      cleaned.push(item);
    }
  }
  return cleaned;
}

export function getTop10Scores(): ScoreRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list: ScoreRecord[] = JSON.parse(raw);
    if (Array.isArray(list)) {
      const deduplicated = deduplicateScores(list);
      if (deduplicated.length !== list.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(deduplicated));
      }
      return deduplicated;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveAndEvaluateScore(params: {
  score: number;
  maxCombo: number;
  hits: number;
  misses: number;
  mode: GameMode;
  speed: SpeedPreset;
}): RankingResult {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const playedAt = `${month}/${day} ${hours}:${minutes}`;

  const timestamp = Date.now();
  const currentRunId = `run_${timestamp}_${Math.random().toString(36).slice(2, 7)}`;

  const currentRecord: ScoreRecord = {
    id: currentRunId,
    score: params.score,
    maxCombo: params.maxCombo,
    hits: params.hits,
    misses: params.misses,
    mode: params.mode,
    speed: params.speed,
    playedAt,
    timestamp,
  };

  const existing = getTop10Scores();

  // 同点の場合は今回の記録を上位にするため、既存リストと結合してソート
  const merged = [...existing, currentRecord].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (a.id === currentRunId) return -1;
    if (b.id === currentRunId) return 1;
    return 0;
  });

  // 今回の順位を特定 (1-indexed)
  const rankIndex = merged.findIndex((rec) => rec.id === currentRunId);
  const rank = rankIndex >= 0 && rankIndex < 10 ? rankIndex + 1 : null;

  // 上位10件のみ保存
  const top10 = merged.slice(0, 10);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(top10));
  } catch {
    // quota exceeded etc.
  }

  // 10位に入るためにあと何点必要だったか
  let pointsToEnterTop10 = 0;
  if (rank === null) {
    const tenthScore = top10.length >= 10 ? top10[9].score : 0;
    pointsToEnterTop10 = Math.max(0, tenthScore - params.score);
  }

  return {
    currentRunId,
    rank,
    pointsToEnterTop10,
    top10List: top10,
  };
}
