import { Tile, GameSettings, CalculationResult, FanType } from '../types';

/**
 * 台灣麻將計台引擎
 */
export const calculateFan = (
  handTiles: Tile[],
  exposedTiles: Tile[],
  settings: GameSettings
): CalculationResult => {
  const fanTypes: FanType[] = [];

  // 過濾花牌
  const handWithoutFlower = handTiles.filter(tile => tile.type !== 'flower');
  const exposedWithoutFlower = exposedTiles.filter(tile => tile.type !== 'flower');
  const allTiles = [...handWithoutFlower, ...exposedWithoutFlower];
  const flowerTiles = [...handTiles, ...exposedTiles].filter(tile => tile.type === 'flower');

  // 檢查門清（手牌沒有吃碰槓）
  const isMenQing = exposedWithoutFlower.length === 0;

  // ========== 基本台 ==========

  // 自摸 1台
  if (settings.winType === 'selfDraw') {
    fanTypes.push({
      name: '自摸',
      fan: 1,
      description: '自己摸到胡牌',
      reason: '胡牌方式為自摸'
    });
  }

  // 門清 1台（自摸時才算）
  if (isMenQing && settings.winType === 'selfDraw') {
    fanTypes.push({
      name: '門清',
      fan: 1,
      description: '沒有吃碰槓，自摸胡牌',
      reason: '手牌無吃碰槓'
    });
  }

  // 無花 1台（沒有任何花牌）
  if (flowerTiles.length === 0) {
    fanTypes.push({
      name: '無花',
      fan: 1,
      description: '沒有任何花牌',
      reason: '無花牌'
    });
  }

  // ========== 莊家台 ==========

  // 莊家 1台
  if (settings.isDealer) {
    fanTypes.push({
      name: '莊家',
      fan: 1,
      description: '莊家身份',
      reason: '本局為莊家'
    });
  }

  // 連莊 N台（每連1次+1台）
  if (settings.isDealer && settings.dealerStreak > 0) {
    fanTypes.push({
      name: `連莊 ${settings.dealerStreak}`,
      fan: settings.dealerStreak,
      description: `連續當莊 ${settings.dealerStreak} 次`,
      reason: `連莊 ${settings.dealerStreak} 次`
    });
  }

  // ========== 花牌台 ==========
  const flowerFans = calculateFlowerFans(flowerTiles, settings);
  fanTypes.push(...flowerFans);

  // ========== 風牌台 ==========
  const windFans = calculateWindFans(allTiles, settings);
  fanTypes.push(...windFans);

  // ========== 三元台（中發白）==========
  const dragonFans = calculateDragonFans(allTiles);
  fanTypes.push(...dragonFans);

  // ========== 槓牌台 ==========
  const kongFans = calculateKongFans(handWithoutFlower, exposedWithoutFlower, settings);
  fanTypes.push(...kongFans);

  // ========== 特殊牌型台 ==========
  const patternFans = calculatePatternFans(allTiles, handWithoutFlower, exposedWithoutFlower);
  fanTypes.push(...patternFans);

  // ========== 計算總台數 ==========
  const totalFan = fanTypes.reduce((sum, fanType) => sum + fanType.fan, 0);

  // ========== 計算金額 ==========
  const payment = calculatePayment(totalFan, settings);

  // ========== 生成計算公式 ==========
  const formula = generateFormula(totalFan, settings, payment);

  return {
    fanTypes,
    totalFan,
    basePayment: settings.baseAmount,
    payment,
    formula
  };
};

/**
 * 計算花牌台
 */
