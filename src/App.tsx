import { useState, useCallback } from 'react'
import { Tile, TilePosition } from './types'
import Header from './components/Header/Header'
import HandDisplay from './components/HandDisplay/HandDisplay'
import TileSelector from './components/TileSelector/TileSelector'

function App() {
  const [handTiles, setHandTiles] = useState<Tile[]>([]);
  const [exposedTiles, setExposedTiles] = useState<Tile[]>([]);
  const [inputMode, setInputMode] = useState<TilePosition>('hand');

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
      if (inputMode === 'hand') {
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

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-mahjong-green-dark to-mahjong-green-light">
      <main className="flex-1 flex flex-col min-h-0">
        <HandDisplay
          handTiles={handTiles}
          exposedTiles={exposedTiles}
          inputMode={inputMode}
          onRemoveTile={handleRemoveTile}
          onToggleInputMode={() => setInputMode(prev => prev === 'hand' ? 'exposed' : 'hand')}
        />

        <TileSelector
          onTileSelect={handleTileSelect}
          getTileCount={getTileCount}
        />
      </main>
    </div>
  )
}

export default App
