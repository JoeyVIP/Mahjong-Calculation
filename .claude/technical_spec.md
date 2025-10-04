# 技術規格

## 系統架構

- **前端框架**：React 18 + TypeScript
- **樣式方案**：Tailwind CSS
- **動畫庫**：Framer Motion（流暢的現代動畫）
- **建置工具**：Vite（快速開發和建置）
- **部署方式**：靜態網頁託管（Vercel、Netlify等）

### 技術選型理由：
- **React**：組件化開發，狀態管理簡單
- **TypeScript**：型別安全，減少錯誤
- **Tailwind**：快速開發美觀介面
- **Framer Motion**：製作流暢動畫的最佳選擇
- **Vite**：極快的開發體驗

## 資料結構設計

### 麻將牌物件
```typescript
interface Tile {
  type: 'wan' | 'tiao' | 'tong' | 'wind' | 'dragon' | 'flower';
  value: number | string;
  id: string;
}
```

### 遊戲設定狀態
```typescript
interface GameSettings {
  roundWind: 'east' | 'south' | 'west' | 'north';
  seatWind: 'east' | 'south' | 'west' | 'north';
  isDealer: boolean;
  dealerStreak: number;
  winType: 'selfDraw' | 'discard';
  isMenQing: boolean;
  baseAmount: number;
  fanAmount: number;
}
```

### 手牌狀態
```typescript
interface HandState {
  tiles: Tile[];
  isValid: boolean;
  errorMessage?: string;
}
```

### 計算結果
```typescript
interface CalculationResult {
  fanTypes: FanType[];
  totalFan: number;
  basePayment: number;
  selfDrawPayment?: {
    perPlayer: number;
    total: number;
  };
  discardPayment?: {
    loser: number;
  };
  formula: string;
}

interface FanType {
  name: string;
  fan: number;
  description: string;
  reason: string;
}
```

## 核心模組設計

### 組件結構
```
App
├── Header（標題和Logo）
├── SettingsPanel（遊戲設定）
│   ├── WindSelector（圈風選擇）
│   ├── SeatSelector（座位風選擇）
│   ├── DealerToggle（莊家切換）
│   ├── WinTypeToggle（自摸/胡別人）
│   └── BaseAmountSelector（底台設定）
├── TileSelector（選牌區）
│   ├── CategoryTabs（分類標籤）
│   └── TileGrid（牌面網格）
├── HandDisplay（手牌顯示）
│   ├── TileList（牌列表）
│   └── HandStats（統計資訊）
├── ResultPanel（結果面板）
│   ├── TotalFanDisplay（總台數）
│   ├── FanList（台種列表）
│   ├── PaymentCalculation（金額計算）
│   └── FormulaDisplay（計算公式）
└── ActionButtons（操作按鈕）
```

### 計算引擎模組
```typescript
// 驗證手牌結構
function validateHand(tiles: Tile[]): ValidationResult

// 計算所有台種
function calculateAllFans(
  tiles: Tile[],
  settings: GameSettings
): FanType[]

// 計算圈風台
function calculateRoundWindFan(tiles: Tile[], roundWind: Wind): FanType | null

// 計算門風台
function calculateSeatWindFan(tiles: Tile[], seatWind: Wind): FanType | null

// 計算莊家台
function calculateDealerFan(
  isDealer: boolean,
  dealerStreak: number
): FanType | null

// 計算金額
function calculatePayment(
  totalFan: number,
  settings: GameSettings
): PaymentResult
```

### 動畫配置
```typescript
// 按鈕點擊動畫
const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 }
}

// 牌加入動畫
const tileEntry = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
  transition: { type: "spring", stiffness: 500, damping: 30 }
}

// 結果顯示動畫
const resultEntry = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.3 }
}
```

## 狀態管理策略
- 使用React Hooks管理狀態
- 主要狀態：手牌、設定、計算結果
- 狀態更新即觸發重新計算
- 不使用Redux等複雜方案，保持簡單

## 效能優化
- useMemo快取計算結果
- useCallback避免不必要的重新渲染
- 虛擬滾動（如果列表很長）
- 圖片延遲載入
- 程式碼分割（如果需要）