const calculateFlowerFans = (flowerTiles: Tile[], settings: GameSettings): FanType[] => {
  const fans: FanType[] = [];

  if (flowerTiles.length === 0) return fans;

  // 正花 1台（座位對應的花：東-春梅，南-夏蘭，西-秋菊，北-冬竹）
  const seatFlowerMap: Record<string, string[]> = {
    east: ['spring', 'plum'],
    south: ['summer', 'orchid'],
    west: ['autumn', 'chrysanthemum'],
    north: ['winter', 'bamboo']
  };

  const correctFlowers = seatFlowerMap[settings.seatWind];
  const hasCorrectFlower = flowerTiles.some(tile =>
    correctFlowers.includes(tile.value as string)
  );

  if (hasCorrectFlower) {
    const flowerNames = flowerTiles
      .filter(tile => correctFlowers.includes(tile.value as string))
      .map(tile => tile.display)
      .join('、');

    fans.push({
      name: '正花',
      fan: 1,
      description: '拿到座位對應的花牌',
      reason: `${settings.seatWind === 'east' ? '東' : settings.seatWind === 'south' ? '南' : settings.seatWind === 'west' ? '西' : '北'}家正花：${flowerNames}`
    });
  }

  // 四花 2台（四季或四君子其中一組集滿）
  const seasonFlowers = ['spring', 'summer', 'autumn', 'winter'];
  const plantFlowers = ['plum', 'orchid', 'chrysanthemum', 'bamboo'];

  const hasAllSeasons = seasonFlowers.every(flower =>
    flowerTiles.some(tile => tile.value === flower)
  );
  const hasAllPlants = plantFlowers.every(flower =>
    flowerTiles.some(tile => tile.value === flower)
  );

  if (hasAllSeasons) {
    fans.push({
      name: '四季（四花）',
      fan: 2,
      description: '集滿春夏秋冬',
      reason: '春夏秋冬四季齊全'
    });
  }

  if (hasAllPlants) {
    fans.push({
      name: '四君子（四花）',
      fan: 2,
      description: '集滿梅蘭菊竹',
      reason: '梅蘭菊竹四君子齊全'
    });
  }

  // 八花 8台（集滿所有花牌）
  if (flowerTiles.length === 8) {
    fans.push({
      name: '八花',
      fan: 8,
      description: '集滿所有8張花牌',
      reason: '八張花牌齊全'
    });
  }

  return fans;
};

/**
 * 計算風牌台
 */
const calculateWindFans = (tiles: Tile[], settings: GameSettings): FanType[] => {
  const fans: FanType[] = [];

  // 統計每種風牌的數量
  const windCounts: Record<string, number> = {
    east: 0,
    south: 0,
    west: 0,
    north: 0
  };

  tiles.forEach(tile => {
    if (tile.type === 'wind') {
      windCounts[tile.value as string]++;
    }
  });

  // 圈風刻 1台
  if (windCounts[settings.roundWind] >= 3) {
    const windName = settings.roundWind === 'east' ? '東' : settings.roundWind === 'south' ? '南' : settings.roundWind === 'west' ? '西' : '北';
    fans.push({
      name: `圈風 ${windName}`,
      fan: 1,
      description: `圈風${windName}的刻子`,
      reason: `${windName}為圈風，有${windCounts[settings.roundWind]}張`
    });
  }

  // 門風刻 1台
  if (windCounts[settings.seatWind] >= 3) {
    const windName = settings.seatWind === 'east' ? '東' : settings.seatWind === 'south' ? '南' : settings.seatWind === 'west' ? '西' : '北';
    fans.push({
      name: `門風 ${windName}`,
      fan: 1,
      description: `門風${windName}的刻子`,
      reason: `${windName}為門風，有${windCounts[settings.seatWind]}張`
    });
  }

  // 雙風刻 1台（圈風=門風時，只算1台雙風，不重複計算）
  if (settings.roundWind === settings.seatWind && windCounts[settings.roundWind] >= 3) {
    // 移除圈風和門風台，改為雙風台
    const windName = settings.roundWind === 'east' ? '東' : settings.roundWind === 'south' ? '南' : settings.roundWind === 'west' ? '西' : '北';

    // 先移除已經加入的圈風和門風台（需要反向移除避免索引問題）
    for (let i = fans.length - 1; i >= 0; i--) {
      if (fans[i].name === `圈風 ${windName}` || fans[i].name === `門風 ${windName}`) {
        fans.splice(i, 1);
      }
    }

    fans.push({
      name: `雙風 ${windName}`,
      fan: 1,
      description: `${windName}同時為圈風和門風`,
      reason: `${windName}為雙風（圈風+門風）`
    });
  }

  // 三風刻 4台（有三種風的刻子）
  const windWithMeld = Object.entries(windCounts).filter(([_, count]) => count >= 3);
  if (windWithMeld.length === 3) {
    fans.push({
      name: '三風刻',
      fan: 4,
      description: '有三種風牌的刻子',
      reason: `${windWithMeld.map(([wind]) => wind === 'east' ? '東' : wind === 'south' ? '南' : wind === 'west' ? '西' : '北').join('、')}三種風刻`
    });
  }

  // 大四喜 16台（四種風都有刻子）
  if (windWithMeld.length === 4) {
    fans.push({
      name: '大四喜',
      fan: 16,
      description: '四種風牌都有刻子',
      reason: '東南西北四風刻齊全'
    });
  }

  // 小四喜 8台（三種風刻+一種風對）
  const windPairs = Object.entries(windCounts).filter(([_, count]) => count === 2);
  if (windWithMeld.length === 3 && windPairs.length >= 1) {
    fans.push({
      name: '小四喜',
      fan: 8,
      description: '三種風刻加一種風對',
      reason: '三種風刻 + 一種風對'
    });
  }

  return fans;
};

