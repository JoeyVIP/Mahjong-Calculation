// 麻將規則常數

// 標準手牌張數
export const STANDARD_HAND_SIZE = 17;

// 每種牌的最大數量
export const MAX_SAME_TILE = 4;

// 花牌總數
export const TOTAL_FLOWERS = 8;

// 常用底台組合
export const COMMON_BASE_CONFIGS = [
  { base: 50, fan: 20, label: '50/20' },
  { base: 100, fan: 20, label: '100/20' },
  { base: 100, fan: 50, label: '100/50' },
  { base: 200, fan: 50, label: '200/50' },
  { base: 300, fan: 100, label: '300/100' },
];

// 預設遊戲設定
export const DEFAULT_GAME_SETTINGS = {
  roundWind: 'east' as const,
  seatWind: 'east' as const,
  isDealer: false,
  dealerStreak: 0,
  winType: 'selfDraw' as const,
  isMenQing: true,
  baseAmount: 50,
  fanAmount: 20,
  isKongWin: false,
  isRobbingKong: false,
  isLastTileDraw: false,
  isLastTileDiscard: false,
  waitingType: 'none' as const,
  specialWin: 'none' as const,
  flowerCount: 0,
};

// 台種配置
export const FAN_CONFIGS = {
  // 基本台
  selfDraw: { name: '自摸', baseFan: 1 },
  menQing: { name: '門清', baseFan: 1 },
  noFlower: { name: '無花', baseFan: 1 },

  // 花相關
  flower: { name: '花', fanPerFlower: 1 },
  correctFlower: { name: '正花', fanPerFlower: 1 },
  allFlowers: { name: '八仙過海', baseFan: 8 },

  // 風相關
  roundWind: { name: '圈風', baseFan: 1 },
  seatWind: { name: '門風', baseFan: 1 },
  dealer: { name: '莊家', baseFan: 1 },

  // 牌型
  allPongs: { name: '對對胡', baseFan: 2 },
  threeConcealed: { name: '三暗刻', baseFan: 2 },
  mixedOneSuit: { name: '混一色', baseFan: 3 },
  pureOneSuit: { name: '清一色', baseFan: 4 },
  littleDragons: { name: '小三元', baseFan: 4 },
  fourConcealed: { name: '四暗刻', baseFan: 5 },
  bigDragons: { name: '大三元', baseFan: 8 },
  littleWinds: { name: '小四喜', baseFan: 8 },
  allHonors: { name: '字一色', baseFan: 8 },
  allTerminals: { name: '清么九', baseFan: 8 },
  bigWinds: { name: '大四喜', baseFan: 16 },

  // 特殊胡法
  kongWin: { name: '槓上開花', baseFan: 1 },
  lastTile: { name: '海底撈月', baseFan: 1 },
  robbingKong: { name: '搶槓胡', baseFan: 1 },
  heavenlyWin: { name: '天胡', baseFan: 16 },
  earthlyWin: { name: '地胡', baseFan: 16 },
};

// 莊家連莊台數計算：2N + 1
export const calculateDealerFan = (streak: number): number => {
  return 2 * streak + 1;
};
