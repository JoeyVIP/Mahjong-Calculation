# 台麻計台器 🀄

最好用的台灣麻將計台工具 - 大按鈕設計、快速輸入、即時計算

## 專案簡介

這是一個專注於「極致易用」的台灣麻將計台網頁應用，採用手機優先的響應式設計，提供流暢的動畫體驗和直覺的操作介面。

### 核心特色

✅ **大按鈕設計** - 所有按鈕至少 60x60px，適合觸控操作
✅ **快速輸入** - 分類清楚，點選即加入手牌
✅ **即時計算** - 17 張自動觸發計算（開發中）
✅ **視覺精美** - 現代化漸層設計，流暢動畫效果
✅ **教育導向** - 幫助使用者學習如何算台（開發中）

## 技術棧

- **React 18** - 現代化的 UI 框架
- **TypeScript** - 型別安全
- **Vite** - 極速開發體驗
- **Tailwind CSS** - 實用優先的 CSS 框架
- **Framer Motion** - 流暢的動畫庫

## 快速開始

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問：http://localhost:5173

### 建置生產版本

```bash
npm run build
```

### 預覽建置結果

```bash
npm run preview
```

## 專案結構

```
mahjong-calculator/
├── .claude/              # 專案文檔
│   ├── project_brief.md
│   ├── requirements.md
│   ├── technical_spec.md
│   ├── ui_ux_spec.md
│   ├── mahjong_rules.md
│   ├── development_notes.md
│   ├── examples.md
│   ├── glossary.md
│   └── quick_start.md
├── src/
│   ├── components/       # React 組件
│   │   ├── Header/
│   │   ├── TileSelector/
│   │   ├── HandDisplay/
│   │   ├── SettingsPanel/ (待開發)
│   │   └── ResultPanel/   (待開發)
│   ├── constants/        # 常數定義
│   │   ├── tiles.ts
│   │   ├── rules.ts
│   │   └── animations.ts
│   ├── types/           # TypeScript 類型
│   │   └── index.ts
│   ├── utils/           # 工具函數 (待開發)
│   ├── hooks/           # 自訂 Hooks (待開發)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 目前進度

### ✅ 已完成

- [x] 專案初始化和配置
- [x] TypeScript 類型定義
- [x] 常數和規則定義
- [x] Header 組件
- [x] TileSelector 組件（選牌介面）
- [x] HandDisplay 組件（手牌顯示）
- [x] 基本動畫效果
- [x] 響應式佈局

### 🚧 開發中

- [ ] SettingsPanel 組件（遊戲設定）
- [ ] 計算引擎（台數計算邏輯）
- [ ] ResultPanel 組件（結果展示）
- [ ] 完整的動畫系統
- [ ] 金額計算功能

### 📋 待開發

- [ ] 規則說明彈窗
- [ ] 教學提示
- [ ] 測試覆蓋
- [ ] 效能優化
- [ ] PWA 支援

## 設計原則

### 大、快、美、學

- **大** - 按鈕要大，數字要大，易於觸控
- **快** - 流程要快，動畫要順，立即反饋
- **美** - 現代設計，漸層陰影，視覺愉悅
- **學** - 幫助理解，說明清楚，降低門檻

## 開發指南

詳細的開發文檔請參考 `.claude/` 資料夾中的文件：

- **project_brief.md** - 專案定位和核心理念
- **requirements.md** - 詳細需求和使用者故事
- **technical_spec.md** - 技術架構和資料結構
- **ui_ux_spec.md** - UI/UX 設計規範
- **mahjong_rules.md** - 台灣麻將規則
- **development_notes.md** - 開發筆記和待辦清單
- **examples.md** - 使用範例和測試案例
- **glossary.md** - 專案術語表

## 授權

MIT License

## 聯絡方式

如有問題或建議，歡迎提出 Issue 或 Pull Request！

---

**開發中** - 目前已完成基礎介面，正在開發計算引擎和設定面板。
