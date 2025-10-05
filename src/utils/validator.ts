import { Tile, ValidationResult } from '../types';

/**
 * 驗證手牌是否為有效的胡牌
 */
export const validateHand = (handTiles: Tile[], exposedTiles: Tile[]): ValidationResult => {
  // 過濾掉花牌
  const handWithoutFlower = handTiles.filter(tile => tile.type !== 'flower');
  const exposedWithoutFlower = exposedTiles.filter(tile => tile.type !== 'flower');
  const allTiles = [...handWithoutFlower, ...exposedWithoutFlower];

  // 檢查總數：14張（已胡）、17張（含聽牌）、或更多（有槓的情況）
  // 有槓的時候：17 + 槓數，最多4個槓 = 17+4 = 21張
  if (allTiles.length < 14 || allTiles.length > 21) {
    return {
      isValid: false,
      errorMessage: `牌數錯誤：需要 14-21 張（不含花），目前 ${allTiles.length} 張`,
      details: {
        totalTiles: allTiles.length,
        requiredTiles: 17,
      },
    };
  }

  // 檢查是否有重複超過 4 張的牌
  const tileCountMap = new Map<string, number>();
  allTiles.forEach(tile => {
    const count = tileCountMap.get(tile.id) || 0;
    tileCountMap.set(tile.id, count + 1);
  });

  for (const [tileId, count] of tileCountMap.entries()) {
    if (count > 4) {
      return {
        isValid: false,
        errorMessage: `牌重複錯誤：${tileId} 超過 4 張（有 ${count} 張）`,
        details: {
          totalTiles: allTiles.length,
          requiredTiles: 17,
        },
      };
    }
  }

  // 檢查是否為有效的胡牌結構
  // 嘗試七對子
  if (isSevenPairs(allTiles)) {
    return {
      isValid: true,
      details: {
        totalTiles: allTiles.length,
        requiredTiles: 17,
      },
    };
  }

  // 嘗試標準型（4組+1對）
  if (isStandardWin(allTiles)) {
    return {
      isValid: true,
      details: {
        totalTiles: allTiles.length,
        requiredTiles: 17,
      },
    };
  }

  return {
    isValid: false,
    errorMessage: '不是有效的胡牌結構（需要 4組+1對 或 七對子）',
    details: {
      totalTiles: allTiles.length,
      requiredTiles: 17,
    },
  };
};

/**
 * 檢查是否為七對子
 */
const isSevenPairs = (tiles: Tile[]): boolean => {
  if (tiles.length !== 14) return false;

  // 計算每種牌的數量
  const tileCountMap = new Map<string, number>();
  tiles.forEach(tile => {
    const count = tileCountMap.get(tile.id) || 0;
    tileCountMap.set(tile.id, count + 1);
  });

  // 必須恰好有 7 種牌，每種 2 張
  if (tileCountMap.size !== 7) return false;

  for (const count of tileCountMap.values()) {
    if (count !== 2) return false;
  }

  return true;
};

/**
 * 檢查是否為標準型（N組+1對）
 * 接受 14 張（4組+1對）、17 張（5組+1對）、或更多（有槓）
 */
const isStandardWin = (tiles: Tile[]): boolean => {
  if (tiles.length < 14 || tiles.length > 21) return false;

  // 將牌轉換為數字表示（用於遞迴檢查）
  const tileArray = tilesToArray(tiles);

  // 計算需要的組數：
  // 標準：(總張數 - 2) / 3 = 組數
  // 但因為可能有槓（4張=1組），需要動態計算
  // 簡化：根據總張數推算
  // 14張=4組, 17張=5組, 18張=5組(1槓), 19張=5組(2槓), 20張=5組(3槓), 21張=5組(4槓)
  const meldsNeeded = Math.floor((tiles.length - 2) / 3);

  // 嘗試每種牌作為對子（眼睛）
  for (let i = 0; i < tileArray.length; i++) {
    if (tileArray[i] >= 2) {
      // 取出一對
      const remaining = [...tileArray];
      remaining[i] -= 2;

      // 檢查剩餘的牌是否能組成指定數量的組
      if (canFormMelds(remaining, meldsNeeded)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * 將牌轉換為數組表示
 * 索引對應：
 * 0-8: 萬 1-9
 * 9-17: 條 1-9
 * 18-26: 筒 1-9
 * 27-30: 東南西北
 * 31-33: 中發白
 */
const tilesToArray = (tiles: Tile[]): number[] => {
  const arr = new Array(34).fill(0);

  tiles.forEach(tile => {
    let index = -1;

    if (tile.type === 'wan') {
      index = (tile.value as number) - 1;
    } else if (tile.type === 'tiao') {
      index = 9 + (tile.value as number) - 1;
    } else if (tile.type === 'tong') {
      index = 18 + (tile.value as number) - 1;
    } else if (tile.type === 'wind') {
      const windMap: Record<string, number> = { east: 27, south: 28, west: 29, north: 30 };
      index = windMap[tile.value as string];
    } else if (tile.type === 'dragon') {
      const dragonMap: Record<string, number> = { white: 31, green: 32, red: 33 };
      index = dragonMap[tile.value as string];
    }

    if (index !== -1) {
      arr[index]++;
    }
  });

  return arr;
};

/**
 * 遞迴檢查是否能組成指定數量的組（順子或刻子）
 */
const canFormMelds = (tiles: number[], meldsNeeded: number): boolean => {
  if (meldsNeeded === 0) {
    // 檢查是否還有剩餘的牌
    return tiles.every(count => count === 0);
  }

  // 找到第一張牌
  const firstIndex = tiles.findIndex(count => count > 0);
  if (firstIndex === -1) return false;

  // 嘗試組成槓（四張相同）- 優先處理槓
  if (tiles[firstIndex] >= 4) {
    const remaining = [...tiles];
    remaining[firstIndex] -= 4;
    if (canFormMelds(remaining, meldsNeeded - 1)) {
      return true;
    }
  }

  // 嘗試組成刻子（三張相同）
  if (tiles[firstIndex] >= 3) {
    const remaining = [...tiles];
    remaining[firstIndex] -= 3;
    if (canFormMelds(remaining, meldsNeeded - 1)) {
      return true;
    }
  }

  // 嘗試組成順子（只適用於數牌：萬條筒）
  if (firstIndex < 27) { // 只有數牌可以組順子
    const suit = Math.floor(firstIndex / 9); // 0=萬, 1=條, 2=筒
    const rank = firstIndex % 9; // 0-8 代表 1-9

    // 檢查是否能組成順子（例如 1-2-3）
    if (rank <= 6) { // 最多到 7-8-9
      const next1 = suit * 9 + rank + 1;
      const next2 = suit * 9 + rank + 2;

      if (tiles[next1] > 0 && tiles[next2] > 0) {
        const remaining = [...tiles];
        remaining[firstIndex] -= 1;
        remaining[next1] -= 1;
        remaining[next2] -= 1;
        if (canFormMelds(remaining, meldsNeeded - 1)) {
          return true;
        }
      }
    }
  }

  return false;
};
