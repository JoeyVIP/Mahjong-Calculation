import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tile, TilePosition } from '../../types';
import { tileEntry } from '../../constants/animations';
import { getTileSvgPath } from '../../utils/tileImages';

interface HandDisplayProps {
  handTiles: Tile[];
  exposedTiles: Tile[];
  inputMode: TilePosition;
  onRemoveTile: (index: number, position: TilePosition) => void;
  onToggleInputMode: () => void;
  onOpenSettings: () => void;
  onSetInputMode: (mode: TilePosition) => void;
}

const HandDisplay = ({ handTiles, exposedTiles, inputMode, onRemoveTile, onOpenSettings, onSetInputMode }: HandDisplayProps) => {
  // 追蹤最後點擊的牌（用於實現二次點擊移除）
  const [lastClickedTile, setLastClickedTile] = useState<{ position: TilePosition; index: number } | null>(null);

  // 計算槓的數量（4張相同的牌為1個槓）
  const countKongs = (tiles: Tile[]): number => {
    const tilesWithoutFlower = tiles.filter(tile => tile.type !== 'flower');
    const counts = new Map<string, number>();
    tilesWithoutFlower.forEach(tile => {
      counts.set(tile.id, (counts.get(tile.id) || 0) + 1);
    });

    let kongCount = 0;
    counts.forEach(count => {
      if (count === 4) kongCount++;
    });

    return kongCount;
  };

  // 計算不含花牌的實際張數
  const handCountWithoutFlower = handTiles.filter(tile => tile.type !== 'flower').length;
  const exposedCountWithoutFlower = exposedTiles.filter(tile => tile.type !== 'flower').length;
  const totalCountWithoutFlower = handCountWithoutFlower + exposedCountWithoutFlower;

  // 計算花牌數量（用於顯示）
  const flowerCount = handTiles.filter(tile => tile.type === 'flower').length +
                      exposedTiles.filter(tile => tile.type === 'flower').length;

  // 計算槓的數量並動態調整上限
  const totalKongs = countKongs([...handTiles, ...exposedTiles]);
  const requiredTiles = 17 + totalKongs; // 無槓17張，每多1個槓就+1

  // 超過上限檢查（最多21張：17 + 4個槓）
  const isOverLimit = totalCountWithoutFlower > 21;

  // 處理牌的點擊（二次點擊移除）
  const handleTileClick = (index: number, position: TilePosition) => {
    if (lastClickedTile?.position === position && lastClickedTile?.index === index) {
      // 第二次點擊同一張牌 → 移除
      onRemoveTile(index, position);
      setLastClickedTile(null);
    } else {
      // 第一次點擊 → 記錄
      setLastClickedTile({ position, index });
    }
  };

  const renderTiles = (tiles: Tile[], position: TilePosition, emptyMessage: string, tileSize: { width: number; height: number }) => {
    if (tiles.length === 0) {
      return (
        <motion.div
          className="w-full text-gray-400 text-xs py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {emptyMessage}
        </motion.div>
      );
    }

    return tiles.map((tile, index) => {
      const svgPath = getTileSvgPath(tile.type, tile.value);
      const hasImage = !!svgPath;
      const isLastClicked = lastClickedTile?.position === position && lastClickedTile?.index === index;

      return (
        <motion.button
          key={`${position}-${tile.id}-${index}`}
          onClick={() => handleTileClick(index, position)}
          className={`relative bg-gradient-to-br from-white via-gray-50 to-gray-100 border-2 rounded-lg transition-all group shadow-md overflow-hidden ${
            isLastClicked ? 'border-yellow-400 shadow-yellow-200' : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
          }`}
          style={{ width: `${tileSize.width}px`, height: `${tileSize.height}px` }}
          variants={tileEntry}
          initial="initial"
          animate="animate"
          exit="exit"
          layout
        >
          <div className="absolute inset-0 flex items-center justify-center p-1">
            {hasImage ? (
              <img
                src={svgPath}
                alt={tile.display}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className={`text-sm font-bold ${getTileColor(tile.type)}`}>
                {tile.display}
              </span>
            )}
          </div>
          {isLastClicked && (
            <div className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-yellow-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs shadow-lg">
              ✓
            </div>
          )}
        </motion.button>
      );
    });
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 shadow-lg border-b border-gray-200 shrink-0">
      <div className="px-3 py-2">
        {isOverLimit && (
          <motion.div
            className="mb-2 text-xs text-red-500 font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⚠️ 超過上限（21張），請移除多餘的牌
          </motion.div>
        )}

        {/* 門前牌區域 + 控制區（同一列）*/}
        <div className="flex items-start justify-between mb-1">
          {/* 左側：門前區域 */}
          <div
            className="flex-1 cursor-pointer"
            onClick={() => onSetInputMode('exposed')}
          >
            <h3 className={`text-xs font-medium mb-1 ${inputMode === 'exposed' ? 'text-blue-600' : 'text-gray-500'}`}>
              門前 {inputMode === 'exposed' && '●'}
            </h3>
            <div className="flex flex-wrap gap-1.5 min-h-[45px]">
              <AnimatePresence>
                {renderTiles(exposedTiles, 'exposed', '點此輸入門前牌', { width: 32, height: 40 })}
              </AnimatePresence>
            </div>
          </div>

          {/* 右側：控制區 */}
          <div className="flex flex-col items-end gap-1 ml-3">
            {/* 張數顯示 */}
            <div className="flex flex-col items-end">
              <div className={`text-xl font-bold ${
                isOverLimit ? 'text-red-500' : totalCountWithoutFlower >= requiredTiles ? 'text-green-600' : 'text-gray-600'
              }`}>
                {totalCountWithoutFlower}/{requiredTiles}
              </div>
              {flowerCount > 0 && (
                <div className="text-xs text-pink-600">
                  +{flowerCount}花
                </div>
              )}
            </div>
            {/* 設定按鈕 */}
            <motion.button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 shadow-[0_2px_0_0_rgba(0,0,0,0.1)] active:shadow-[0_1px_0_0_rgba(0,0,0,0.1)] active:translate-y-[1px] border-t border-white/50"
              whileTap={{ y: 1 }}
            >
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* 手牌區域（靠左）*/}
        <div
          className="cursor-pointer"
          onClick={() => onSetInputMode('hand')}
        >
          <h3 className={`text-xs font-medium mb-1 ${inputMode === 'hand' ? 'text-blue-600' : 'text-gray-500'}`}>
            手牌 {inputMode === 'hand' && '●'}
          </h3>
          <div className="flex flex-wrap gap-2 min-h-[65px]">
            <AnimatePresence>
              {renderTiles(handTiles, 'hand', '點此輸入手牌', { width: 48, height: 60 })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const getTileColor = (type: string): string => {
  switch (type) {
    case 'wan':
      return 'text-blue-600';
    case 'tiao':
      return 'text-green-600';
    case 'tong':
      return 'text-orange-600';
    case 'wind':
      return 'text-purple-600';
    case 'dragon':
      return 'text-red-600';
    case 'flower':
      return 'text-pink-600';
    default:
      return 'text-gray-800';
  }
};

export default HandDisplay;