/**
 * 計算三元台（中發白）
 */
const calculateDragonFans = (tiles: Tile[]): FanType[] => {
  const fans: FanType[] = [];

  // 統計三元牌數量
  const dragonCounts: Record<string, number> = {
    white: 0,
    green: 0,
    red: 0
  };

  tiles.forEach(tile => {
    if (tile.type === 'dragon') {
      dragonCounts[tile.value as string]++;
    }
  });

  // 中/發/白 各1台（刻子）
  if (dragonCounts.red >= 3) {
    fans.push({
      name: '紅中',
      fan: 1,
      description: '紅中刻子',
      reason: `紅中有${dragonCounts.red}張`
    });
  }

  if (dragonCounts.green >= 3) {
    fans.push({
      name: '青發',
      fan: 1,
      description: '青發刻子',
      reason: `青發有${dragonCounts.green}張`
    });
  }

  if (dragonCounts.white >= 3) {
    fans.push({
      name: '白板',
      fan: 1,
      description: '白板刻子',
      reason: `白板有${dragonCounts.white}張`
    });
  }

  // 小三元 4台（兩種三元刻+一種對）
  const dragonMelds = Object.values(dragonCounts).filter(count => count >= 3);
  const dragonPairs = Object.values(dragonCounts).filter(count => count === 2);

  if (dragonMelds.length === 2 && dragonPairs.length >= 1) {
    fans.push({
      name: '小三元',
      fan: 4,
      description: '兩種三元刻加一種對',
      reason: '中發白中兩種刻子 + 一種對子'
    });
  }

  // 大三元 8台（三種都是刻子）
  if (dragonMelds.length === 3) {
    fans.push({
      name: '大三元',
      fan: 8,
      description: '中發白都是刻子',
      reason: '中發白三種刻子齊全'
    });
  }

  return fans;
};

/**
 * 計算槓牌台
 */
