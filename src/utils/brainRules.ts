import type { BrainRule, MoleColor } from '../types/game';

export const BRAIN_RULES: BrainRule[] = [
  // 1. 数字ルール
  {
    id: 'EVEN',
    ruleType: 'NUMBER',
    shortTitle: '【 偶 数 】を叩け！',
    popupSubtitle: '２・４・６・８ のモグラだけ叩こう！',
    sampleBadges: ['2', '4', '6', '8'],
    validate: (val: number | null) => (val !== null ? val % 2 === 0 : false),
  },
  {
    id: 'ODD',
    ruleType: 'NUMBER',
    shortTitle: '【 奇 数 】を叩け！',
    popupSubtitle: '１・３・５・７・９ のモグラだけ叩こう！',
    sampleBadges: ['1', '3', '5', '7', '9'],
    validate: (val: number | null) => (val !== null ? val % 2 === 1 : false),
  },
  {
    id: 'GTE5',
    ruleType: 'NUMBER',
    shortTitle: '【 ５ 以上 】を叩け！',
    popupSubtitle: '５・６・７・８・９ のモグラだけ叩こう！',
    sampleBadges: ['5', '6', '7', '8', '9'],
    validate: (val: number | null) => (val !== null ? val >= 5 : false),
  },
  {
    id: 'LTE4',
    ruleType: 'NUMBER',
    shortTitle: '【 ４ 以下 】を叩け！',
    popupSubtitle: '１・２・３・４ のモグラだけ叩こう！',
    sampleBadges: ['1', '2', '3', '4'],
    validate: (val: number | null) => (val !== null ? val <= 4 : false),
  },
  // 2. 直感的な色指定ルール（足して10の代替：シニアやお子様でも瞬時に判断可能）
  {
    id: 'COLOR_BLUE',
    ruleType: 'COLOR',
    shortTitle: '【 青 色 】を叩け！',
    popupSubtitle: '青い色のモグラだけを狙って叩こう！',
    sampleBadges: ['🟦', '青モグラ'],
    validate: (_val, color?: MoleColor) => color === 'BLUE',
  },
  {
    id: 'COLOR_YELLOW',
    ruleType: 'COLOR',
    shortTitle: '【 黄 色 】を叩け！',
    popupSubtitle: '黄色いモグラだけを狙って叩こう！',
    sampleBadges: ['🟨', '黄モグラ'],
    validate: (_val, color?: MoleColor) => color === 'YELLOW',
  },
  {
    id: 'COLOR_GREEN',
    ruleType: 'COLOR',
    shortTitle: '【 緑 色 】を叩け！',
    popupSubtitle: '緑色のモグラだけを狙って叩こう！',
    sampleBadges: ['🟩', '緑モグラ'],
    validate: (_val, color?: MoleColor) => color === 'GREEN',
  },
  {
    id: 'COLOR_PINK',
    ruleType: 'COLOR',
    shortTitle: '【 ピンク 】を叩け！',
    popupSubtitle: 'ピンク色のモグラだけを狙って叩こう！',
    sampleBadges: ['🌸', '桃モグラ'],
    validate: (_val, color?: MoleColor) => color === 'PINK',
  },
];

export function getRandomRule(currentRuleId?: string): BrainRule {
  const filtered = currentRuleId ? BRAIN_RULES.filter((r) => r.id !== currentRuleId) : BRAIN_RULES;
  return filtered[Math.floor(Math.random() * filtered.length)];
}
