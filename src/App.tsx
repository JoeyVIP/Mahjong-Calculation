import { useState, useCallback } from 'react'
import { Tile, TilePosition, GameSettings, CalculationResult } from './types'
import { DEFAULT_GAME_SETTINGS } from './constants/rules'
import { validateHand } from './utils/validator'
import { calculateFan } from './utils/calculator'
import HandDisplay from './components/HandDisplay/HandDisplay'
import TileSelector from './components/TileSelector/TileSelector'
import SettingsPanel from './components/SettingsPanel/SettingsPanel'
import ResultPanel from './components/ResultPanel/ResultPanel'

function App() {
  const [handTiles, setHandTiles] = useState<Tile[]>([]);
  const [exposedTiles, setExposedTiles] = useState<Tile[]>([]);
  const [inputMode, setInputMode] = useState<TilePosition>('hand');
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  // 計算特定牌的已選數量（包含手牌和門前）
  const getTileCount = useCallback((tileId: string): number => {
    const handCount = handTiles.filter(tile => tile.id === tileId).length;
    const exposedCount = exposedTiles.filter(tile => tile.id === tileId).length;
    return handCount + exposedCount;
  }, [handTiles, exposedTiles]);

  // 選擇牌
  const handleTileSelect = useCallback((tile: Tile) => {
    const currentCount = getTileCount(tile.id);

    // 花牌只有1張，其他牌最多4張
    const maxCount = tile.type === 'flower' ? 1 : 4;

    if (currentCount < maxCount) {
      // 花牌強制進入門前，其他牌根據 inputMode 決定
      if (tile.type === 'flower') {
        setExposedTiles(prev => [...prev, tile]);
      } else if (inputMode === 'hand') {
        setHandTiles(prev => [...prev, tile]);
      } else {
        setExposedTiles(prev => [...prev, tile]);
      }
    }
  }, [getTileCount, inputMode]);

  // 移除牌
  const handleRemoveTile = useCallback((index: number, position: TilePosition) => {
    if (position === 'hand') {
      setHandTiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setExposedTiles(prev => prev.filter((_, i) => i !== index));
    }
  }, []);

  // 更新設定
  const handleSettingsChange = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // 清空所有牌
  const handleClearAll = useCallback(() => {
    setHandTiles([]);
    setExposedTiles([]);
  }, []);

  // 重新開始
  const handleRestart = useCallback(() => {
    setHandTiles([]);
    setExposedTiles([]);
    setCalculationResult(null);
    setShowSettings(false);
  }, []);

  // 計算不含花牌的實際張數
  const handCountWithoutFlower = handTiles.filter(tile => tile.type !== 'flower').length;
  const exposedCountWithoutFlower = exposedTiles.filter(tile => tile.type !== 'flower').length;
  const totalCountWithoutFlower = handCountWithoutFlower + exposedCountWithoutFlower;

  // 判斷是否可以進入結算：
  // 台灣麻將：基本需要17張（5組×3 + 1對×2）
  // 有槓的時候：每個槓多1張，所以17張+槓數×1
  // 最多4個槓 = 17+4 = 21張
  // 簡化：只要 >= 17張就允許結算（讓驗證器去判斷是否真的胡牌）
  const isFull = totalCountWithoutFlower >= 17;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-mahjong-green-dark to-mahjong-green-light">
      <main className="flex-1 flex flex-col min-h-0">
        <HandDisplay
          handTiles={handTiles}
          exposedTiles={exposedTiles}
          inputMode={inputMode}
          onRemoveTile={handleRemoveTile}
          onToggleInputMode={() => setInputMode(prev => prev === 'hand' ? 'exposed' : 'hand')}
          onOpenSettings={() => setShowSettings(true)}
          onSetInputMode={setInputMode}
        />

        <TileSelector
          onTileSelect={handleTileSelect}
          getTileCount={getTileCount}
          isFull={isFull}
          onCalculate={() => setShowSettings(true)}
          onClear={handleClearAll}
        />
      </main>

      {/* 設定面板浮動視窗 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">遊戲設定</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-white bg-white/20 hover:bg-white/30 rounded-full p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SettingsPanel
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />

            {/* 確認按鈕 */}
            {isFull && (
              <button
                onClick={() => {
                  const validation = validateHand(handTiles, exposedTiles);
                  if (validation.isValid) {
                    // 執行計算
                    const result = calculateFan(handTiles, exposedTiles, settings);
                    setCalculationResult(result);
                    setShowSettings(false);
                  } else {
                    alert(`驗證失敗：${validation.errorMessage}`);
                  }
                }}
                className="w-full mt-4 py-4 rounded-xl font-bold text-xl text-white bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
              >
                確認並計算
              </button>
            )}
          </div>
        </div>
      )}

      {/* 結果面板 */}
      {calculationResult && (
        <ResultPanel
          result={calculationResult}
          onClose={() => setCalculationResult(null)}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}

export default App