const calculateKongFans = (handTiles: Tile[], exposedTiles: Tile[], settings: GameSettings): FanType[] => {
  const fans: FanType[] = [];

  // 統計手牌中的槓（4張相同）
  const handCounts = new Map<string, number>();
  handTiles.forEach(tile => {
    handCounts.set(tile.id, (handCounts.get(tile.id) || 0) + 1);
  });

  // 暗槓：手牌中有4張相同的牌
  handCounts.forEach((count, tileId) => {
    if (count === 4) {
      const tile = handTiles.find(t => t.id === tileId);
      fans.push({
        name: '暗槓',
        fan: 1,
        description: '手牌中有四張相同的牌',
        reason: `${tile?.display || tileId} 暗槓`
      });
    }
  });

  // 統計門前牌中的槓（4張相同）
  const exposedCounts = new Map<string, number>();
  exposedTiles.forEach(tile => {
    exposedCounts.set(tile.id, (exposedCounts.get(tile.id) || 0) + 1);
  });

  // 明槓：門前牌中有4張相同的牌
  exposedCounts.forEach((count, tileId) => {
    if (count === 4) {
      const tile = exposedTiles.find(t => t.id === tileId);
      fans.push({
        name: '明槓',
        fan: 1,
        description: '門前有四張相同的牌',
        reason: `${tile?.display || tileId} 明槓`
      });
    }
  });

  // 槓上開花 1台
  if (settings.isKongWin) {
    fans.push({
      name: '槓上開花',
      fan: 1,
      description: '槓牌後自摸胡牌',
      reason: '槓後立即自摸胡牌'
    });
  }

  // 搶槓 1台
  if (settings.isRobbingKong) {
    fans.push({
      name: '搶槓',
      fan: 1,
      description: '別人加槓時胡那張牌',
      reason: '搶槓胡牌'
    });
  }

  return fans;
};

/**
 * 計算特殊牌型台
 */
const calculatePatternFans = (
  allTiles: Tile[],
  handTiles: Tile[],
  exposedTiles: Tile[]
): FanType[] => {
  const fans: FanType[] = [];

  // 七對子 4台
  if (isSevenPairs(allTiles)) {
    fans.push({
      name: '七對子',
      fan: 4,
      description: '七個對子',
      reason: '手牌為七個對子'
    });
  }

  // 對對胡 2台（4組都是刻子，不含七對）
  if (!isSevenPairs(allTiles) && isAllMelds(allTiles)) {
    fans.push({
      name: '對對胡',
      fan: 2,
      description: '四組都是刻子',
      reason: '全部為刻子或槓子'
    });
  }

  // 平胡 0台（全部是順子+雜牌對，最低胡法）
  // 這個只是標記，不加分

  // 混一色 4台（單一花色+字牌）
  const colorResult = checkColor(allTiles);
  if (colorResult.isMixed) {
    fans.push({
      name: '混一色',
      fan: 4,
      description: '單一數牌花色配字牌',
      reason: `全為${colorResult.suit}和字牌`
    });
  }

  // 清一色 8台（單一數牌花色，無字牌）
  if (colorResult.isPure) {
    fans.push({
      name: '清一色',
      fan: 8,
      description: '全部同一花色數牌',
      reason: `全為${colorResult.suit}`
    });
  }

  // 字一色 16台（全部是字牌）
  if (colorResult.isHonor) {
    fans.push({
      name: '字一色',
      fan: 16,
      description: '全部是風牌和三元牌',
      reason: '全為風牌或三元牌'
    });
  }

  // 全求人 2台（全部吃碰，只剩一張單釣）
  if (handTiles.length === 2 && exposedTiles.length === 15) {
    fans.push({
      name: '全求人',
      fan: 2,
      description: '手牌只剩一對，其餘都是吃碰',
      reason: '手牌僅剩2張'
    });
  }

  // 獨聽 1台（單吊一張）
  // 這個需要額外資訊，暫時不實作

  return fans;
};

/**
 * 檢查是否為七對子
 */
const isSevenPairs = (tiles: Tile[]): boolean => {
  if (tiles.length !== 14) return false;

  const counts = new Map<string, number>();
  tiles.forEach(tile => {
    counts.set(tile.id, (counts.get(tile.id) || 0) + 1);
  });

  return counts.size === 7 && Array.from(counts.values()).every(c => c === 2);
};

/**
 * 檢查是否全部為刻子（對對胡）
 */
