// 牌的類型
export type TileType = 'wan' | 'tiao' | 'tong' | 'wind' | 'dragon' | 'flower';

// 風位
export type Wind = 'east' | 'south' | 'west' | 'north';

// 胡牌方式
export type WinType = 'selfDraw' | 'discard';

// 麻將牌物件
export interface Tile {
  type: TileType;
  value: number | string; // 數字牌是 1-9，字牌是字串，花牌是字串
  id: string; // 唯一識別碼
  display: string; // 顯示文字
}

// 遊戲設定狀態
export interface GameSettings {
  roundWind: Wind; // 圈風
  seatWind: Wind; // 座位風/門風
  isDealer: boolean; // 是否為莊家
  dealerStreak: number; // 連莊次數（0=首次，1=連1，2=連2...）
  winType: WinType; // 自摸或胡別人
  isMenQing: boolean; // 是否門清
  baseAmount: number; // 底
  fanAmount: number; // 每台金額
}

// 牌的位置類型
export type TilePosition = 'hand' | 'exposed';

// 手牌狀態
export interface HandState {
  tiles: Tile[]; // 手牌
  exposedTiles: Tile[]; // 門前牌（吃碰槓）
  isValid: boolean; // 是否有效
  errorMessage?: string; // 錯誤訊息
}

// 台種
export interface FanType {
  name: string; // 台種名稱
  fan: number; // 台數
  description: string; // 簡短說明
  reason: string; // 為什麼符合這個台種
}

// 金額結算
export interface PaymentResult {
  selfDrawPayment?: {
    perPlayer: number; // 每家付
    total: number; // 總收入
  };
  discardPayment?: {
    loser: number; // 放槍者付
  };
}

// 計算結果
export interface CalculationResult {
  fanTypes: FanType[]; // 所有台種
  totalFan: number; // 總台數
  basePayment: number; // 底
  payment: PaymentResult; // 金額結算
  formula: string; // 計算公式文字
}

// 驗證結果
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  details?: {
    totalTiles: number;
    requiredTiles: number;
  };
}