const isAllMelds = (tiles: Tile[]): boolean => {
  const counts = new Map<string, number>();
  tiles.forEach(tile => {
    counts.set(tile.id, (counts.get(tile.id) || 0) + 1);
  });

  // 除了一個對子外，其他都是3張或4張
  const groups = Array.from(counts.values()).sort();

  // 17張的情況：應該要有5個刻子+1個對子 = 可能是 2,3,3,3,3,3
  // 14張的情況：應該要有4個刻子+1個對子 = 可能是 2,3,3,3,3

  const pairs = groups.filter(c => c === 2).length;
  const melds = groups.filter(c => c === 3 || c === 4).length;

  return pairs === 1 && melds >= 4;
};

/**
 * 檢查花色（清一色、混一色、字一色）
 */
const checkColor = (tiles: Tile[]): {
  isPure: boolean;
  isMixed: boolean;
  isHonor: boolean;
  suit: string;
} => {
  const suits = new Set<string>();
  let hasHonor = false;

  tiles.forEach(tile => {
    if (tile.type === 'wind' || tile.type === 'dragon') {
      hasHonor = true;
    } else {
      suits.add(tile.type);
    }
  });

  // 字一色：全是字牌
  if (suits.size === 0 && hasHonor) {
    return { isPure: false, isMixed: false, isHonor: true, suit: '字牌' };
  }

  // 清一色：單一花色，無字牌
  if (suits.size === 1 && !hasHonor) {
    const suit = Array.from(suits)[0];
    const suitName = suit === 'wan' ? '萬' : suit === 'tiao' ? '條' : '筒';
    return { isPure: true, isMixed: false, isHonor: false, suit: suitName };
  }

  // 混一色：單一花色+字牌
  if (suits.size === 1 && hasHonor) {
    const suit = Array.from(suits)[0];
    const suitName = suit === 'wan' ? '萬' : suit === 'tiao' ? '條' : '筒';
    return { isPure: false, isMixed: true, isHonor: false, suit: suitName };
  }

  return { isPure: false, isMixed: false, isHonor: false, suit: '' };
};

/**
 * 計算金額
 */
const calculatePayment = (totalFan: number, settings: GameSettings) => {
  const { baseAmount, fanAmount, winType, isDealer } = settings;

  // 基本計算：底 + (台數 × 每台)
  const totalAmount = baseAmount + (totalFan * fanAmount);

  if (winType === 'selfDraw') {
    // 自摸：三家各付
    // 如果是莊家自摸，閒家多付1倍
    const perPlayer = isDealer ? totalAmount * 2 : totalAmount;
    const total = perPlayer * 3;

    return {
      selfDrawPayment: {
        perPlayer,
        total
      }
    };
  } else {
    // 胡別人：放槍者全付
    // 如果莊家胡閒家，閒家付2倍
    // 如果閒家胡莊家，莊家付2倍
    const loser = totalAmount * (isDealer ? 2 : 1);

    return {
      discardPayment: {
        loser
      }
    };
  }
};

/**
 * 生成計算公式
 */
const generateFormula = (
  totalFan: number,
  settings: GameSettings,
  payment: any
): string => {
  const { baseAmount, fanAmount, winType, isDealer } = settings;

  const base = `${baseAmount}元（底）+ ${totalFan}台 × ${fanAmount}元`;
  const total = baseAmount + (totalFan * fanAmount);

  if (winType === 'selfDraw') {
    if (isDealer) {
      return `${base} = ${total}元\n莊家自摸 × 2倍 = ${total * 2}元/家 × 3家 = ${payment.selfDrawPayment.total}元`;
    } else {
      return `${base} = ${total}元 × 3家 = ${payment.selfDrawPayment.total}元`;
    }
  } else {
    if (isDealer) {
      return `${base} = ${total}元\n莊家胡牌 × 2倍 = ${payment.discardPayment.loser}元（放槍者付）`;
    } else {
      return `${base} = ${payment.discardPayment.loser}元（放槍者付）`;
    }
  }
};
